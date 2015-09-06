import alt from '../alt.js';
import HBConstants from '../constants/HBConstants.js';

class MessageActions {
  addMessage (playerName, message) {
    return {
      actionType: HBConstants.ADD_MESSAGE,
      playerName: playerName,
      message: message
    };
  }
}

export default alt.createActions(MessageActions);
