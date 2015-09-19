import { tileChosen } from '../actions/PlayerActions.js';
import _ from 'lodash';
import { getTileCoordinatesById, getShortestPathsFromTileId } from 'hex-grid.js';
import { COLOUR_NEUTRAL } from '../constants/Colours.js';

export default function hb(game) {
  const getCurrentPlayer = () => {
      if (game.players === undefined || game.players.length === 0) {
        return null;
      }

      return game.players[game.currentPlayerIdx % game.players.length];
  };

  const isCurrentPlayer = (player) => {
    if (game.players === undefined) {
      return false;
    }

    const currentPlayer = getCurrentPlayer(game);
    if (currentPlayer === null) {
      return false;
    }

    return currentPlayer.name === player.name;
  };

  const isTileUnoccupied = (tileId) => {
    return game.tileColours.get(tileId) === COLOUR_NEUTRAL;
  };

  const getUnoccupiedTiles = () => {
    return game.tileColours.filter(
      colour => colour === COLOUR_NEUTRAL
    );
  }

  const getValidActions = () => {
    return getUnoccupiedTiles().map(
      (colour, tileId) => {
        return tileChosen({
          tileId: tileId,
          colour: getCurrentPlayer(game).colour
        })
      });
  };

  const getWinner = (gridSettings) => {
    const validStartTiles = game.tileColours.filter(
      (colour, tileId) =>
        getTileCoordinatesById(tileId).x === 0 &&
        colour !== COLOUR_NEUTRAL
    );

    const validEndTiles = game.tileColours.filter(
      (colour, tileId) =>
        getTileCoordinatesById(tileId).x === gridSettings.width - 1 &&
        colour !== COLOUR_NEUTRAL
    );

    let winningColour = validStartTiles.find(
      (colour, tileId) => {
        let paths = getShortestPathsFromTileId(
          gridSettings,
          tileId,
          {
            moveCost: (fromTileId, toTileId) => {
              return game.tileColours.get(fromTileId) === game.tileColours.get(toTileId) ?
                0 :
                Number.POSITIVE_INFINITY;
            },
            maxCost: 100
          }
        );

        let winningEndTiles = _.intersection(
          Object.keys(paths),
          Object.keys(validEndTiles.toJS())
        );

        if (winningEndTiles.length > 0) {
          return true;
        }

        return false;
      }
    );

    if (winningColour) {
      return winningColour;
    }

    return null;
  }

  return {
    getCurrentPlayer,
    isCurrentPlayer,
    isTileUnoccupied,
    getValidActions,
    getWinner
  }
}
