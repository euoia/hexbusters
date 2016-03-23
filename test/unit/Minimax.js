/* eslint-env mocha */
import Minimax from '../../js/deciders/Minimax.js';
import _ from 'lodash';
import expect from 'expect.js';
import gameReducer from '../../js/reducers/hexbusters.js';
import init from '../../js/hexbusters/init.js';
import { COLOUR_BLUE, COLOUR_RED } from '../../js/constants/Colours.js';
import { playersJoin } from '../../js/actions/GameActions.js';
import { tileChosen } from '../../js/actions/PlayerActions.js';

const rhombusWidth = 3;
const grid = {
  width: rhombusWidth,
  height: rhombusWidth,
  orientation: 'pointy-topped',
  layout: 'odd-r',
  shape: 'parallelogram'
};
const gameState = init(grid);

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
        grid,
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
        grid,
        timeLimitMs
      );

      expect(action.tileId).to.equal('tile-0-2');
    });
  });
});
