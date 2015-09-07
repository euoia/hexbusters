import * as BoardActions from '../actions/BoardActions.js';
import React, { Component, PropTypes } from 'react';
import Board from '../components/Board.jsx';
import Messages from '../components/Messages.jsx';
import Players from '../components/Players.jsx';
import { connect } from 'react-redux';
import { isCurrentPlayer } from '../reducers/game.js';
import { bindActionCreators } from 'redux';

class HBApp extends Component {
  render () {
    const { board, dispatch, messages, players } = this.props;
    const actions = bindActionCreators(BoardActions, dispatch);

    return (
      <div>
        <Players
          players={players} isCurrentPlayer={this.props.isCurrentPlayer}
        />
        <Board
          board={board} actions={actions}
        />
        <Messages
          messages={messages}
        />
      </div>
    );
  }
}

HBApp.propTypes = {
  board: PropTypes.object.isRequired,
  messages: PropTypes.array.isRequired,
  players: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
  isCurrentPlayer: PropTypes.func.isRequired
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
