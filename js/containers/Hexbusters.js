import React, { Component, PropTypes } from 'react';
import Board from '../components/Board.jsx';
import { connect } from 'react-redux';
import { isCurrentPlayer, getWinner } from '../hexbusters/helpers.js';
import GridSettings from '../constants/GridSettings.js';

class Hexbusters extends Component {
  render () {
    const {
      tileColours,
      state,
      chooseTile,
      getWinner
    } = this.props;

    const winner = getWinner(GridSettings);
    if (winner !== null) {
      console.log(`-----------------------`);
      console.log(`The winner is ${winner}`);
    } else {
      console.log(`There is no winner.`);
    }

    return (
      <div>
        <Board  chooseTile={chooseTile} tileColours={tileColours} />
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
    getWinner: getWinner.bind(null, state.game),
    state: state
  };
}

export default connect(mapStateToProps)(Hexbusters);
