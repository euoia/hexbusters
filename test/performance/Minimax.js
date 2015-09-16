import Minimax from '../../js/hexbusters/Minimax.js';
import InitialBoardState from '../../js/constants/InitialState.js';

const boardState = {
  ...InitialBoardState,
  players: [{colour: 'red'}, {colour: 'blue'}]
};

const timeLimitMs = 5000;
console.log(`Running Minimax board evaluation for ${timeLimitMs}...`);

const startTime = new Date();
const { statesEvaluated } = Minimax.evaluateState(
  boardState,
  startTime.getTime() + timeLimitMs
);

console.log(`Evaluated ${statesEvaluated} states.`);
