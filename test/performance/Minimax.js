import Minimax from '../../js/hexbusters/Minimax.js';
import InitialState from '../../js/constants/InitialState.js';

const gameState = {
  ...InitialState,
  players: [{colour: 'red'}, {colour: 'blue'}]
};

const timeLimitMs = 5000;
console.log(`Running Minimax board evaluation for ${timeLimitMs}ms...`);

const startTime = new Date();
const { statesEvaluated } = Minimax.evaluateState(
  gameState,
  startTime.getTime() + timeLimitMs
);

console.log(`Evaluated ${statesEvaluated} states.`);
