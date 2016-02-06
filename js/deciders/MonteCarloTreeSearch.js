import _ from 'lodash';
import gameReducer from '../reducers/hexbusters.js';
import { getValidActions, getWinner } from '../hexbusters/helpers.js';

export default class MonteCarloTreeSearch {
  constructor (options = {}) {
    /**
     * How much time to spend thinking.
     */
    this.timeLimitMs = options.timeLimitMs || 1000;

    /**
     * Whether to output debug information.
     */
    this.debug = options.debug || false;
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
          const actionNodeId = MonteCarloTreeSearch.makeNodeId(nodeId, action.actionId);
          return tree[actionNodeId] === undefined;
        }
      ).value();
  }

  static randomWalk(playerColour, GRID, state, depth) {
    switch (getWinner(state, GRID)) {
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
        return MonteCarloTreeSearch.randomWalk(
          playerColour,
          GRID,
          gameReducer(state, _.sample(validActions)),
          depth + 1
        );
      default:
        // Prefer further away losses.
        return -100 + depth;
    }
  }

  static treeWalk (playerColour, GRID, tree, state, nodeId = '', depth = 0) {
    const unexploredActions = MonteCarloTreeSearch.getUnexploredActions(
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
      const nextNodeId = MonteCarloTreeSearch.makeNodeId(nodeId, action.actionId);

      tree[nextNodeId] = tree[nextNodeId] || 0;

      reward = this.randomWalk(
        playerColour,
        GRID,
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
      const nextNodeId = MonteCarloTreeSearch.makeNodeId(nodeId, actionIdx);

      [tree, reward] = MonteCarloTreeSearch.treeWalk(
        playerColour,
        GRID,
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
    GRID
  ) {
    // The tree is a map of nodeId to node value.
    //
    // The nodeId is a string contructed from:
    // concat(parentNodeId, actionIdx).
    //
    // The root node has an ID of the empty string.

    const dateLimit = Date.now() + this.timeLimitMs;

    let tree = {'': 0};
    let iterations = 0;
    while (Date.now() < dateLimit) {
      [tree] = MonteCarloTreeSearch.treeWalk(playerColour, GRID, tree, state);
      iterations += 1;
    }

    const actionValues = _.map(getValidActions(state), (action, actionIdx) => {
      const nodeId = MonteCarloTreeSearch.makeNodeId('', actionIdx);
      return {
        action,
        value: tree[nodeId]
      };
    });

    const bestAction = _(actionValues).sortByAll('value').last();

    if (this.debug) {
      _(actionValues).sortByAll('value').each(
        a => console.log(`${a.value} => ${a.action.tileId}`)
      ).value();
    }

    return {
      bestAction: bestAction.action,
      iterations
    };
  }
}
