import { tileChosen } from '../actions/PlayerActions.js';

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

  return {
    getCurrentPlayer,
    isCurrentPlayer,
    isTileUnoccupied,
    getValidActions
  }
}
