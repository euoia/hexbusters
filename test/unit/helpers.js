/* eslint-env mocha */
import Immutable from 'immutable';
import InitialState from '../../js/constants/InitialState.js';
import expect from 'expect.js';
import helpers from '../../js/hexbusters/helpers.js';
import { COLOUR_BLUE, COLOUR_NEUTRAL, COLOUR_RED } from '../../js/constants/Colours.js';
import { tileChosen } from '../../js/actions/PlayerActions.js';
import { playersJoin } from '../../js/actions/GameActions.js';
import gameReducer from '../../js/reducers/game.js';
import _ from 'lodash';

const gridSettings = {
  width: 3,
  height: 3,
  orientation: 'flat-topped',
  layout: 'odd-q'
};

const gameState = {
  ...InitialState,
  board: Immutable.fromJS({
    currentPlayerIdx: 0,
    tileColours: {
      'tile-0-0': COLOUR_NEUTRAL,
      'tile-0-1': COLOUR_NEUTRAL,
      'tile-0-2': COLOUR_NEUTRAL,
      'tile-1-0': COLOUR_NEUTRAL,
      'tile-1-1': COLOUR_NEUTRAL,
      'tile-1-2': COLOUR_NEUTRAL,
      'tile-2-0': COLOUR_NEUTRAL,
      'tile-2-1': COLOUR_NEUTRAL,
      'tile-2-2': COLOUR_NEUTRAL
    }
  })
};

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

      const winner = helpers.getWinner(testState, gridSettings);
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

      const winner = helpers.getWinner(testState, gridSettings);
      expect(winner).to.equal(null);
    });
  });
});
