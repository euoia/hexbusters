import Immutable from 'immutable';
import InitialState from '../../js/constants/InitialState.js';
import expect from 'expect.js';
import helpers from '../../js/hexbusters/helpers.js';
import { COLOUR_BLUE, COLOUR_NEUTRAL, COLOUR_RED } from '../../js/constants/Colours.js';

/**
 * As of the following commit (and definitely much earlier) these tests appear
 * to be WRONG!
 *
 *     commit c47c4a8309213ecd88c0dc77792ea35f3cfca4c9
 *     Author: James Pickard <james.pickard@gmail.com>
 *     Date:   Sun Jan 24 13:05:56 2016 -0500
 *
 *         Fixes for MCTS-worker
 *
 * Since the map a parallelogram, the getWinner function needs to be rewritten.
 */

/* eslint-env mocha */
describe('getWinner', function() {
  it('should return the correct winner (red)', function() {
    const gameState = {
      ...InitialState,
      players: [{colour: COLOUR_RED}, {colour: COLOUR_BLUE}],
      board: Immutable.fromJS({
        currentPlayerIdx: 0,
        tileColours: {
          'tile-0-0': COLOUR_RED,
          'tile-0-1': COLOUR_NEUTRAL,
          'tile-0-2': COLOUR_NEUTRAL,
          'tile-1-0': COLOUR_RED,
          'tile-1-1': COLOUR_NEUTRAL,
          'tile-1-2': COLOUR_NEUTRAL,
          'tile-2-0': COLOUR_RED,
          'tile-2-1': COLOUR_NEUTRAL,
          'tile-2-2': COLOUR_NEUTRAL
        }
      })
    };

    const gridSettings = {
      width: 3,
      height: 3,
      orientation: 'flat-topped',
      layout: 'odd-q'
    };

    expect(
      helpers.getWinner(gameState, gridSettings)
    ).to.equal(COLOUR_RED);
  });

  it('should return no winner', function() {
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
        'tile-2-2': COLOUR_BLUE
        }
      })
    };

    const gridSettings = {
      width: 3,
      height: 3,
      orientation: 'flat-topped',
      layout: 'odd-q'
    };

    expect(
      helpers.getWinner(gameState, gridSettings)
    ).to.equal(null);
  });
});
