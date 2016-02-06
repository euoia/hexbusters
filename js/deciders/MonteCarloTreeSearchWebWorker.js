/* eslint-env worker */
import MonteCarloTreeSearch from './MonteCarloTreeSearch.js';
import transit from 'transit-immutable-js';

/**
 * The slightly odd looking code with onmessage and postmessage is because when
 * this code is ran in a web worker those functions are globally defined. When
 * ran in the tests, they're not.
 */

function handleMessage (message) {
  const messageObj = transit.fromJSON(message.data);

  switch (messageObj.action) {
    case 'getBestAction':
      const { playerColour, state, GRID, timeLimitMs = 5000} = messageObj;
      const mcts = new MonteCarloTreeSearch({timeLimitMs});
      const action = mcts.getBestAction(playerColour, state, GRID);

      if (typeof postMessage !== 'undefined') {
        postMessage(action);
      }

      return action;
    default:
      throw new Error(`Unhandled message action: ${message.data.action}`);
  }
}

if (typeof onmessage !== 'undefined') {
  onmessage = handleMessage;
}

export default {getBestAction: handleMessage};
