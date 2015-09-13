import { tileChosen } from '../actions/PlayerActions.js';
import _ from 'lodash';

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

  const isTileUnoccupied = (tile) => {
    return tile.colour === null;
  };

  const getUnoccupiedTiles = () => {
    return game.board.tiles.filter(
      tile => isTileUnoccupied(tile)
    ).map(
      tile => tile.id
    );
  }

  const getValidActions = () => {
    return getUnoccupiedTiles(game)
      .map(tileId => {
        return tileChosen({
          tileId,
          colour: getCurrentPlayer(game).colour
        })
      });
  };

  const getWinner = () => {
    const getPositionById = game.board.getPositionById.bind(game.board);
    const validStartTiles = game.board.tiles.filter(
      tile => getPositionById(tile.id).x === 0 &&
        tile.colour !== null
    );

    const validEndTiles = game.board.tiles.filter(
      tile => getPositionById(tile.id).x === 4 &&
        tile.colour !== null
    );

    let winningStartTile = validStartTiles.find(
      tile => {
        let paths = game.board.getShortestPathsFromTileId(
          tile.id,
          {
            moveCost: (fromTile, toTile) => {
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
