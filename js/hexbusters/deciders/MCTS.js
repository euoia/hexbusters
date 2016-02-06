import _ from 'lodash';
import gameReducer from '../../reducers/game.js';
import { getValidActions, getWinner } from '../helpers.js';

// Monte Carlo Tree Search.
export default class MCTS {
  constructor (options = {}) {
    /**
     * How mant iterations of the algorithm to perform.
     */
    this.iterations = options.iterations || 1000;
  }

  static makeNodeId (currentNodeId, actionId) {
    return `${currentNodeId}:${actionId}`;
  }

  static getUnexploredActions (tree, state, nodeId) {
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
          const actionNodeId = MCTS.makeNodeId(nodeId, action.actionId);
          return tree[actionNodeId] === undefined;
        }
      ).value();
  }

  static randomWalk(playerColour, gridSettings, state, depth) {
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
        return MCTS.randomWalk(
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

  static treeWalk (playerColour, gridSettings, tree, state, nodeId = '', depth = 0) {
    const unexploredActions = MCTS.getUnexploredActions(
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
      const nextNodeId = MCTS.makeNodeId(nodeId, action.actionId);

      tree[nextNodeId] = tree[nextNodeId] || 0;

      reward = this.randomWalk(
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
      const nextNodeId = MCTS.makeNodeId(nodeId, actionIdx);

      [tree, reward] = MCTS.treeWalk(
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

  getBestAction (
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
    for (let i = 0; i < this.iterations; i+= 1) {
      [tree] = MCTS.treeWalk(playerColour, gridSettings, tree, state);
    }

    const actionValues = _.map(getValidActions(state), (action, actionIdx) => {
      const nodeId = MCTS.makeNodeId('', actionIdx);
      return {
        action,
        value: tree[nodeId]
      };
    });

    const bestAction = _(actionValues).sortByAll('value').last();
    //_(actionValues).sortByAll('value').each(a => console.log(`${a.value} => ${a.action.tileId}`)).value();
    return bestAction.action;
  }
}
