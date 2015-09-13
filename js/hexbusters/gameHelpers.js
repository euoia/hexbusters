export function getCurrentPlayer (game) {
  if (game.players === undefined || game.players.length === 0) {
    return null;
  }

  return game.players[game.currentPlayerIdx % game.players.length];
}

export function isCurrentPlayer (game, player) {
  if (game.players === undefined) {
    return false;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (currentPlayer === null) {
    return false;
  }

  return currentPlayer.name === player.name;
}

export function isTileUnoccupied (tile) {
  return tile.colour === null;
}

export function getUnoccupiedTiles(game) {
  return game.board.tiles.filter(
    tile => isTileUnoccupied(tile)
  ).map(
    tile => tile.id
  );
}
