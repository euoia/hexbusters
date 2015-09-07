export const TILE_CLICKED = 'TILE_CLICKED';

export function tileClicked(tileId) {
  return {
    type: TILE_CLICKED,
    tileId
  };
}
