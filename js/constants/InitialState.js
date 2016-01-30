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
      .mapValues((tileId) => {
        const { x, y } = getTileCoordinatesById(GridSettings, tileId);

        // Left-bottom edge of the rhombus, not playable.
        if (y > 2 * x) {
          return null;
        }

        // Right-bottom edge of the rhombus, not playable.
        if (y < (2 * x) - ((GridSettings.height * 2) - 1)) {
          return null;
        }

        let leftBorder = false, topBorder = false, rightBorder = false,
          bottomBorder = false;

        if (y === 0) {
          topBorder = true;
        }

        if (y === GridSettings.height - 1) {
          bottomBorder = true;
        }

        if (x === Math.ceil(y / 2)) {
          leftBorder = true;
        }

        if (x === Math.ceil(y /2) + GridSettings.rhombusWidth - 1) {
          rightBorder = true;
        }

        if (topBorder && leftBorder) {
          return null;
        }

        if (topBorder && rightBorder) {
          return BORDER_TOP_RIGHT;
        }

        if (rightBorder && bottomBorder) {
          return null;
        }

        if (leftBorder && bottomBorder) {
          return BORDER_BOTTOM_LEFT;
        }

        if (leftBorder && y === 1) {
          return BORDER_TOP_LEFT_BLUE;
        }

        if (topBorder && x === 1) {
          return BORDER_TOP_LEFT_RED;
        }

        if (bottomBorder && x === Math.ceil(y /2) + GridSettings.rhombusWidth - 2) {
          return BORDER_BOTTOM_RIGHT_RED;
        }

        if (rightBorder && y === GridSettings.height - 2) {
          return BORDER_BOTTOM_RIGHT_BLUE;
        }

        if (leftBorder) {
          return BORDER_LEFT;
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

        return COLOUR_NEUTRAL;
      })
      .value()
  })
}
