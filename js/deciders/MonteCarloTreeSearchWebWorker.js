/* eslint-env worker */
import MonteCarloTreeSearch from './MonteCarloTreeSearch.js';

/**
 * The slightly odd looking code with onmessage and postmessage is because when
 * this code is ran in a web worker those functions are globally defined. When
 * ran in the tests, they're not.
 */

function handleMessage (message) {
  const messageObj = JSON.parse(message.data);

  switch (messageObj.action) {
    case 'getBestAction':
      // We can't store the tiles as a Set because it's not supported in the web browser.
      // "Set is not function".
      const { debug, playerColour, state, timeLimitMs = 5000} = messageObj;
      const mcts = new MonteCarloTreeSearch({timeLimitMs, debug});
      const action = mcts.getBestAction(playerColour, state);

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
