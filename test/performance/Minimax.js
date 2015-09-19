import Minimax from '../../js/hexbusters/Minimax.js';
import InitialState from '../../js/constants/InitialState.js';
import { COLOUR_RED } from '../../js/constants/Colours.js';

const gameState = {
  ...InitialState,
  players: [{colour: 'red'}, {colour: 'blue'}]
};

const gridSettings = {
  width: 3,
  height: 3,
  orientation: 'flat-topped',
  layout: 'odd-q'
};

const timeLimitMs = 5000;
console.log(`Running Minimax board evaluation for ${timeLimitMs}ms...`);

const startTime = new Date();
const { statesEvaluated } = Minimax.evaluateState(
  COLOUR_RED,
  gameState,
  gridSettings,
  startTime.getTime() + timeLimitMs
);

console.log(`Evaluated ${statesEvaluated} states.`);
