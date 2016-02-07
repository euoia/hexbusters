import { PLAYERS_JOIN, TILE_CHOSEN, ADD_MESSAGE } from '../constants/ActionTypes.js';
import { isTileUnoccupied, getCurrentPlayer } from '../hexbusters/helpers.js';
import check from 'check-types';
import init from '../hexbusters/init.js';
import { COLOUR_RED, COLOUR_BLUE } from '../constants/Colours.js';
import GRID from '../constants/Grid.js';
import { getWinner } from '../hexbusters/helpers.js';
import _ from 'lodash';

const numPlayers = 2;

function reduceBoard(board, tileId, currentPlayer) {
  check.assert.assigned(currentPlayer, 'currentPlayer was undefined.');

  return board.withMutations(
    board => {
      board.setIn(
        ['tileColours', tileId],
        currentPlayer.colour
      );

      board.set(
        'currentPlayerIdx',
        (board.get('currentPlayerIdx') + 1) % numPlayers
      );
    }
  );
}

function reduceTiles(tiles, tileId, currentPlayer) {
  const newTiles = _.cloneDeep(tiles);

  if (currentPlayer.colour === COLOUR_RED) {
    newTiles.red[tileId] = true;
  }

  if (currentPlayer.colour === COLOUR_BLUE) {
    newTiles.blue[tileId] = true;
  }

  delete newTiles.neutral[tileId];

  return newTiles;
}

export default function gameReducer(state, action) {
  if (state === undefined) {
    state = init(GRID);
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

      if (isTileUnoccupied(state, action.tileId) === false) {
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
        board: reduceBoard(
          state.board,
          action.tileId,
          currentPlayer
        ),
        tiles: reduceTiles(state.tiles, action.tileId, currentPlayer)
      };

      ns.winner = getWinner(ns, GRID);
      return ns;

    case ADD_MESSAGE:
      const { playerName, text } = action;
      return {
        ...state,
        messages: [{playerName, text}, ...state.messages]
      };
    default:
      return state;
  }
}
