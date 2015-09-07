import { PLAYERS_JOIN, TILE_CLICKED, ADD_MESSAGE } from '../constants/ActionTypes.js';
import HexGrid from 'hex-grid.js';

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

function reduceBoard(state, action, currentPlayer) {
  if (currentPlayer === undefined) {
    throw new Error('currentPlayer was undefined!');
  }

  let newState = Object.assign(
    { __proto__: state.__proto__ },
    state,
    {
      tiles: state.tiles.map(
        tile => {
          if (tile.id === action.tileId) {
            tile.colour = currentPlayer.colour
          }
          return tile;
        }
      )
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
      console.log('getPositionById', state.board);
      let newState = {
        ...state,
        board: reduceBoard(state.board, action, getCurrentPlayer(state))
      };
      console.log('getPositionById', newState.board);
      return newState;

    //case TILE_CHOSEN:
      // TODO: How to implement this?
      //let tile = this.board.getTileById(action.tile.id);
      //tile.colour = this.getCurrentPlayer().colour;
      //this.nextPlayer();
    case ADD_MESSAGE:
      return {
        messages: [action.message, ...state.messages],
        ...state
      };
    default:
      return state;
  }
}
