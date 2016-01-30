import MCTS from '../../js/hexbusters/worker-deciders/MCTS.js';
import { COLOUR_NEUTRAL, COLOUR_BLUE, COLOUR_RED } from '../../js/constants/Colours.js';
import _ from 'lodash';
import transit from 'transit-immutable-js';
import { getTileIds } from 'hex-grid';
import Immutable from 'immutable';

const gridSettings = {
  width: 11,
  height: 11,
  orientation: 'flat-topped',
  layout: 'odd-q'
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
  })
};

const timeLimitMs = 10000;
console.log(`[MCTS Worker] Running MCTS board evaluation for ${timeLimitMs}ms...`);

const startTime = new Date();
const { iterations } = MCTS.getBestAction({
  data: transit.toJSON({
    action: 'getBestAction',
    timeLimitMs: timeLimitMs,
    playerColour: COLOUR_RED,
    state: {
      board: gameState.board,
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

console.log(`[MCTS Worker] Executed ${iterations} iterations in ${timeTaken}ms.`);
console.log(`[MCTS Worker] Executed ${iterations} iterations per second.`);
