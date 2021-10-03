import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Board from '../components/Board.jsx';
import Players from '../components/Players.jsx';
import { connect } from 'react-redux';
import { isCurrentPlayer } from '../hexbusters/helpers.js';

class Hexbusters extends Component {
  render() {
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
  tiles: PropTypes.object.isRequired,
  chooseTile: PropTypes.func.isRequired,
  isCurrentPlayer: PropTypes.func.isRequired,
  players: PropTypes.array.isRequired,
  winner: PropTypes.number
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
