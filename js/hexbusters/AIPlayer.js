import BasePlayer from './BasePlayer.js';
import _ from 'lodash';
import hb from './hb.js';
import { AI_PLAYER } from '../constants/PlayerTypes.js';
import Minimax from './Minimax.js';
import GridSettings from '../constants/GridSettings.js';

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
            this.getBestAction(this.store.getState().game)
          )
        };

        _.debounce(makeChoice, 1000)();
      }
    });
  }

  getBestAction (gameState, timeLimitMs = 5000) {
    const startTime = new Date();

    const { action, value, statesEvaluated } = Minimax.evaluateState(
      this.colour,
      gameState,
      GridSettings,
      startTime.getTime() + timeLimitMs
    );

    let timeTaken = Date.now() - startTime;
    console.log(`[AIPlayer] Evaluated ${statesEvaluated} states in ${timeTaken}ms.`);
    console.log(`[AIPlayer] Best action has a value of`, value, action);
    return action;
  }
}
