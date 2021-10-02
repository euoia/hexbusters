/* eslint-env worker */
import MonteCarloTreeSearch from './MonteCarloTreeSearch.js';
import { Set, fromJS } from 'immutable';

/**
 * The slightly odd looking code with onmessage and postmessage is because when
 * this code is ran in a web worker those functions are globally defined. When
 * ran in the tests, they're not.
 */

function handleMessage(message) {
  console.log(`[MonteCarloTreeSearchWebWorker] Got message`, message);

  const messageObj =
    typeof message === 'object' ? message.data : JSON.parse(message);

  switch (messageObj.action) {
    case 'getBestAction':
      // We can't store the tiles as a Set because it's not supported in the web browser.
      // "Set is not function".
      const { debug, playerColour, state, timeLimitMs = 5000 } = messageObj;

      // Convert the immutable.js sets back to sets.
      state.tiles.neutral = new Set(fromJS(state.tiles.neutral));
      state.tiles.red = new Set(fromJS(state.tiles.red));
      state.tiles.blue = new Set(fromJS(state.tiles.blue));

      const mcts = new MonteCarloTreeSearch({ timeLimitMs, debug });
      const action = mcts.getBestAction(playerColour, state);
      console.log(`Best action is`, action);

      if (typeof postMessage !== 'undefined') {
        postMessage(action);
      }

      return action;
    default:
      console.warn(`Unhandled message action: ${message.data.action}`);
  }
}

if (typeof onmessage !== 'undefined') {
  console.log(`Initialising onmessage`);
  onmessage = handleMessage;
}

export default handleMessage;
