import Immutable from 'immutable';
import InitialState from '../../js/constants/InitialState.js';
import Minimax from '../../js/hexbusters/deciders/Minimax.js';
import expect from 'expect.js';
import { COLOUR_BLUE, COLOUR_NEUTRAL, COLOUR_RED } from '../../js/constants/Colours.js';
import { tileChosen } from '../../js/actions/PlayerActions.js';
import { playersJoin } from '../../js/actions/GameActions.js';
import gameReducer from '../../js/reducers/game.js';
import _ from 'lodash';

/* eslint-env mocha */
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

describe('Minimax', function() {
  const timeLimitMs = 1000;

  describe('evaluateState', function() {
    it('Should return a winning action', function() {
      // A game state where red is one move away from winning.
      // Red is about to get the first column.
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

      const action = Minimax.getBestAction(
        COLOUR_RED,
        testState,
        gridSettings,
        timeLimitMs
      );

      expect(action.tileId).to.equal('tile-0-2');
    });

    it('Should prevent the other player winning', function() {
      // Red is about to get the first column.
      // It is Blue's turn.
      const actions = [
        playersJoin([{colour: COLOUR_BLUE}, {colour: COLOUR_RED}]),
        tileChosen({tileId: 'tile-1-0', colour: COLOUR_BLUE }),
        tileChosen({tileId: 'tile-0-0', colour: COLOUR_RED }),
        tileChosen({tileId: 'tile-1-1', colour: COLOUR_BLUE }),
        tileChosen({tileId: 'tile-0-1', colour: COLOUR_RED })
      ];

      const testState = _.reduce(actions, (gameState, action) => {
        return gameReducer(gameState, action);
      }, gameState);

      // The AI is BLUE.
      const action = Minimax.getBestAction(
        COLOUR_BLUE,
        testState,
        gridSettings,
        timeLimitMs
      );

      expect(action.tileId).to.equal('tile-0-2');
    });
  });
});
