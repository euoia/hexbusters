import { PLAYERS_JOIN, TILE_CHOSEN, ADD_MESSAGE } from '../constants/ActionTypes.js';
import hb from '../hexbusters/hb.js';
import check from 'check-types';
import InitialState from '../constants/InitialState.js';

function tileChosenReduceBoard(board, tileId, currentPlayer) {
  check.assert.assigned(currentPlayer, 'currentPlayer was undefined.');
  const newBoard = board.setIn(
    ['tileColours', tileId],
    currentPlayer.colour
  );

  return newBoard.set(
    'currentPlayerIdx',
    (newBoard.get('currentPlayerIdx') + 1) % InitialState.numPlayers
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
      if (hb(state).isTileUnoccupied(action.tileId) === false) {
        console.log('Tried to choose an occupied tile!');
        return state;
      }

      if (action.colour !== hb(state).getCurrentPlayer().colour) {
        console.log('Wrong player tried to go!');
      }

      let ns = {
        ...state,
        board: tileChosenReduceBoard(
          state.board,
          action.tileId,
          hb(state).getCurrentPlayer()
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
