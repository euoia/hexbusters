import Immutable from 'immutable';
import InitialState from '../../js/constants/InitialState.js';
import expect from 'expect.js';
import hb from '../../js/hexbusters/hb.js';
import { COLOUR_BLUE, COLOUR_NEUTRAL, COLOUR_RED } from '../../js/constants/Colours.js';

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

    let game = hb(gameState);
    expect(
      game.getWinner(gridSettings)
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

    let game = hb(gameState);
    expect(
      game.getWinner(gridSettings)
    ).to.equal(null);
  });
});
