import alt from '../alt.js';
import PlayerActions from '../actions/PlayerActions.js';

class PlayerStore {
  constructor () {
    this.bindListeners({
      playerJoin: PlayerActions.playerJoin
    });

    this.players = [];

    this.exportPublicMethods({
      getAll: this.getAll
    });
  }

  /**
   * Get the entire collection of players.
   * @return {object}
   */
  getAll () {
    return this.getState().players;
  }

  playerJoin (action) {
    /* eslint-disable no-console */
    console.log('[PlayerStore] Player joined', action.player);
  }
}

export default alt.createStore(PlayerStore, 'PlayerStore');
