import check from 'check-types';
import _ from 'lodash';
import { tileChosen } from '../actions/PlayerActions.js';
import { COLOUR_RED, COLOUR_BLUE } from '../constants/Colours.js';

const validColours = [COLOUR_RED, COLOUR_BLUE];

export default class BasePlayer {
  constructor(options) {
    check.assert.string(options.name);
    this.name = options.name;

    check.assert.object(options.store);
    Object.defineProperty(this, 'store', {
      value: options.store,
      enumerable: false
    });

    check.assert.assigned(options.colour);
    check.assert(_.includes(validColours, options.colour));
    this.colour = options.colour;
  }

  chooseTile(tileId) {
    this.store.dispatch(
      tileChosen({
        tileId,
        colour: this.colour
      })
    );
  }
}
