import { PLAYERS_JOIN, TILE_CHOSEN, ADD_MESSAGE } from '../constants/ActionTypes.js';
import HexGrid from 'hex-grid.js';
import _ from 'lodash';
import { getCurrentPlayer, isTileUnoccupied } from '../hexbusters/gameHelpers.js';
import check from 'check-types';

const initialState = {
  players: [],
  currentPlayerIdx: 0,
  board: new HexGrid({
      width: 5,
      height: 5,
      orientation: 'flat-topped',
      layout: 'odd-q',
      tileFactory: {
        nextId: 0,
        newTile: function () {
          let tile = {
            colour: null,
            id: this.nextId.toString(10)
          };

          this.nextId += 1;
          return tile;
        }
      }
  }),
  messages: []
};

function tileChosenReduceBoard(board, tileId, currentPlayer) {
  check.assert.assigned(currentPlayer, 'currentPlayer was undefined.');

  // TODO: Investigate using immutable.js.
  let newState = Object.assign(
    { __proto__: board.__proto__ },
    board,
    {
      tiles: _.chain(board.tiles)
        .map(tile => _.clone(tile))
        .map(tile => {
            if (tile.id === tileId) {
              tile.colour = currentPlayer.colour
            }

            return tile;
        })
        .value()
    }
  );

  return newState;
}

export default function game(state = initialState, action) {
  switch (action.type) {
    case PLAYERS_JOIN:
      return {
        ...state,
        players: action.players
      };

    case TILE_CHOSEN:
      if (isTileUnoccupied(state.board.getTileById(action.tileId)) === false) {
        console.log('Tried to choose an occupied tile!');
        return state;
      }

      return {
        ...state,
        board: tileChosenReduceBoard(state.board, action.tileId, getCurrentPlayer(state)),
        currentPlayerIdx: state.currentPlayerIdx + 1
      };

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
