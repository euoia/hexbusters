import React, { Component, PropTypes } from 'react';
import Board from '../components/Board.jsx';
import Players from '../components/Players.jsx';
import { connect } from 'react-redux';
import { isCurrentPlayer } from '../hexbusters/helpers.js';

class Hexbusters extends Component {
  render () {
    const { tiles, chooseTile, isCurrentPlayer, players, winner } = this.props;

    return (
      <div>
        <Board chooseTile={chooseTile} tiles={tiles} winner={winner} />
        <Players isCurrentPlayer={isCurrentPlayer} players={players} />
      </div>
    );
  }
}

Hexbusters.propTypes = {
  chooseTile: PropTypes.func.isRequired,
  isCurrentPlayer: PropTypes.func.isRequired,
  players: PropTypes.array.isRequired,
  tiles: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    isCurrentPlayer: isCurrentPlayer.bind(null, state.game),
    players: state.game.players,
    tiles: state.game.tiles,
    winner: state.game.winner
  };
}

export default connect(mapStateToProps)(Hexbusters);
