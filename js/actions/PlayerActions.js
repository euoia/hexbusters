import { TILE_CHOSEN } from '../constants/ActionTypes.js';
import check from 'check-types';

export function tileChosen(action) {
  check.assert.assigned(action.tileId, 'tileId must be provided');
  check.assert.assigned(action.colour, 'colour must be provided');
  const { tileId, colour } = action;

  return {
    type: TILE_CHOSEN,
    tileId,
    colour
  };
}
