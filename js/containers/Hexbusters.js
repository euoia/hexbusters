import React, { Component, PropTypes } from 'react';
import Board from '../components/Board.jsx';
import { connect } from 'react-redux';
import { isCurrentPlayer, getWinner } from '../hexbusters/helpers.js';
import GRID from '../constants/Grid.js';
import { COLOUR_BLUE, COLOUR_RED } from '../../js/constants/Colours.js';

class Hexbusters extends Component {
  render () {
    const {
      tileColours,
      chooseTile,
      getWinner
    } = this.props;

    const winner = getWinner(GRID);
    if (winner === null) {
      console.log(`There is no winner.`);
    } else if (winner === COLOUR_BLUE) {
      console.log(`The winner is blue.`);
    } else if (winner === COLOUR_RED) {
      console.log(`The winner is red.`);
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
