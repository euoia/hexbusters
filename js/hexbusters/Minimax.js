import _ from 'lodash';
import gameReducer from '../reducers/game.js';
import hb from './hb.js';
import { COLOUR_NEUTRAL } from '../constants/Colours.js';

export default class Minimax {
  /**
   * Minimax state evaluation.
   *
   * General rules for Minimax:
   *   1. If a set of states contains a losing state, then the value of the set
   *   is a high negative value. Higher negative values are assigned to states
   *   where the loss occurs sooner. That is: prefer losses which come later.
   *   2. If a set of states does not contain any winning or losing states,
   *   then the value is the set is neutral (zero).
   *   3. If a set of states contains all winning states or a mixture of
   *   winning states and neutral states, the value of the set is a high
   *   positive value. Higher positive values are assigned to states where the
   *   win is shallower in the decision tree. That is: prefer wins which come
   *   sooner.
   *
   * @param {Object} gameState The state of the game.
   * @param {Number} depth The evaluation tree depth.
   * @returns {Number} The value of gameState.
   */
  static evaluateState (gameState, endTime, depth = 0, statesEvaluated = 0) {
    const now = new Date();
    if (now > endTime) {
      return {
        value: 0,
        statesEvaluated
      };
    }

    let thisStatesEvaluated = statesEvaluated + 1;

    const game = hb(gameState);
    const validActions = game.getValidActions();
    if (validActions.count() === 0) {
      // The board is full but no player has won.
      return {
        value: 0,
        statesEvaluated: thisStatesEvaluated
      };
    }

    const winner = game.getWinner();

    // Modify the final score by the depth so that the AI prefer to end
    // the game sooner.
    if (winner === this.colour) {
        // This player wins, best outcome.
      return {
        value: 100 - depth,
        statesEvaluated: thisStatesEvaluated
      };
    }

    if (winner !== COLOUR_NEUTRAL) {
      // Other player wins, worst outcome.
      return {
        value: -100 + depth,
        statesEvaluated: thisStatesEvaluated
      };
    }

    // Value of the state is the average of the possible action values.
    let actionValues = validActions.map(
      action => {
        const { value, statesEvaluated } = Minimax.evaluateState(
          gameReducer(gameState, action),
          endTime,
          depth + 1,
          thisStatesEvaluated
        );

        return {
          action,
          value,
          statesEvaluated
        };
      }
    );

    let bestActionValue;
    if (game.isCurrentPlayer(this) === false) {
      bestActionValue = actionValues.minBy(action => action.value);
    } else {
      bestActionValue = actionValues.maxBy(action => action.value);
    }

    thisStatesEvaluated += _.sum(_.pluck(actionValues.toJS(), 'statesEvaluated'));

    return {
      action: bestActionValue.action,
      value: bestActionValue.value,
      statesEvaluated: thisStatesEvaluated
    };
  }
}
