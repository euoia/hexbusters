import { PLAYERS_JOIN } from '../constants/ActionTypes.js';
export function playersJoin(players) {
  return {
    type: PLAYERS_JOIN,
    players: players
  };
}
