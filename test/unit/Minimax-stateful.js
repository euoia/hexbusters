import Minimax from '../../js/hexbusters/Minimax-stateful.js';
import expect from 'expect.js';
import { COLOUR_BLUE, COLOUR_NEUTRAL, COLOUR_RED } from '../../js/constants/Colours.js';

/* eslint-env mocha */
const gridSettings = {
  width: 3,
  height: 3,
  orientation: 'flat-topped',
  layout: 'odd-q'
};

const initialState = {
    messages: [],
    players: [{colour: COLOUR_RED}, {colour: COLOUR_BLUE}],
    numPlayers: 2,
    board: {}
};

describe('evaluateState', function() {
  it('Should return a winning action', function() {
    // Create a game state where red is one move away from winning.
    // Red is about to the middle row.
    const gameState = {
      ...initialState,
      board: {
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
      }
    };

    const timeLimitMs = Number.POSITIVE_INFINITY;
    const startTime = new Date();

    const evaluation = Minimax.evaluateState(
      COLOUR_RED,
      gameState,
      gridSettings,
      startTime.getTime() + timeLimitMs
    );

    expect(evaluation.action.tileId).to.equal('tile-2-1');
  });

  it('Should prevent the other player winning', function() {
    // Red is about to get the bottom row.
    // It is Blue's turn.
    const gameState = {
      ...initialState,
      board: {
        currentPlayerIdx: 1,
        tileColours: {
          'tile-0-0': COLOUR_NEUTRAL,
          'tile-0-1': COLOUR_NEUTRAL,
          'tile-0-2': COLOUR_RED,
          'tile-1-0': COLOUR_NEUTRAL,
          'tile-1-1': COLOUR_NEUTRAL,
          'tile-1-2': COLOUR_RED,
          'tile-2-0': COLOUR_NEUTRAL,
          'tile-2-1': COLOUR_BLUE, // Ensure there is only one choice.
          'tile-2-2': COLOUR_NEUTRAL
        }
      }
    };

    const timeLimitMs = Number.POSITIVE_INFINITY;
    const startTime = new Date();

    // The AI is BLUE.
    const evaluation = Minimax.evaluateState(
      COLOUR_BLUE,
      gameState,
      gridSettings,
      startTime.getTime() + timeLimitMs
    );

    expect(evaluation.action.tileId).to.equal('tile-2-2');
  });
});

