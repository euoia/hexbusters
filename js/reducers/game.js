import { PLAYERS_JOIN, TILE_CHOSEN, ADD_MESSAGE } from '../constants/ActionTypes.js';
import { COLOUR_NEUTRAL } from '../constants/Colours.js';
import HexGrid from 'hex-grid.js';
import hb from '../hexbusters/hb.js';
import check from 'check-types';
import GridSettings from '../constants/GridSettings.js';
import _ from 'lodash';

const initialState = {
  players: [],
  currentPlayerIdx: 0,
  messages: [],
  tileColours: _.chain(HexGrid.getTileIds(GridSettings))
    .indexBy()
    .mapValues(() => COLOUR_NEUTRAL)
    .value()
};

function tileChosenReduceTiles(tileColours, tileId, currentPlayer) {
  check.assert.assigned(currentPlayer, 'currentPlayer was undefined.');
  return _.mapValues(
    tileColours,
    (colour, tileColourId) => {
      return tileColourId === tileId ? currentPlayer.colour : colour
    }
  );
}

export default function gameReducer(state = initialState, action) {
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

      let ns = {
        ...state,
        tileColours: tileChosenReduceTiles(
          state.tileColours,
          action.tileId,
          hb(state).getCurrentPlayer()
        ),
        currentPlayerIdx: state.currentPlayerIdx + 1
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
