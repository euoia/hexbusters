import { App, store } from './containers/App.js';
import React from 'react';
import _ from 'lodash';
import { HUMAN_PLAYER, AI_PLAYER } from './constants/PlayerTypes.js';
import { playersJoin } from './actions/GameActions.js';
import { addMessage } from './actions/MessageActions.js';

function startGame () {
  // Shuffle the players, blue starts.
  let players = _.shuffle([
    {
      name: 'playerOne',
      type: HUMAN_PLAYER
    },
    {
      name: 'hexBot',
      type: AI_PLAYER
    }
  ]);

  let colours = [
    'blue',
    'red'
  ];

  _.each(
    players,
    (player, playerIdx) => {
      player.colour = colours[playerIdx];
    }
  );

  store.dispatch(
    playersJoin(players)
  );

  store.dispatch(
      addMessage({
        playerName: 'Bob',
        text: 'Hello world!'
      })
  );
}

startGame();

React.render(
  <App />,
  document.getElementById('hbapp')
);

