import React, { Component, PropTypes } from 'react';
import Board from '../components/Board.jsx';
import Players from '../components/Players.jsx';
import { connect } from 'react-redux';
import { isCurrentPlayer } from '../hexbusters/helpers.js';

class Hexbusters extends Component {
  render () {
    const {
      tileColours,
      chooseTile,
      isCurrentPlayer,
      players
    } = this.props;

    return (
      <div>
        <Board chooseTile={chooseTile} tileColours={tileColours} />
        <Players isCurrentPlayer={isCurrentPlayer} players={players} />
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
    tileColours: state.game.board.get('tileColours'),
    players: state.game.players,
    isCurrentPlayer: isCurrentPlayer.bind(null, state.game),
    state: state
  };
}

export default connect(mapStateToProps)(Hexbusters);
