/* eslint-env mocha */
import MonteCarloTreeSearch from '../../js/deciders/MonteCarloTreeSearch.js';
import expect from 'expect.js';
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

const mcts = new MonteCarloTreeSearch({timeLimitMs: 1000});

describe('MonteCarloTreeSearch', function() {
  this.timeout(5000);

  describe('getBestAction', function() {
    it('Should return a winning action', function() {
      // Red is one move away from winning with the first column.
      // Blue will win on the next turn with a diagonal from top right to
      // bottom left.
      // It is red's turn.
      const actions = [
        playersJoin([{colour: COLOUR_RED}, {colour: COLOUR_BLUE}]),
        tileChosen({tileId: 'tile-0-0', colour: COLOUR_RED }),
        tileChosen({tileId: 'tile-2-0', colour: COLOUR_BLUE }),
        tileChosen({tileId: 'tile-0-1', colour: COLOUR_RED }),
        tileChosen({tileId: 'tile-1-1', colour: COLOUR_BLUE })
      ];

      const testState = _.reduce(actions, (gameState, action) => {
        return gameReducer(gameState, action);
      }, gameState);

      const action = mcts.getBestAction(COLOUR_RED, testState, grid);
      expect(action.bestAction.tileId).to.equal('tile-0-2');
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

      const action = mcts.getBestAction(COLOUR_BLUE, testState, grid);
      expect(action.bestAction.tileId).to.equal('tile-0-2');
    });
  });
});
