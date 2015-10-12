/* eslint-env worker */

import _ from 'lodash';
import gameReducer from '../../reducers/game.js';
import { getValidActions, getWinner } from '../helpers.js';
import transit from 'transit-immutable-js';

const iterations = 1000;

function makeNodeId (currentNodeId, actionId) {
  return `${currentNodeId}:${actionId}`;
}

function getUnexploredActions (tree, state, nodeId) {
  const validActions = getValidActions(state);

  // Unexplored actions are children which do not have an entry in the tree.
  return _(validActions)
    .map(
      (action, actionIdx) => {
        return {
          ...action,
          actionId: actionIdx
        };
      }
    ).filter(
      (action) => {
        const actionNodeId = makeNodeId(nodeId, action.actionId);
        return tree[actionNodeId] === undefined;
      }
    ).value();
}

function randomWalk(playerColour, gridSettings, state, depth) {
  switch (getWinner(state, gridSettings)) {
    case playerColour:
      // Prefer quicker wins.
      return 100 - depth;
    case null:
      const validActions = getValidActions(state);

      // Stalemate.
      if (validActions.length === 0) {
        return 0;
      }

      // Keep going.
      return randomWalk(
        playerColour,
        gridSettings,
        gameReducer(state, _.sample(validActions)),
        depth + 1
      );
    default:
      // Prefer further away losses.
      return -100 + depth;
  }
}

function treeWalk (playerColour, gridSettings, tree, state, nodeId = '', depth = 0) {
  const unexploredActions = getUnexploredActions(
    tree,
    state,
    nodeId
  );

  // Fringe nodes are nodes that we still need to explore.
  // That is, they have remaining unexplored actions.
  const isFringeNode = (unexploredActions.length > 0);

  let reward;
  if (isFringeNode) {
    // Descend the unexplored parts of the tree until this node is no longer
    // a fringe node.
    const action = _.sample(unexploredActions);
    const nextNodeId = makeNodeId(nodeId, action.actionId);

    tree[nextNodeId] = tree[nextNodeId] || 0;

    reward = randomWalk(
      playerColour,
      gridSettings,
      gameReducer(state, action),
      depth + 1
    );

    tree[nextNodeId] += reward;
  } else {
    // This node is not a fringe node: all children have already been
    // explored.  Might as well select a random successor.
    const validActions = getValidActions(state);
    if (validActions.length === 0) {
      return [tree, 0];
    }

    const actionIdx = _.random(validActions.length - 1);
    const action = validActions[actionIdx];
    const nextNodeId = makeNodeId(nodeId, actionIdx);

    [tree, reward] = treeWalk(
      playerColour,
      gridSettings,
      tree,
      gameReducer(state, action),
      nextNodeId,
      depth + 1
    );
  }

  tree[nodeId] = (tree[nodeId] || 0) + reward;
  return [tree, reward];
}

function getBestAction (
  playerColour,
  state,
  gridSettings
) {
  // The tree is a map of nodeId to node value.
  //
  // The nodeId is a string contructed from:
  // concat(parentNodeId, actionIdx).
  //
  // The root node has an ID of the empty string.

  let tree = {'': 0};
  for (let i = 0; i < iterations; i+= 1) {
    [tree] = treeWalk(playerColour, gridSettings, tree, state);
  }

  const actionValues = _.map(getValidActions(state), (action, actionIdx) => {
    const nodeId = makeNodeId('', actionIdx);
    return {
      action,
      value: tree[nodeId]
    };
  });

  console.dir(actionValues);
  const bestAction = _(actionValues).sortByAll('value').last();
  return bestAction.action;
}

onmessage = function (message) {
  const messageObj = transit.fromJSON(message.data);

  switch (messageObj.action) {
    case 'getBestAction':
      const { playerColour, state, gridSettings } = messageObj;
      const bestAction = getBestAction(playerColour, state, gridSettings);
      console.log(`Got best action`, bestAction);
      postMessage(bestAction);
      break;
    default:
      throw new Error(`Unhandled message action: ${message.data.action}`);
  }
}
