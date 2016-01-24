import Immutable from 'immutable';
import _ from 'lodash';
import { COLOUR_NEUTRAL } from '../../../js/constants/Colours.js';
import { TILE_CHOSEN } from '../../constants/ActionTypes.js';
import { getTileCoordinatesById, getShortestPathsFromTileId } from 'hex-grid.js';
import { tileChosen } from '../../actions/PlayerActions.js';

let stateCache = Immutable.Map({});

function getValidActions (state) {
  return _(state.board.tileColours).pick(
    colour => colour === COLOUR_NEUTRAL
  ).map((colour, tileId) => {
    return tileChosen({
      tileId: tileId,
      colour: getCurrentPlayer(state).colour
    })
  }).value();
}

function getWinner (state, gridSettings) {
  const validStartTiles = _(state.board.tileColours).pick(
    (colour, tileId) =>
      getTileCoordinatesById(tileId).x === 0 &&
      colour !== COLOUR_NEUTRAL
  ).value();

  const validEndTiles = _(state.board.tileColours).pick(
    (colour, tileId) =>
      getTileCoordinatesById(tileId).x === gridSettings.width - 1 &&
      colour !== COLOUR_NEUTRAL
  ).value();

  let winningColour = _(validStartTiles).find(
    (colour, tileId) => {
      let paths = getShortestPathsFromTileId(
        gridSettings,
        tileId,
        {
          moveCost: (fromTileId, toTileId) => {
            return state.board.tileColours[fromTileId] === state.board.tileColours[toTileId] ?
              0 :
              Number.POSITIVE_INFINITY;
          },
          maxCost: 100
        }
      );

      let winningEndTiles = _.intersection(
        Object.keys(paths),
        Object.keys(validEndTiles)
      );

      if (winningEndTiles.length > 0) {
        return true;
      }

      return false;
    }
  );

  if (winningColour) {
    return winningColour;
  }

  return null;
}

function getCurrentPlayer (state) {
  return state.players[state.board.currentPlayerIdx];
}

function applyAction (state, action) {
  switch (action.type) {
    case TILE_CHOSEN:
      if (state.board.tileColours[action.tileId] !== COLOUR_NEUTRAL) {
        console.error('Tried to choose an occupied tile!');
      }

      const currentPlayer = state.players[state.board.currentPlayerIdx];

      if (action.colour !== currentPlayer.colour) {
        console.log('Wrong player tried to go!');
      }

      state.board.tileColours[action.tileId] = action.colour;
      state.board.currentPlayerIdx = (state.board.currentPlayerIdx + 1) % 2;
  }
}

function unApplyAction (state, action) {
  state.board.tileColours[action.tileId] = COLOUR_NEUTRAL;
  state.board.currentPlayerIdx = (state.board.currentPlayerIdx + 1) % 2;
}

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

    if (stateCache.has(JSON.stringify(gameState.board))) {
      return {
        value: stateCache.get(JSON.stringify(gameState.board)),
        statesEvaluated: thisStatesEvaluated
      }
    }

    const winner = getWinner(gameState, gridSettings);

    // Modify the final score by the depth so that the AI prefer to end
    // the game sooner.
    if (winner === playerColour) {
      // This player wins, best outcome.
      stateCache = stateCache.set(JSON.stringify(gameState.board), 100 - depth);
      return {
        value: 100 - depth,
        statesEvaluated: thisStatesEvaluated
      };
    }

    if (winner !== null) {
      // Other player wins, worst outcome.
      stateCache = stateCache.set(JSON.stringify(gameState.board), -100 + depth);
      return {
        value: -100 + depth,
        statesEvaluated: thisStatesEvaluated
      };
    }

    const validActions = getValidActions(gameState);
    if (validActions.length === 0) {
      // The board is full but no player has won.
      stateCache = stateCache.set(JSON.stringify(gameState.board), 0);
      return {
        value: 0,
        statesEvaluated: thisStatesEvaluated
      };
    }

    // Value of the state is the average of the possible action values.
    let actionValues = _(validActions).map(
      action => {
        applyAction(
          gameState,
          action
        );

        const evaluation = Minimax.evaluateState(
          playerColour,
          gameState,
          gridSettings,
          endTime,
          maxDepth,
          ! maximizingPlayer,
          depth + 1,
          statesEvaluated
        );

        unApplyAction(
          gameState,
          action
        );

        thisStatesEvaluated += evaluation.statesEvaluated;

        return {
          action,
          value: evaluation.value
        };
      }
    ).value();

    const bestActionValue =
      maximizingPlayer ?
      _.chain(actionValues).sortByOrder('value', ['desc']).first().value() :
      _.chain(actionValues).sortByOrder('value', ['asc']).first().value();

    const randomBestAction =
      _.chain(actionValues)
      .pick(action => action.value === bestActionValue.value)
      .shuffle()
      .first()
      .value();

    stateCache = stateCache.set(JSON.stringify(gameState.board), randomBestAction.value);
    return {
      action: randomBestAction.action,
      value: randomBestAction.value,
      statesEvaluated: thisStatesEvaluated
    };
  }

  static getBestAction(
    playerColour,
    gameState,
    gridSettings,
    timeLimitMs,
    maxDepth
  ) {
    stateCache = Immutable.Map({});
    const startTime = new Date();
    const endTime = startTime.getTime() + timeLimitMs;
    let evaluation = Minimax.evaluateState(
      playerColour,
      gameState,
      gridSettings,
      endTime,
      maxDepth
    );

    console.log(`Evaluated ${evaluation.statesEvaluated} states`);

    return evaluation.action;
  }
}
