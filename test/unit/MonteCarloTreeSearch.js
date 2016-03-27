/* eslint-env mocha */
import MonteCarloTreeSearch from '../../js/deciders/MonteCarloTreeSearch.js';
import expect from 'expect.js';
import { COLOUR_BLUE, COLOUR_RED } from '../../js/constants/Colours.js';
import { tileChosen } from '../../js/actions/PlayerActions.js';
import { playersJoin } from '../../js/actions/GameActions.js';
import gameReducer from '../../js/reducers/hexbusters.js';
import _ from 'lodash';
import init from '../../js/hexbusters/init.js';
import { getTileCoordinatesById, getTileIdByCoordinates } from 'hex-grid';

const size = 3;
const grid = {
  width: size,
  height: size,
  orientation: 'pointy-topped',
  layout: 'odd-r',
  shape: 'parallelogram'
};
const gameState = init(grid);

const mcts = new MonteCarloTreeSearch({timeLimitMs: 1000, debug: true});

describe('MonteCarloTreeSearch', function() {
  this.timeout(5000);

  describe('getBestAction', function() {
    it('Should return a winning action', function() {
      // A game state where red is one move away from winning.
      // Red is about to get the first column.
      const actions = [
        playersJoin([{colour: COLOUR_RED}, {colour: COLOUR_BLUE}]),
        tileChosen({tileId: getTileIdByCoordinates(grid, 0, 0), colour: COLOUR_RED }),
        tileChosen({tileId: getTileIdByCoordinates(grid, 1, 0), colour: COLOUR_BLUE }),
        tileChosen({tileId: getTileIdByCoordinates(grid, 0, 1), colour: COLOUR_RED }),
        tileChosen({tileId: getTileIdByCoordinates(grid, 1, 1), colour: COLOUR_BLUE })
      ];

      const testState = _.reduce(actions, (gameState, action) => {
        return gameReducer(gameState, action);
      }, gameState);

      const action = mcts.getBestAction(COLOUR_RED, testState, grid);
      expect(getTileCoordinatesById(grid, action.bestAction.tileId)).to.eql({x: 0, y: 2});
    });

    it('Should prevent the other player winning', function() {
      // Red is about to get the first column.
      // It is Blue's turn.
      const actions = [
        playersJoin([{colour: COLOUR_BLUE}, {colour: COLOUR_RED}]),
        tileChosen({tileId: getTileIdByCoordinates(grid, 1, 0), colour: COLOUR_BLUE }),
        tileChosen({tileId: getTileIdByCoordinates(grid, 0, 0), colour: COLOUR_RED }),
        tileChosen({tileId: getTileIdByCoordinates(grid, 1, 1), colour: COLOUR_BLUE }),
        tileChosen({tileId: getTileIdByCoordinates(grid, 0, 1), colour: COLOUR_RED })
      ];

      const testState = _.reduce(actions, (gameState, action) => {
        return gameReducer(gameState, action);
      }, gameState);

      const action = mcts.getBestAction(COLOUR_BLUE, testState, grid);
      expect(getTileCoordinatesById(grid, action.bestAction.tileId)).to.eql({x: 0, y: 2});
    });
  });
});
