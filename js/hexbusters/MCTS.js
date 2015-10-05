import _ from 'lodash';
import gameReducer from '../reducers/game.js';
import hb from './hb.js';

// Monte Carlo Tree Search.
export default class MCTS {
  static makeNodeId (currentNodeId, actionId) {
    return `${currentNodeId}:${actionId}`;
  }

  static getUnexploredActions (tree, gameState, nodeId) {
    const game = hb(gameState);
    const validActions = game.getValidActions();

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

  static randomWalk(playerColour, gridSettings, gameState, depth) {
    const game = hb(gameState);

    switch (game.getWinner(gridSettings)) {
      case playerColour:
        // Prefer quicker wins.
        return 100 - depth;
      case null:
        const validActions = game.getValidActions();

        // Stalemate.
        if (validActions.length === 0) {
          return 0;
        }

        // Keep going.
        return MCTS.randomWalk(
          playerColour,
          gridSettings,
          gameReducer(gameState, _.sample(validActions)),
          depth + 1
        );
      default:
        // Prefer further away losses.
        return -100 + depth;
    }
  }

  static treeWalk (playerColour, gridSettings, tree, gameState, nodeId = '', depth = 0) {
    const unexploredActions = MCTS.getUnexploredActions(
      tree,
      gameState,
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
        gameReducer(gameState, action),
        depth + 1
      );

      tree[nextNodeId] += reward;
    } else {
      // This node is not a fringe node: all children have already been
      // explored.  Might as well select a random successor.
      const game = hb(gameState);
      const validActions = game.getValidActions();
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
        gameReducer(gameState, action),
        nextNodeId,
        depth + 1
      );
    }

    tree[nodeId] = (tree[nodeId] || 0) + reward;
    return [tree, reward];
  }

  static getBestAction (
    playerColour,
    gameState,
    gridSettings
  ) {
    // How many iterations to perform.
    const limit = 5000;

    // The tree is a map of nodeId to node value.
    //
    // The nodeId is a string contructed from:
    // concat(parentNodeId, actionIdx).
    //
    // The root node has an ID of the empty string.

    let tree = {'': 0};
    for (let i = 0; i < limit; i+= 2) {
      [tree] = MCTS.treeWalk(playerColour, gridSettings, tree, gameState);
    }

    const game = hb(gameState);
    const actionValues = _.map(game.getValidActions(), (action, actionIdx) => {
      const nodeId = MCTS.makeNodeId('', actionIdx);
      return {
        action,
        value: tree[nodeId]
      };
    });

    console.dir(actionValues);
    const bestAction = _(actionValues).sortByAll('value').last();
    return bestAction.action;
  }
}
