export const ADD_MESSAGE = 'ADD_MESSAGE';

export function addMessage(options) {
  const { playerName, text } = options;

  return {
    type: ADD_MESSAGE,
    playerName,
    text
  };
}
