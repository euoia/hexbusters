import BasePlayer from './BasePlayer.js';
import _ from 'lodash';
import { AI_PLAYER } from '../constants/PlayerTypes.js';
import { isCurrentPlayer, getUnoccupiedTiles } from './gameHelpers.js';

export default class AIPlayer extends BasePlayer {
  constructor (options) {
    super(options);
    this.playerType = AI_PLAYER;

    this.store.subscribe(() => {
      if (isCurrentPlayer(this.store.getState().game, this)) {
        const makeChoice = () => {
          this.chooseTile(_.sample(getUnoccupiedTiles(this.store.getState().game)));
        };

        _.debounce(makeChoice, 1000)();
      }
    });
  }
}
