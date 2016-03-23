import { PLAYERS_JOIN, TILE_CHOSEN } from '../constants/ActionTypes.js';
import { getCurrentPlayer } from '../hexbusters/helpers.js';
import init from '../hexbusters/init.js';
import { COLOUR_RED, COLOUR_BLUE } from '../constants/Colours.js';
import GRID from '../constants/Grid.js';
import { getWinner } from '../hexbusters/helpers.js';
import _ from 'lodash';

function reduceTiles(tiles, tileId, currentPlayer) {
  const newTiles = {};

  if (currentPlayer.colour === COLOUR_RED) {
    newTiles.red = _.clone(tiles.red);
    newTiles.red[tileId] = true;
  } else {
    newTiles.red = tiles.red;
  }

  if (currentPlayer.colour === COLOUR_BLUE) {
    newTiles.blue = _.clone(tiles.blue);
    newTiles.blue[tileId] = true;
  } else {
    newTiles.blue = tiles.blue;
  }

  newTiles.neutral = _.clone(tiles.neutral);
  delete newTiles.neutral[tileId];

  return newTiles;
}

export default function gameReducer(state, action) {
  if (state === undefined) {
    return init(GRID);
  }

  switch (action.type) {
    case PLAYERS_JOIN:
      return {
        ...state,
        players: action.players
      };

    case TILE_CHOSEN:
      if (state.winner) {
        console.log(`Tried to choose a tile after the game is over!`);
        return state;
      }

      if (state.tiles.neutral[action.tileId] === undefined) {
        console.log('Tried to choose an occupied tile!');
        return state;
      }

      if (action.colour !== getCurrentPlayer(state).colour) {
        console.log('Wrong player tried to go!');
        return state;
      }

      const currentPlayer = getCurrentPlayer(state);
      let ns = {
        ...state,
        tiles: reduceTiles(state.tiles, action.tileId, currentPlayer),
        currentPlayerIdx: state.currentPlayerIdx + 1
      };

      ns.winner = getWinner(ns, ns.grid);
      return ns;

    default:
      return state;
  }
}
