import check from 'check-types';
import _ from 'lodash';
import { tileChosen } from '../actions/PlayerActions.js';

const validColours = ['red', 'blue'];

export default class BasePlayer {
  constructor (options) {
    check.assert.string(options.name);
    this.name = options.name;

    check.assert.object(options.store);
    this.store = options.store;

    check.assert.string(options.colour);
    check.assert(_.includes(validColours, options.colour));
    this.colour = options.colour;
  }

  chooseTile (tileId) {
    this.store.dispatch(
      tileChosen({
        tileId,
        colour: this.colour
      })
    );
  }
}
