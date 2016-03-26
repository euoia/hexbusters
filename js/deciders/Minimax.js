import _ from 'lodash';
import gameReducer from '../reducers/hexbusters.js';
import helpers from '../hexbusters/helpers.js';

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
    endTime,
    maxDepth = null,
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

    if (maxDepth !== null && depth > maxDepth) {
      return {
        value: 0,
        statesEvaluated
      };
    }

    let thisStatesEvaluated = statesEvaluated + 1;

    const winner = gameState.winner;

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

    const validActions = helpers.getActions(gameState);
    if (validActions.length === 0) {
      // The board is full but no player has won.
      return {
        value: 0,
        statesEvaluated: thisStatesEvaluated
      };
    }

    // Value of the state is the average of the possible action values.
    let actionValues = _.map(
      validActions,
      action => {
        const evaluation = Minimax.evaluateState(
          playerColour,
          gameReducer(gameState, action),
          endTime,
          maxDepth,
          ! maximizingPlayer,
          depth + 1,
          statesEvaluated
        );

        thisStatesEvaluated += evaluation.statesEvaluated;

        return {
          action,
          value: evaluation.value
        };
      }
    );

    const bestActionValue =
      maximizingPlayer ?
      _(actionValues).sortBy('value').last() :
      _(actionValues).sortBy('value').first();

    const randomBestAction =
      _(actionValues)
      .filter(action => action.value === bestActionValue.value)
      .shuffle()
      .first();

    return {
      action: randomBestAction.action,
      value: randomBestAction.value,
      statesEvaluated: thisStatesEvaluated
    };
  }

  static getBestAction(
    playerColour,
    gameState,
    timeLimitMs,
    maxDepth
  ) {
    const startTime = new Date();
    const endTime = startTime.getTime() + timeLimitMs;
    let evaluation = Minimax.evaluateState(
      playerColour,
      gameState,
      endTime,
      maxDepth
    );

    return evaluation.action;
  }
}
