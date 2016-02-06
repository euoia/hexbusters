import { tileChosen } from '../actions/PlayerActions.js';
import { getTileIdByCoordinates, hasPath } from 'hex-grid';
import { COLOUR_BLUE, COLOUR_RED, COLOUR_NEUTRAL } from '../constants/Colours.js';

const getCurrentPlayer = (state) => {
    if (state.players === undefined || state.players.length === 0) {
      return null;
    }

    return state.players[state.board.get('currentPlayerIdx') % state.players.length];
};

const isCurrentPlayer = (state, player) => {
  if (state.players === undefined) {
    return false;
  }

  const currentPlayer = getCurrentPlayer(state);
  if (currentPlayer === null) {
    return false;
  }

  return currentPlayer.name === player.name;
};

const isTileUnoccupied = (state, tileId) => {
  return state.board.getIn(['tileColours', tileId]) === COLOUR_NEUTRAL;
};

const getUnoccupiedTiles = (state) => {
  return state.board.get('tileColours').filter(
    colour => colour === COLOUR_NEUTRAL
  );
}

const getValidActions = (state) => {
  return getUnoccupiedTiles(state).map(
    (colour, tileId) => {
      return tileChosen({
        tileId: tileId,
        colour: getCurrentPlayer(state).colour
      })
    }).toArray();
};

/**
 * A fast getWinner function is critical to performance of the AI.
 */
const getWinner = (state, GRID) => {
  var i;

  let blueStartTiles = [];
  let blueEndTiles = [];
  for (i = 0; i < GRID.height; i += 1) {
    blueStartTiles.push(getTileIdByCoordinates(GRID, 0, i));
    blueEndTiles.push(getTileIdByCoordinates(GRID, GRID.width - 1, i));
  }

  let redStartTiles = [];
  let redEndTiles = [];
  for (i = 0; i < GRID.width; i += 1) {
    redStartTiles.push(getTileIdByCoordinates(GRID, i, 0));
    redEndTiles.push(getTileIdByCoordinates(GRID, i, GRID.height - 1));
  }

  const blueWin = hasPath(
    GRID,
    blueStartTiles,
    blueEndTiles,
    { isPathable: (tileId) => state.blueTiles[tileId] === true }
  );

  if (blueWin) {
    return COLOUR_BLUE;
  }

  const redWin = hasPath(
    GRID,
    redStartTiles,
    redEndTiles,
    { isPathable: (tileId) => state.redTiles[tileId] === true }
  );

  if (redWin) {
    return COLOUR_RED;
  }

  return null;
}

export default {
  getCurrentPlayer,
  isCurrentPlayer,
  isTileUnoccupied,
  getValidActions,
  getWinner
};
