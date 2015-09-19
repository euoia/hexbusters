import _ from 'lodash';
import gameReducer from '../reducers/game.js';
import hb from './hb.js';

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
   * @returns {Object} An object with the kfollowing keys:
   *   action          - The best action (or undefined if there are no valid actions).
   *   value           - The value of the best action.
   *   statesEvaluated - The number of states evaluated.
   */
  static evaluateState (
    playerColour,
    gameState,
    gridSettings,
    endTime,
    maximizingPlayer = true,
    depth = 0,
    statesEvaluated = 0
  ) {
    const now = new Date();
    if (now > endTime) {
      return {
        value: 0,
        statesEvaluated
      };
    }

    let thisStatesEvaluated = statesEvaluated + 1;

    const game = hb(gameState);
    const winner = game.getWinner(gridSettings);

    // Modify the final score by the depth so that the AI prefer to end
    // the game sooner.
    if (winner === playerColour) {
        // This player wins, best outcome.
      return {
        value: 100 - depth,
        statesEvaluated: thisStatesEvaluated
      };
    }

    if (winner !== null) {
      // Other player wins, worst outcome.
      return {
        value: -100 + depth,
        statesEvaluated: thisStatesEvaluated
      };
    }

    const validActions = game.getValidActions();
    if (validActions.count() === 0) {
      // The board is full but no player has won.
      return {
        value: 0,
        statesEvaluated: thisStatesEvaluated
      };
    }

    // Value of the state is the average of the possible action values.
    let actionValues = validActions.map(
      action => {
        const { value, statesEvaluated } = Minimax.evaluateState(
          playerColour,
          gameReducer(gameState, action),
          gridSettings,
          endTime,
          ! maximizingPlayer,
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

    const bestActionValue =
      maximizingPlayer ?
      actionValues.maxBy(action => action.value) :
      actionValues.minBy(action => action.value);

    thisStatesEvaluated += _.sum(_.pluck(actionValues.toJS(), 'statesEvaluated'));

    return {
      action: bestActionValue.action,
      value: bestActionValue.value,
      statesEvaluated: thisStatesEvaluated
    };
  }

  static getBestAction(
    playerColour,
    gameState,
    gridSettings,
    timeLimitMs
  ) {
    const startTime = new Date();
    const endTime = startTime.getTime() + timeLimitMs;
    let evaluation = Minimax.evaluateState(
      playerColour,
      gameState,
      gridSettings,
      endTime
    );

    return evaluation.action;
  }
}
