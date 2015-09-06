import alt from '../alt.js';
import PlayerActions from '../actions/PlayerActions.js';
import MessageActions from '../actions/MessageActions.js';

class MessageStore {
  constructor () {
    this.bindListeners({
      onPlayerJoin: PlayerActions.playerJoin,
      onAddMessage: MessageActions.addMessage
    });

    this.messages = [];

    this.exportPublicMethods({
      getAll: this.getAll
    });
  }

  /**
   * Get the entire collection of players.
   * @return {object}
   */
  getAll () {
    return this.getState().messages;
  }

  onPlayerJoin (action) {
    /* eslint-disable no-console */
    console.log('[MessageStore] Player joined', action.player);
  }

  onAddMessage (action) {
    this.messages.push(
      `${action.playerName}: ${action.message}`
    );
  }
}

export default alt.createStore(MessageStore, 'MessageStore');
