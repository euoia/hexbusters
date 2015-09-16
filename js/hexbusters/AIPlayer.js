import BasePlayer from './BasePlayer.js';
import _ from 'lodash';
import { AI_PLAYER } from '../constants/PlayerTypes.js';
import hb from './hb.js';
import gameReducer from '../reducers/game.js';
import { COLOUR_NEUTRAL } from '../constants/Colours.js';

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

  /**
   * Minimax state evaluation.
   *
   * @param {Object} gameState The state of the game.
   * @param {Number} depth The evaluation tree depth.
   * @returns {Number} The value of gameState.
   */
  evaluateState (gameState, depth = 0) {
    const game = hb(gameState);
    const winner = game.getWinner();
    this.stateCount += 1;

    // Modify the final score by the depth so that the AI prefer to end
    // the game sooner.
    if (winner === this.colour) {
        // This player wins, best outcome.
        return 100 - depth;
    }

    if (winner !== COLOUR_NEUTRAL) {
      // Other player wins, worst outcome.
      return -100 + depth;
    }

    if (depth > 2) {
      // We've gone too deep!
      return 0;
    }

    // Value of the state is the average of the possible action values.
    let actionValues = game.getValidActions().map(
      action => {
        const value = this.evaluateState(
          gameReducer(gameState, action),
          depth + 1
        );

        return {
          action: action,
          value: value
        };
      }
    );

    if (game.isCurrentPlayer(this) === false) {
      return actionValues.minBy(action => action.value).value;
    }

    return actionValues.maxBy(action => action.value).value;
  }

  getBestAction (gameState) {
    const game = hb(gameState);
    const validActions = game.getValidActions();
    console.log(`[AIPlayer] considering ${validActions.count()} actions.`);
    this.stateCount = 0;
    let startTime = Date.now();

    let actionValues = validActions.map(
      action => {
        let value;
        if (validActions.count() < 22) {
          let newGameState = gameReducer(gameState, action);
          value = this.evaluateState(newGameState);
          console.log('Evaluated value is', value);
        } else {
          value = 0;
          console.log('Estimated value is', value);
        }

        return {
          action: action,
          value: value
        };
      }
    );

    let timeTaken = Date.now() - startTime;
    console.log(`[AIPlayer] Evaluated ${this.stateCount} states in ${timeTaken}ms.`);

    let bestAction = actionValues.maxBy(action => action.value);

    let bestActionValue = bestAction.value;
    let randomBestAction = _.chain(actionValues.toJS())
      .filter(action => action.value === bestActionValue)
      .shuffle()
      .first()
      .value();

    console.log(`[AIPlayer] I think the best action is: ${JSON.stringify(randomBestAction)}`);
    return randomBestAction.action;
  }
}
