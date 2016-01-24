import { PLAYERS_JOIN, TILE_CHOSEN, ADD_MESSAGE } from '../constants/ActionTypes.js';
import { isTileUnoccupied, getCurrentPlayer } from '../hexbusters/helpers.js';
import check from 'check-types';
import InitialState from '../constants/InitialState.js';

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
        (board.get('currentPlayerIdx') + 1) % InitialState.numPlayers
      );
    }
  );
}

export default function gameReducer(state = InitialState, action) {
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

      let ns = {
        ...state,
        board: tileChosenReduceBoard(
          state.board,
          action.tileId,
          getCurrentPlayer(state)
        )
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
