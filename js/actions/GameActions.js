export const NEXT_TURN = 'NEXT_TURN';
export const PLAYERS_JOIN = 'PLAYERS_JOIN';

export function nextTurn() {
  return {
    type: NEXT_TURN
  };
}

export function playersJoin(players) {
  return {
    type: PLAYERS_JOIN,
    players: players
  };
}
