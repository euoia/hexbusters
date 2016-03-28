import BasePlayer from './BasePlayer.js';
import { isCurrentPlayer } from '../hexbusters/helpers.js';
import { AI_PLAYER } from '../constants/PlayerTypes.js';
import check from 'check-types';
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
    this.timeLimitMs = 2000;
    this.debug = false;

    /**
     * Subscribe to game events.
     * When it's this player's turn, make a decision about which hex to play.
     */
    this.store.subscribe(() => {
      const gameState = this.store.getState().game;
      if (isCurrentPlayer(gameState, this) === false) {
        return;
      }

      if (gameState.winner !== null) {
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
          ...gameState,
          tiles: {
            neutral: gameState.tiles.neutral.toJS(),
            red: gameState.tiles.red.toJS(),
            blue: gameState.tiles.blue.toJS()
          },
          // Having to explicitly omit the actionDecider property is rather unfortunate.
          players: _.map(
            gameState.players,
            player => _.omit(player, 'actionDecider')
          )
        },
        debug: this.debug
      };

      // Pass the message to the action decider.
      // The message needs to be serialized since the decider could be a web worker.
      //this.actionDecider.postMessage(JSON.stringify(message));
      this.actionDecider.postMessage(JSON.stringify(message));

      this.actionDecider.onmessage = (message) => {
        console.log(`[AIPlayer] Finished thinking and decided ${message.data.bestAction.tileId}.`, message);
        console.log(`[AIPlayer] Executed ${message.data.iterations} iterations.`);

        this.isThinking = false;
        this.store.dispatch(message.data.bestAction);
      };
    });
  }
}
