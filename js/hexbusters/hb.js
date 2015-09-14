import { tileChosen } from '../actions/PlayerActions.js';
import _ from 'lodash';
import { getTileCoordinatesById, getShortestPathsFromTileId } from 'hex-grid.js';
import GridSettings from '../constants/GridSettings.js';

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
    return game.tileColours[tileId] === null;
  };

  const getUnoccupiedTiles = () => {
    return _.pick(
      game.tileColours,
      colour => colour === null
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
    const validStartTiles = _.where(
      game.tiles,
      tile => getTileCoordinatesById(tile.id).x === 0 &&
        tile.colour !== null
    );

    const validEndTiles = _.where(
      game.tiles,
      tile => getTileCoordinatesById(tile.id).x === 4 &&
        tile.colour !== null
    );

    let winningStartTile = _.find(
      validStartTiles,
      tile => {
        let paths = getShortestPathsFromTileId(
          GridSettings,
          tile.id,
          {
            moveCost: (fromTileId, toTileId) => {
              let fromTile = _.where(game.tiles, {id: fromTileId});
              let toTile = _.where(game.tiles, {id: toTileId});

              return fromTile.colour === toTile.colour ?
                0 : Number.POSITIVE_INFINITY;
            },
            maxCost: 100
          }
        );

        let winningStartTiles = _.intersection(
          Object.keys(paths),
          _.pluck(validEndTiles, 'id')
        );

        if (winningStartTiles.length > 0) {
          return true;
        }

        return false;
      }
    );

    if (winningStartTile) {
      return winningStartTile.colour;
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
