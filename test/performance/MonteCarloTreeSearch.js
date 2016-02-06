import MonteCarloTreeSearch from '../../js/hexbusters/deciders/MonteCarloTreeSearch.js';
import { COLOUR_NEUTRAL, COLOUR_BLUE, COLOUR_RED } from '../../js/constants/Colours.js';
import _ from 'lodash';
import transit from 'transit-immutable-js';
import { getTileIds } from 'hex-grid';
import Immutable from 'immutable';

const width = 11,
  height = 11;

const gridSettings = {
  width: width,
  height: height,
  orientation: 'flat-topped',
  layout: 'odd-q',
  validate: false
};

const gameState = {
  players: [{colour: COLOUR_RED}, {colour: COLOUR_BLUE}],
  numPlayers: 2,
  messages: [],
  board: Immutable.fromJS({
    currentPlayerIdx: 0,
    tileColours: _.chain(getTileIds(gridSettings))
      .indexBy()
      .mapValues(() => COLOUR_NEUTRAL)
      .value()
  }),
  blueTiles: {},
  redTiles: {}
};

const timeLimitS = 10;
console.log(`[MonteCarloTreeSearch] Running MCTS board evaluation for ${timeLimitS}s (${width} x ${height})...`);

const startTime = new Date();
const { iterations } = MonteCarloTreeSearch.getBestAction({
  data: transit.toJSON({
    action: 'getBestAction',
    timeLimitMs: timeLimitS * 1000,
    playerColour: COLOUR_RED,
    state: {
      ...gameState,
      // Having to explicitly omit the actionDecider property is rather unfortunate.
      players: _.map(
        gameState.players,
        player => _.omit(player, 'actionDecider')
      )
    },
    gridSettings: gridSettings
  })
});

const endTime = new Date();
const timeTaken = endTime - startTime;

console.log(`[MonteCarloTreeSearch] Executed ${iterations} iterations in ${timeTaken}ms.`);
console.log(`[MonteCarloTreeSearch] Executed ${iterations / timeLimitS} iterations per second.`);
