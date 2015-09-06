import alt from '../alt.js';
import BoardActions from '../actions/BoardActions.js';

class BoardStore {
  constructor () {
    this.bindListeners({
      clickTile: BoardActions.clickTile
    });

    this.board = {};

    this.exportPublicMethods({
      getBoard: this.getBoard
    });
  }

  getBoard () {
    return this.getState().board;
  }

  clickTile (action) {
    /* eslint-disable no-console */
    console.log('Tile clicked', action.tile);
  }
}

export default alt.createStore(BoardStore, 'BoardStore');
