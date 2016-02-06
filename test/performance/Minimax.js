import Minimax from '../../js/deciders/Minimax.js';
import gameReducer from '../../js/reducers/hexbusters.js';
import init from '../../js/hexbusters/init';
import { COLOUR_BLUE, COLOUR_RED } from '../../js/constants/Colours.js';
import { playersJoin } from '../../js/actions/GameActions.js';

const timeLimitS = 2;
const width = 11, height = 11;

const grid = {
  width: width,
  height: height,
  orientation: 'flat-topped',
  layout: 'odd-q',
  validate: false
};

const gameState = init(grid);

const testState = gameReducer(
  gameState,
  playersJoin([{colour: COLOUR_RED}, {colour: COLOUR_BLUE}])
);

console.log(`[Minimax] Running MCTS board evaluation for ${timeLimitS}s (${width} x ${height})...`);

const startTime = new Date();
const { statesEvaluated } = Minimax.evaluateState(
  COLOUR_RED,
  testState,
  grid,
  startTime.getTime() + (timeLimitS * 1000)
);

const endTime = new Date();
const timeTaken = endTime - startTime;

console.log(`[Minimax] Evaluated ${statesEvaluated} states in ${timeTaken}ms.`);
console.log(`[Minimax] Evaluted ${statesEvaluated / (timeTaken / 1000)} states per second.`);
