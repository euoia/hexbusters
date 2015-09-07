export const ADD_MESSAGE = 'ADD_MESSAGE';

export function playersJoin(playerName, message) {
  return {
    type: ADD_MESSAGE,
    playerName,
    message
  };
}
