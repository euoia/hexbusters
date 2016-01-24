import Minimax from '../../js/hexbusters/deciders/Minimax-stateful.js';
import { COLOUR_NEUTRAL, COLOUR_BLUE, COLOUR_RED } from '../../js/constants/Colours.js';
import _ from 'lodash';
import HexGrid from 'hex-grid.js';

const gridSettings = {
  width: 4,
  height: 4,
  orientation: 'flat-topped',
  layout: 'odd-q'
};

const gameState = {
  players: [{colour: COLOUR_RED}, {colour: COLOUR_BLUE}],
  numPlayers: 2,
  messages: [],
  board: {
    currentPlayerIdx: 0,
    tileColours: _.chain(HexGrid.getTileIds(gridSettings))
      .indexBy()
      .mapValues(() => COLOUR_NEUTRAL)
      .value()
  }
};

const timeLimitMs = 10000;
console.log(`[Minimax Stateful] Running Minimax board evaluation for ${timeLimitMs}ms...`);

const startTime = new Date();
const { statesEvaluated } = Minimax.evaluateState(
  COLOUR_RED,
  gameState,
  gridSettings,
  startTime.getTime() + timeLimitMs
);

const endTime = new Date();
const timeTaken = endTime - startTime;

console.log(`[Minimax Stateful] Evaluated ${statesEvaluated} states in ${timeTaken}ms.`);
console.log(`[Minimax Stateful] Evaluated ${statesEvaluated / (timeTaken / 1000)} states per second.`);
