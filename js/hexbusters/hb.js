import { tileChosen } from '../actions/PlayerActions.js';
import _ from 'lodash';
import { getTileCoordinatesById, getShortestPathsFromTileId } from 'hex-grid.js';
import GridSettings from '../constants/GridSettings.js';
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
    return game.tileColours[tileId] === COLOUR_NEUTRAL;
  };

  const getUnoccupiedTiles = () => {
    return _.pick(
      game.tileColours,
      colour => colour === COLOUR_NEUTRAL
    );
  }

  const getValidActions = () => {
    return _.map(
      getUnoccupiedTiles(),
      (colour, tileId) => {
        return tileChosen({
          tileId: tileId,
          colour: getCurrentPlayer(game).colour
        })
      });
  };

  const getWinner = () => {
    const validStartTiles = _.pick(
      game.tileColours,
      (colour, tileId) =>
        getTileCoordinatesById(tileId).x === 0 &&
        colour !== COLOUR_NEUTRAL
    );

    const validEndTiles = _.pick(
      game.tileColours,
      (colour, tileId) =>
        getTileCoordinatesById(tileId).x === 4 &&
        colour !== COLOUR_NEUTRAL
    );

    let winningColour = _.find(
      validStartTiles,
      (colour, tileId) => {
        let paths = getShortestPathsFromTileId(
          GridSettings,
          tileId,
          {
            moveCost: (fromTileId, toTileId) => {
              return game.tileColours[fromTileId] === game.tileColours[toTileId] ?
                0 : Number.POSITIVE_INFINITY;
            },
            maxCost: 100
          }
        );

        let winningStartTiles = _.intersection(
          Object.keys(paths),
          Object.keys(validEndTiles)
        );

        if (winningStartTiles.length > 0) {
          return true;
        }

        return false;
      }
    );

    if (winningColour) {
      return winningColour;
    }

    return COLOUR_NEUTRAL;
  }

  return {
    getCurrentPlayer,
    isCurrentPlayer,
    isTileUnoccupied,
    getValidActions,
    getWinner
  }
}
