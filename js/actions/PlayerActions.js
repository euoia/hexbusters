export const TILE_CHOSEN = 'TILE_CHOSEN';

export function tileChosen(tile) {
  return {
    type: TILE_CHOSEN,
    tile
  };
}
