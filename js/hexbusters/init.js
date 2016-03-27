import { getTileIds, getTileIdByCoordinates } from 'hex-grid';
import { COLOUR_RED, COLOUR_BLUE } from '../constants/Colours.js';
import _ from 'lodash';
import { Set } from 'immutable';

// We can't store the tiles as a Set because it's not supported in the web browser.
// "Set is not function".
export default (grid) => {
  return {
    currentPlayerIdx: 0,
    grid: grid,
    messages: [],
    numPlayers: 2,
    players: [],
    startTiles: {
      [COLOUR_RED]: _.chain(_.range(0, grid.width)).flatMap(
        x => [getTileIdByCoordinates(grid, x, 0)]
      ).value(),
      [COLOUR_BLUE]: _.chain(_.range(0, grid.height)).flatMap(
        y => [getTileIdByCoordinates(grid, 0, y)]
      ).value()
    },
    endTiles: {
      [COLOUR_RED]: _.chain(_.range(0, grid.width)).flatMap(
        x => [getTileIdByCoordinates(grid, x, grid.height -1)]
      ).value(),
      [COLOUR_BLUE]: _.chain(_.range(0, grid.height)).flatMap(
        y => [getTileIdByCoordinates(grid, grid.width -1, y)]
      ).value()
    },
    tiles: {
      neutral: new Set(getTileIds(grid)),
      blue: new Set(),
      red: new Set()
    },
    winner: null
  };
}
