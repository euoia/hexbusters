import _ from 'lodash';
import gameReducer from '../reducers/hexbusters.js';
import { getActions, getRandomAction, getCurrentPlayer } from '../hexbusters/helpers.js';

class Node {
  constructor ({action = null, parent = null, state = null}) {
    // The action that led to this node. Null for the root node.
    this.action = action;

    // Null for the root node.
    this.parentNode = parent;
    this.childNodes = new Set([]);
    this.wins = 0;
    this.visits = 0;
    this.untriedActions = new Set(getActions(state));
    this.currentPlayer = getCurrentPlayer(state);
  }

  addChild (action, state) {
    const n = new Node({action, state, parent: this});
    this.untriedActions.delete(action);
    this.childNodes.add(n);
    return n;
  }

  update (result) {
    this.visits += 1;
    this.wins += result;
  }

  /**
   * Use the UCB1 formula to select a child node.
   */
  UCB1SelectChild () {
    return _(Array.from(this.childNodes))
      .sortBy(n => n.wins / n.visits + Math.sqrt(2 * Math.log(this.visits) / n.visits))
      .last();
  }
}

function getStateValue (state, player) {
  if (player === null) {
    return null;
  }

  switch (state.winner) {
    case player.colour:
      return -1;
    case null:
      // Stalemate.
      return 0;
    default:
      return 1;
  }
}

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

  getBestAction (
    playerColour,
    rootState
  ) {
    const dateLimit = Date.now() + this.timeLimitMs;
    const rootNode = new Node({state: rootState});

    let iterations = 0;
    while (Date.now() < dateLimit) {
      let node = rootNode;
      let state = rootState;

      // Select until a new fringe node is found.
      while (node.untriedActions.size === 0 && node.childNodes.size > 0) {
        node = node.UCB1SelectChild();
        state = gameReducer(state, node.action);
      }

      // Expand the new node.
      if (node.untriedActions.size > 0) {
        let action = _.sample(Array.from(node.untriedActions));
        state = gameReducer(state, action);
        node = node.addChild(action, state);
      }

      // Rollout to a terminal state.
      // Random walk the tree to a terminal node.
      let randomAction = getRandomAction(state);
      while (randomAction !== null) {
        state = gameReducer(state, randomAction);
        randomAction = getRandomAction(state);
      }

      // Back propagate the terminal state's value.
      while (node !== null) {
        node.update(getStateValue(state, node.currentPlayer));
        node = node.parentNode;
      }

      iterations += 1;
    }

    const rankedNodes = _(Array.from(rootNode.childNodes)).sortBy('visits');

    if (this.debug) {
      const orderedNodes = _(Array.from(rootNode.childNodes)).sortBy('action.tileId');
      orderedNodes.forEach(n => console.log(`${n.visits} => ${n.wins} wins :: tileId=${n.action.tileId}`));
    }

    return {
      bestAction: rankedNodes.last().action,
      iterations
    };
  }
}
