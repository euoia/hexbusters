import { PLAYERS_JOIN, TILE_CHOSEN, ADD_MESSAGE } from '../constants/ActionTypes.js';
import { isTileUnoccupied, getCurrentPlayer } from '../hexbusters/helpers.js';
import check from 'check-types';
import init from '../hexbusters/init.js';
import { COLOUR_RED, COLOUR_BLUE } from '../constants/Colours.js';
import GRID from '../constants/Grid.js';
import _ from 'lodash';

const numPlayers = 2;

function tileChosenReduceBoard(board, tileId, currentPlayer) {
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

function tileChosenReduceRedTiles(redTiles, tileId, currentPlayer) {
  if (currentPlayer.colour !== COLOUR_RED) {
    return redTiles;
  }

  const newRedTiles = _.clone(redTiles);
  newRedTiles[tileId] = true;
  return newRedTiles;
}

function tileChosenReduceBlueTiles(blueTiles, tileId, currentPlayer) {
  if (currentPlayer.colour !== COLOUR_BLUE) {
    return blueTiles;
  }

  const newBlueTiles = _.clone(blueTiles);
  newBlueTiles[tileId] = true;
  return newBlueTiles;
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
        board: tileChosenReduceBoard(
          state.board,
          action.tileId,
          currentPlayer
        ),
        redTiles: tileChosenReduceRedTiles(state.redTiles, action.tileId, currentPlayer),
        blueTiles: tileChosenReduceBlueTiles(state.blueTiles, action.tileId, currentPlayer)
      };

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
