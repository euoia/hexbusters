import HexGrid from 'hex-grid.js';
import { tileChosen } from '../actions/PlayerActions.js';

export default class GameState {
  constructor () {
    this.players = [];

    this.currentPlayerIdx = [];

    this.board = new HexGrid({
        width: 5,
        height: 5,
        orientation: 'flat-topped',
        layout: 'odd-q',
        tileFactory: {
          nextId: 0,
          newTile: function () {
            let tile = {
              colour: null,
              id: this.nextId.toString(10)
            };

            this.nextId += 1;
            return tile;
          }
        }
    });

    this.messages = [];
  }

  getCurrentPlayer () {
      if (this.players === undefined || this.players.length === 0) {
        return null;
      }

      return this.players[this.currentPlayerIdx % this.players.length];
  }

  isCurrentPlayer (player) {
    if (this.players === undefined) {
      return false;
    }

    const currentPlayer = this.getCurrentPlayer();
    if (currentPlayer === null) {
      return false;
    }

    return currentPlayer.name === player.name;
  }

  isTileUnoccupied (tileId) {
    return this.board.getTileById(tileId).colour === null;
  }

  getUnoccupiedTiles () {
    return this.board.tiles.filter(
      tile => this.isTileUnoccupied(tile.id)
    ).map(
      tile => tile.id
    );
  }

  getValidActions () {
    return this.getUnoccupiedTiles()
      .map(tileId => {
        return tileChosen({
          tileId,
          colour: this.colour
        })
      });
  }
}
