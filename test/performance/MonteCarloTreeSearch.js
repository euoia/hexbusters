import MonteCarloTreeSearch from '../../js/deciders/MonteCarloTreeSearch.js';
import gameReducer from '../../js/reducers/hexbusters.js';
import init from '../../js/hexbusters/init';
import { COLOUR_RED, COLOUR_BLUE } from '../../js/constants/Colours.js';
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

console.log(`[MonteCarloTreeSearch] Running MCTS board evaluation for ${timeLimitS}s (${width} x ${height})...`);
const mcts = new MonteCarloTreeSearch({timeLimitMs: timeLimitS * 1000});

const startTime = new Date();
const { iterations } = mcts.getBestAction(COLOUR_RED, testState, grid);

const endTime = new Date();
const timeTaken = endTime - startTime;

console.log(`[MonteCarloTreeSearch] Executed ${iterations} iterations in ${timeTaken}ms.`);
console.log(`[MonteCarloTreeSearch] Executed ${timeTaken / 1000} iterations per second.`);
