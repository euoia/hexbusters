import AIPlayer from './hexbusters/AIPlayer.js';
import HumanPlayer from './hexbusters/HumanPlayer.js';
import React from 'react';
import _ from 'lodash';
import { AppContainer, store } from './containers/AppContainer.js';
import { COLOUR_BLUE, COLOUR_RED } from './constants/Colours.js';
import { addMessage } from './actions/MessageActions.js';
import { playersJoin } from './actions/GameActions.js';
import MCTSWorker from 'worker!./hexbusters/worker-deciders/MCTS.js';

// Shuffle the colours since blue always goes first.
const colours = _.shuffle([COLOUR_BLUE, COLOUR_RED]);

const humanPlayer = new HumanPlayer({
  name: 'Bob',
  store: store,
  colour: colours[0]
});

store.dispatch(
  playersJoin([
    humanPlayer,
    new AIPlayer({
      name: 'hexBot (MCTS)',
      store: store,
      colour: colours[1],
      actionDecider: new MCTSWorker()
    })
  ])
);

// Just a test message.
store.dispatch(
    addMessage({
      playerName: 'Bob',
      text: 'Hello world!'
    })
);

React.render(
  <AppContainer chooseTile={humanPlayer.chooseTile.bind(humanPlayer)} />,
  document.getElementById('hexbusters')
);

