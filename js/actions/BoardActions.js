import alt from '../alt.js';
import HBConstants from '../constants/HBConstants.js';

class BoardActions {
  clickTile (tile) {
    return {
      actionType: HBConstants.CLICK_TILE,
      tile: tile
    };
  }
}

export default alt.createActions(BoardActions);
