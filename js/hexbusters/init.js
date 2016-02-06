import { COLOUR_NEUTRAL } from '../constants/Colours.js';
import { getTileIds } from 'hex-grid';
import Immutable from 'immutable';
import _ from 'lodash';

export default (grid) => {
  return {
    players: [],
    numPlayers: 2,
    messages: [],
    board: Immutable.fromJS({
      currentPlayerIdx: 0,
      // tileColours is an object mapping the tileId to the tile colour.
      // The tileColour can COLOUR_NEUTRAL, COLOUR_RED, COLOUR_BLUE or null. Null
      // means the tile cannot be occupied.
      tileColours: _.chain(getTileIds(grid))
        .indexBy()
        .mapValues(() => COLOUR_NEUTRAL)
        .value()
    }),
    blueTiles: {},
    redTiles: {}
  };
}
