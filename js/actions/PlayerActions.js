import alt from '../alt.js';
import HBConstants from '../constants/HBConstants.js';

class PlayerActions {
  playerJoin (player) {
    return {
      actionType: HBConstants.PLAYER_JOIN,
      player: player
    };
  }
}

export default alt.createActions(PlayerActions);
