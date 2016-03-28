/* eslint-env mocha */
import expect from 'expect.js';
import { COLOUR_BLUE, COLOUR_RED } from '../../js/constants/Colours.js';
import { tileChosen } from '../../js/actions/PlayerActions.js';
import { playersJoin } from '../../js/actions/GameActions.js';
import gameReducer from '../../js/reducers/hexbusters.js';
import _ from 'lodash';
import init from '../../js/hexbusters/init.js';
import { getTileIdByCoordinates } from 'hex-grid';

const grid = {
  width: 3,
  height: 3,
  orientation: 'pointy-topped',
  layout: 'odd-r',
  shape: 'parallelogram'
};
const gameState = init(grid);

describe('hexbusters', function() {
  describe('gameReducer', function() {
    it('should return the correct winner (red)', function() {
      const actions = [
        playersJoin([{colour: COLOUR_RED}, {colour: COLOUR_BLUE}]),
        tileChosen({tileId: getTileIdByCoordinates(grid, 0, 0), colour: COLOUR_RED }),
        tileChosen({tileId: getTileIdByCoordinates(grid, 1, 0), colour: COLOUR_BLUE }),
        tileChosen({tileId: getTileIdByCoordinates(grid, 0, 1), colour: COLOUR_RED }),
        tileChosen({tileId: getTileIdByCoordinates(grid, 1, 1), colour: COLOUR_BLUE }),
        tileChosen({tileId: getTileIdByCoordinates(grid, 0, 2), colour: COLOUR_RED })
      ];

      const testState = _.reduce(
        actions,
        (gameState, action) => gameReducer(gameState, action),
        gameState
      );

      expect(testState.winner).to.equal(COLOUR_RED);
    });

    it('should return no winner', function() {
      const actions = [
        playersJoin([{colour: COLOUR_RED}, {colour: COLOUR_BLUE}]),
        tileChosen({tileId: getTileIdByCoordinates(grid, 0, 0), colour: COLOUR_RED }),
        tileChosen({tileId: getTileIdByCoordinates(grid, 1, 0), colour: COLOUR_BLUE }),
        tileChosen({tileId: getTileIdByCoordinates(grid, 0, 1), colour: COLOUR_RED }),
        tileChosen({tileId: getTileIdByCoordinates(grid, 1, 1), colour: COLOUR_BLUE })
      ];

      const testState = _.reduce(
        actions,
        (gameState, action) => gameReducer(gameState, action),
        gameState
      );

      expect(testState.winner).to.equal(null);
    });
  });
});
