import { tileChosen } from '../actions/PlayerActions.js';
import _ from 'lodash';
import { getTileCoordinatesById, getShortestPathsFromTileId } from 'hex-grid.js';
import { COLOUR_NEUTRAL } from '../constants/Colours.js';

const getCurrentPlayer = (state) => {
    if (state.players === undefined || state.players.length === 0) {
      return null;
    }

    return state.players[state.board.get('currentPlayerIdx') % state.players.length];
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

const isTileUnoccupied = (state, tileId) => {
  return state.board.getIn(['tileColours', tileId]) === COLOUR_NEUTRAL;
};

const getUnoccupiedTiles = (state) => {
  return state.board.get('tileColours').filter(
    colour => colour === COLOUR_NEUTRAL
  );
}

const getValidActions = (state) => {
  return getUnoccupiedTiles(state).map(
    (colour, tileId) => {
      return tileChosen({
        tileId: tileId,
        colour: getCurrentPlayer(state).colour
      })
    }).toArray();
};

const getWinner = (state, gridSettings) => {
  const validStartTiles = state.board.get('tileColours').filter(
    (colour, tileId) =>
      getTileCoordinatesById(gridSettings, tileId).x === 0 &&
      colour !== COLOUR_NEUTRAL
  );

  const validEndTiles = state.board.get('tileColours').filter(
    (colour, tileId) =>
      getTileCoordinatesById(gridSettings, tileId).x === gridSettings.width - 1 &&
      colour !== COLOUR_NEUTRAL
  );

  let winningColour = validStartTiles.find(
    (colour, tileId) => {
      let paths = getShortestPathsFromTileId(
        gridSettings,
        tileId,
        {
          moveCost: (fromTileId, toTileId) => {
            return state.board.getIn(['tileColours', fromTileId]) === state.board.getIn(['tileColours', toTileId]) ?
              0 :
              Number.POSITIVE_INFINITY;
          },
          maxCost: 100
        }
      );

      let winningEndTiles = _.intersection(
        Object.keys(paths),
        Object.keys(validEndTiles.toJS())
      );

      if (winningEndTiles.length > 0) {
        return true;
      }

      return false;
    }
  );

  if (winningColour) {
    return winningColour;
  }

  return null;
}

export default {
  getCurrentPlayer,
  isCurrentPlayer,
  isTileUnoccupied,
  getValidActions,
  getWinner
};
