import React, { Component, PropTypes } from 'react';
import Board from '../components/Board.jsx';
import Messages from '../components/Messages.jsx';
import Players from '../components/Players.jsx';
import { connect } from 'react-redux';
import hb from '../hexbusters/hb.js';

class Hexbusters extends Component {
  render () {
    const {
      tileColours,
      chooseTile,
      getWinner,
      isCurrentPlayer,
      messages,
      players
    } = this.props;

    console.log('getWinner', getWinner());

    return (
      <div>
        <Players isCurrentPlayer={isCurrentPlayer} players={players} />
        <Board  chooseTile={chooseTile} tileColours={tileColours} />
        <Messages messages={messages} />
      </div>
    );
  }
}

Hexbusters.propTypes = {
  chooseTile: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  isCurrentPlayer: PropTypes.func.isRequired,
  messages: PropTypes.array.isRequired,
  players: PropTypes.array.isRequired,
  tileColours: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    messages: state.game.messages,
    tileColours: state.game.tileColours,
    players: state.game.players,
    isCurrentPlayer: hb(state.game).isCurrentPlayer,
    getWinner: hb(state.game).getWinner
  };
}

export default connect(mapStateToProps)(Hexbusters);
