import { TILE_CHOSEN } from '../constants/ActionTypes.js';
import check from 'check-types';

export function tileChosen(action) {
  check.assert.string(action.tileId, 'tileId must a string');
  check.assert.string(action.colour, 'colour must be a string');
  const { tileId, colour } = action;

  return {
    type: TILE_CHOSEN,
    tileId,
    colour
  };
}
