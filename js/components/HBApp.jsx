import Players from './Players.jsx';
import Board from './Board.jsx';
import Messages from './Messages.jsx';
import React from 'react';
import PlayerStore from '../stores/PlayerStore.js';
import BoardStore from '../stores/BoardStore.js';
import MessageStore from '../stores/MessageStore.js';

function getHBState() {
  return {
    board: BoardStore.getBoard(),
    messages: MessageStore.getAll(),
    players: PlayerStore.getAll()
  };
}

module.exports = React.createClass({

  getInitialState: function() {
    return getHBState();
  },

  componentDidMount: function() {
    PlayerStore.listen(this._onChange);
    BoardStore.listen(this._onChange);
    MessageStore.listen(this._onChange);
  },

  componentWillUnmount: function() {
    PlayerStore.unlisten(this._onChange);
    BoardStore.unlisten(this._onChange);
    MessageStore.unlisten(this._onChange);
  },

  /**
   * @return {object}
   */
  render: function() {
    return (
      <div>
        <Players
          players={this.state.players}
        />
        <Board
          board={this.state.board}
        />
        <Messages
          messages={this.state.messages}
        />
      </div>
    );
  },

  /**
   * Event handler for 'change' events.
   */
  _onChange: function() {
    this.setState(getHBState());
  }
});
