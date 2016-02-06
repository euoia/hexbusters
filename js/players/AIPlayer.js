import BasePlayer from './BasePlayer.js';
import { isCurrentPlayer } from '../hexbusters/helpers.js';
import { AI_PLAYER } from '../constants/PlayerTypes.js';
import GRID from '../constants/Grid.js';
import check from 'check-types';
import transit from 'transit-immutable-js';
import _ from 'lodash';

export default class AIPlayer extends BasePlayer {
  constructor (options) {
    super(options);

    /**
     * The actionDecider is a web worker which determines which move the AI
     * should play.
     */
    check.assert.assigned(options.actionDecider, 'Must provide an actionDecider.');
    this.actionDecider = options.actionDecider;

    this.playerType = AI_PLAYER;
    this.isThinking = false;
    this.timeLimitMs = 1000;
    this.debug = true;

    /**
     * Subscribe to game events.
     * When it's this player's turn, make a decision about which hex to play.
     */
    this.store.subscribe(() => {
      if (isCurrentPlayer(this.store.getState().game, this) === false) {
        return;
      }

      if (this.isThinking === true) {
        console.log(`[AIPlayer] Already thinking about something.`);
        return;
      }

      console.log(`[AIPlayer] Thinking for ${this.timeLimitMs}ms...`);
      this.isThinking = true;
      const message = {
        action: 'getBestAction',
        timeLimitMs: this.timeLimitMs,
        playerColour: this.colour,
        state: {
          ...this.store.getState().game,
          // Having to explicitly omit the actionDecider property is rather unfortunate.
          players: _.map(
            this.store.getState().game.players,
            player => _.omit(player, 'actionDecider')
          )
        },
        GRID: GRID
      };

      console.log(message);
      this.actionDecider.postMessage(transit.toJSON(message));

      this.actionDecider.onmessage = (message) => {
        console.log(`[AIPlayer] Finished thinking and decided ${message.data.bestAction.tileId}.`, message);
        if (this.debug) {
          console.log(`[AIPlayer] Executed ${message.data.iterations} iterations.`);
        }

        this.isThinking = false;
        this.store.dispatch(message.data.bestAction);
      };
    });
  }
}
