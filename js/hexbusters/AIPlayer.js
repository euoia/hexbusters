import BasePlayer from './BasePlayer.js';
import { isCurrentPlayer } from './helpers.js';
import { AI_PLAYER } from '../constants/PlayerTypes.js';
import GridSettings from '../constants/GridSettings.js';
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

      console.log('[AIPlayer] Thinking...');
      this.isThinking = true;

      this.actionDecider.postMessage(transit.toJSON({
        action: 'getBestAction',
        playerColour: this.colour,
        state: {
          board: this.store.getState().game.board,
          // Having to explicitly omit the actionDecider property is rather unfortunate.
          players: _.map(
            this.store.getState().game.players,
            player => _.omit(player, 'actionDecider')
          )
        },
        gridSettings: GridSettings
      }));

      this.actionDecider.onmessage = (message) => {
        console.log(`[AIPlayer] Finished thinking.`, message);
        this.isThinking = false;
        this.store.dispatch(message.data);
      };
    });
  }
}
