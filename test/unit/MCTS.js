import Immutable from 'immutable';
import InitialState from '../../js/constants/InitialState.js';
import MCTS from '../../js/hexbusters/MCTS.js';
import expect from 'expect.js';
import { COLOUR_BLUE, COLOUR_NEUTRAL, COLOUR_RED } from '../../js/constants/Colours.js';

/* eslint-env mocha */
const gridSettings = {
  width: 3,
  height: 3,
  orientation: 'flat-topped',
  layout: 'odd-q'
};

describe('evaluateState', function() {
  this.timeout(5000);

  it('Should return a winning action', function() {
    // Create a game state where red is one move away from winning.
    // Red is about to the middle row.
    const gameState = {
      ...InitialState,
      players: [{colour: COLOUR_RED}, {colour: COLOUR_BLUE}],
      board: Immutable.fromJS({
      currentPlayerIdx: 0,
        tileColours: {
          'tile-0-0': COLOUR_NEUTRAL,
          'tile-0-1': COLOUR_RED,
          'tile-0-2': COLOUR_NEUTRAL,
          'tile-1-0': COLOUR_NEUTRAL,
          'tile-1-1': COLOUR_RED,
          'tile-1-2': COLOUR_NEUTRAL,
          'tile-2-0': COLOUR_NEUTRAL,
          'tile-2-1': COLOUR_NEUTRAL,
          'tile-2-2': COLOUR_BLUE // Otherwise there are 2 possible wins.
        }
      })
    };

    // The AI is RED.
    const bestAction = MCTS.getBestAction(
      COLOUR_RED,
      gameState,
      gridSettings
    );

    console.dir(bestAction);
    expect(bestAction.tileId).to.equal('tile-2-1');
  });

  it('Should prevent the other player winning', function() {
    // Red is about to get the bottom row.
    // It is Blue's turn.
    const gameState = {
      ...InitialState,
      players: [{colour: COLOUR_RED}, {colour: COLOUR_BLUE}],
      board: Immutable.fromJS({
        currentPlayerIdx: 1,
        tileColours: {
          'tile-0-0': COLOUR_NEUTRAL,
          'tile-0-1': COLOUR_NEUTRAL,
          'tile-0-2': COLOUR_RED,
          'tile-1-0': COLOUR_NEUTRAL,
          'tile-1-1': COLOUR_NEUTRAL,
          'tile-1-2': COLOUR_RED,
          'tile-2-0': COLOUR_NEUTRAL,
          'tile-2-1': COLOUR_NEUTRAL,
          'tile-2-2': COLOUR_NEUTRAL
        }
      })
    };

    // The AI is BLUE.
    const bestAction = MCTS.getBestAction(
      COLOUR_BLUE,
      gameState,
      gridSettings
    );

    console.dir(bestAction);
    expect(bestAction.tileId).to.equal('tile-2-2');
  });
});

