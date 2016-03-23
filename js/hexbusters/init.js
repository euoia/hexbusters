import { getTileIds } from 'hex-grid';
import _ from 'lodash';

// We can't store the tiles as a Set because it's not supported in the web browser.
// "Set is not function".
export default (grid) => {
  return {
    currentPlayerIdx: 0,
    grid: grid,
    messages: [],
    numPlayers: 2,
    players: [],
    tiles: {
      neutral: _(getTileIds(grid)).mapKeys().mapValues(() => true).value(),
      blue: {},
      red: {}
    },
    winner: null
  };
}
