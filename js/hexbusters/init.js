import { getTileIds } from 'hex-grid';
import _ from 'lodash';

// We can't store the tiles as a Set because it's not supported in the web browser.
// "Set is not function".
export default (grid) => {
  return {
    players: [],
    numPlayers: 2,
    currentPlayerIdx: 0,
    messages: [],
    tiles: {
      neutral: _(getTileIds(grid)).mapKeys().mapValues(() => true).value(),
      blue: {},
      red: {}
    },
    winner: null
  };
}
