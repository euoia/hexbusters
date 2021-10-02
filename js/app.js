import AIPlayer from './players/AIPlayer.js';
import HumanPlayer from './players/HumanPlayer.js';
import React from 'react';
import { render } from 'react-dom';
import _ from 'lodash';
import { AppContainer, store } from './containers/AppContainer.js';
import { COLOUR_BLUE, COLOUR_RED } from './constants/Colours.js';
import { playersJoin } from './actions/GameActions.js';
import MonteCarloTreeSearchWebWorker from 'worker-loader!./deciders/MonteCarloTreeSearchWebWorker.js';

import '../css/app.css';

const actionDecider = new MonteCarloTreeSearchWebWorker();

// Shuffle the colours since blue always goes first.
const colours = _.shuffle([COLOUR_BLUE, COLOUR_RED]);

const humanPlayer = new HumanPlayer({
  name: 'Player',
  store: store,
  colour: colours[0]
});

store.dispatch(
  playersJoin([
    humanPlayer,
    new AIPlayer({
      name: 'Hexbot',
      store: store,
      colour: colours[1],
      actionDecider: actionDecider
    })
  ])
);

const container = document.createElement('section');
document.body.appendChild(container);

render(
  <AppContainer chooseTile={humanPlayer.chooseTile.bind(humanPlayer)} />,
  container
);
