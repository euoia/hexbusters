import { tileChosen } from '../actions/PlayerActions.js';
import _ from 'lodash';

const getCurrentPlayer = (state) => {
    if (state.players === undefined || state.players.length === 0 || state.winner) {
      return null;
    }

    return state.players[state.currentPlayerIdx % state.numPlayers];
};

const isCurrentPlayer = (state, player) => {
  if (state.players === undefined) {
    return false;
  }

  const currentPlayer = getCurrentPlayer(state);
  if (currentPlayer === null) {
    return false;
  }

  return currentPlayer.name === player.name;
};

const getActions = (state) => {
  if (state.winner) {
    return [];
  }

  const neutralTiles = Object.keys(state.tiles.neutral);
  return neutralTiles.map(
    tileId => {
      return tileChosen({
        tileId: tileId,
        colour: getCurrentPlayer(state).colour
      })
    });
};

const getRandomAction = (state) => {
  if (state.winner) {
    return null;
  }

  const neutralTiles = Object.keys(state.tiles.neutral);
  if (neutralTiles.length === 0) {
    return null;
  }

  return tileChosen({
    tileId: _.sample(neutralTiles),
    colour: getCurrentPlayer(state).colour
  });
};

export default {
  getCurrentPlayer,
  isCurrentPlayer,
  getActions,
  getRandomAction
};
