import { COLOUR_NEUTRAL, BORDER_LEFT, BORDER_TOP,
  BORDER_TOP_RIGHT, BORDER_RIGHT, BORDER_BOTTOM,
  BORDER_BOTTOM_LEFT, BORDER_TOP_LEFT_BLUE, BORDER_TOP_LEFT_RED,
  BORDER_BOTTOM_RIGHT_RED, BORDER_BOTTOM_RIGHT_BLUE
} from '../constants/Colours.js';
import Immutable from 'immutable';
import _ from 'lodash';
import { getTileIds, getTileCoordinatesById } from 'hex-grid';
import GridSettings from '../constants/GridSettings.js';

export default {
  players: [],
  numPlayers: 2,
  messages: [],
  board: Immutable.fromJS({
    currentPlayerIdx: 0,
    // tileColours is an object mapping the tileId to the tile colour.
    // The tileColour can COLOUR_NEUTRAL, COLOUR_RED, COLOUR_BLUE or null. Null
    // means the tile cannot be occupied.
    tileColours: _.chain(getTileIds(GridSettings))
      .indexBy()
      .mapValues(() => COLOUR_NEUTRAL)
      .value()
  }),
  blueTiles: {},
  redTiles: {}
}

// TODO: Replace this.
function getBorderColour(tileId) {
  /* eslint no-unused-vars: [0] */
  const { x, y } = getTileCoordinatesById(GridSettings, tileId);

  let leftBorder = false, topBorder = false, rightBorder = false,
    bottomBorder = false;

  if (y === 0) {
    topBorder = true;
  }

  if (y === GridSettings.height - 1) {
    bottomBorder = true;
  }

  if (x === 0) {
    leftBorder = true;
  }

  if (x === GridSettings.width - 1) {
    rightBorder = true;
  }

  if (leftBorder && topBorder) {
    return null;
  }

  if (bottomBorder && rightBorder) {
    return null;
  }

  if (leftBorder && y === 1) {
    return BORDER_TOP_LEFT_BLUE;
  }

  if (topBorder && x === 1) {
    return BORDER_TOP_LEFT_RED;
  }

  if (leftBorder && bottomBorder) {
    return BORDER_BOTTOM_LEFT;
  }

  if (bottomBorder && x === GridSettings.width - 2) {
    return BORDER_BOTTOM_RIGHT_RED;
  }

  if (rightBorder && y === GridSettings.height - 2) {
    return BORDER_BOTTOM_RIGHT_BLUE;
  }

  if (topBorder && rightBorder) {
    return BORDER_TOP_RIGHT;
  }

  if (topBorder) {
    return BORDER_TOP;
  }

  if (rightBorder) {
    return BORDER_RIGHT;
  }

  if (bottomBorder) {
    return BORDER_BOTTOM;
  }

  if (leftBorder) {
    return BORDER_LEFT;
  }

  return COLOUR_NEUTRAL;
}
