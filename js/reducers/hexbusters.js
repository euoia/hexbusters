import { PLAYERS_JOIN, TILE_CHOSEN } from '../constants/ActionTypes.js';
import { getCurrentPlayer } from '../hexbusters/helpers.js';
import init from '../hexbusters/init.js';
import { COLOUR_RED, COLOUR_BLUE } from '../constants/Colours.js';
import GRID from '../constants/Grid.js';
import { hasPath } from 'hex-grid';

function reduceTiles(tiles, tileId, currentPlayer) {
  return {
    red: currentPlayer.colour === COLOUR_RED ? tiles.red.add(tileId) : tiles.red,
    blue: currentPlayer.colour === COLOUR_BLUE ? tiles.blue.add(tileId) : tiles.blue,
    neutral: tiles.neutral.delete(tileId)
  };
}

function checkWin (tileId, colour, tiles, startTiles, endTiles, grid) {
  const colourTiles = colour === COLOUR_RED ? tiles.red : tiles.blue;
  const pathFn = tileId => colourTiles.contains(tileId);

  const hasWin = hasPath(grid, [tileId], startTiles, {isPathable: pathFn}) &&
    hasPath(grid, [tileId], endTiles, {isPathable: pathFn});

  if (hasWin) {
    return colour;
  }

  return null;
}

export default function reduceGame(state, action) {
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

      if (state.tiles.neutral.contains(action.tileId) === false) {
        console.log('Tried to choose an occupied tile', action.tileId);
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

      ns.winner = checkWin(action.tileId, currentPlayer.colour, ns.tiles,
        ns.startTiles[currentPlayer.colour], ns.endTiles[currentPlayer.colour], ns.grid);
      return ns;

    default:
      return state;
  }
}
