import BasePlayer from './BasePlayer.js';
import _ from 'lodash';
import { AI_PLAYER } from '../constants/PlayerTypes.js';
import hb from './hb.js';

export default class AIPlayer extends BasePlayer {
  constructor (options) {
    super(options);
    this.playerType = AI_PLAYER;

    /**
     * Subscribe to game events.
     * When it's this player's turn, make a decision about which hex to play.
     */
    this.store.subscribe(() => {
      const game = hb(this.store.getState().game);

      if (game.isCurrentPlayer(this)) {
        const makeChoice = () => {
          this.store.dispatch(
            _.sample(game.getValidActions())
          )
        };

        _.debounce(makeChoice, 1000)();
      }
    });
  }
}
