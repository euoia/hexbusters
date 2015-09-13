import React, { Component, PropTypes } from 'react';
import Board from '../components/Board.jsx';
import Messages from '../components/Messages.jsx';
import Players from '../components/Players.jsx';
import { connect } from 'react-redux';
import { isCurrentPlayer } from '../hexbusters/gameHelpers.js';

class HBApp extends Component {
  render () {
    const {
      board,
      isCurrentPlayer,
      messages,
      players,
      chooseTile
    } = this.props;

    return (
      <div>
        <Players isCurrentPlayer={isCurrentPlayer} players={players} />
        <Board  board={board} chooseTile={chooseTile} />
        <Messages messages={messages} />
      </div>
    );
  }
}

HBApp.propTypes = {
  board: PropTypes.object.isRequired,
  chooseTile: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  isCurrentPlayer: PropTypes.func.isRequired,
  messages: PropTypes.array.isRequired,
  players: PropTypes.array.isRequired
};

function mapStateToProps(state) {
  return {
    messages: state.game.messages,
    board: state.game.board,
    players: state.game.players,
    isCurrentPlayer: isCurrentPlayer.bind(null, state.game)
  };
}
export default connect(mapStateToProps)(HBApp);
