import { PLAYERS_JOIN, TILE_CLICKED, ADD_MESSAGE } from '../constants/ActionTypes.js';
import HexGrid from 'hex-grid.js';
import _ from 'lodash';

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

function reduceBoard(board, action, currentPlayer) {
  if (currentPlayer === undefined) {
    throw new Error('currentPlayer was undefined!');
  }

  // TODO: Investigate using immutable.js.
  let newState = Object.assign(
    { __proto__: board.__proto__ },
    board,
    {
      tiles: _.chain(board.tiles)
        .map(tile => _.clone(tile))
        .map(tile => {
            if (tile.id === action.tileId) {
              tile.colour = currentPlayer.colour
            }

            return tile;
        })
        .value()
    }
  );

  return newState;
}

function getCurrentPlayer (state) {
  return state.players[state.currentPlayerIdx % state.players.length];
}

export function isCurrentPlayer(state, player) {
  return getCurrentPlayer(state).name === player.name;
}

export default function game(state = initialState, action) {
  switch (action.type) {
    case PLAYERS_JOIN:
      return {
        ...state,
        players: action.players
      };

    case TILE_CLICKED:
      return {
        ...state,
        board: reduceBoard(state.board, action, getCurrentPlayer(state))
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
