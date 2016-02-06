/* eslint-env mocha */
import expect from 'expect.js';
import helpers from '../../js/hexbusters/helpers.js';
import { COLOUR_BLUE, COLOUR_RED } from '../../js/constants/Colours.js';
import { tileChosen } from '../../js/actions/PlayerActions.js';
import { playersJoin } from '../../js/actions/GameActions.js';
import gameReducer from '../../js/reducers/hexbusters.js';
import _ from 'lodash';
import init from '../../js/hexbusters/init.js';

const grid = {
  width: 3,
  height: 3,
  orientation: 'flat-topped',
  layout: 'odd-q'
};
const gameState = init(grid);

describe('helpers', function() {
  describe('getWinner', function() {
    it('should return the correct winner (red)', function() {
      const actions = [
        playersJoin([{colour: COLOUR_RED}, {colour: COLOUR_BLUE}]),
        tileChosen({tileId: 'tile-0-0', colour: COLOUR_RED }),
        tileChosen({tileId: 'tile-1-0', colour: COLOUR_BLUE }),
        tileChosen({tileId: 'tile-0-1', colour: COLOUR_RED }),
        tileChosen({tileId: 'tile-1-1', colour: COLOUR_BLUE }),
        tileChosen({tileId: 'tile-0-2', colour: COLOUR_RED })
      ];

      const testState = _.reduce(actions, (gameState, action) => {
        return gameReducer(gameState, action);
      }, gameState);

      const winner = helpers.getWinner(testState, grid);
      expect(winner).to.equal(COLOUR_RED);
    });

    it('should return no winner', function() {
      const actions = [
        playersJoin([{colour: COLOUR_RED}, {colour: COLOUR_BLUE}]),
        tileChosen({tileId: 'tile-0-0', colour: COLOUR_RED }),
        tileChosen({tileId: 'tile-1-0', colour: COLOUR_BLUE }),
        tileChosen({tileId: 'tile-0-1', colour: COLOUR_RED }),
        tileChosen({tileId: 'tile-1-1', colour: COLOUR_BLUE })
      ];

      const testState = _.reduce(actions, (gameState, action) => {
        return gameReducer(gameState, action);
      }, gameState);

      const winner = helpers.getWinner(testState, grid);
      expect(winner).to.equal(null);
    });
  });
});
