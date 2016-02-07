import React, { Component, PropTypes } from 'react';
import Player from './Player.jsx';
import GRID from '../constants/Grid.js';

export default class Players extends Component {
  render () {
    const { players, isCurrentPlayer } = this.props;
    const style = {
      position: 'absolute',
      left: (38 * 1.5 * (GRID.width + 2)),
      top: '10px'
    };

    return (
      <div id="players" style={style}>{
        players.map(
          (player, idx) =>
            <Player
              current={isCurrentPlayer(player)}
              key={idx}
              player={player}
            />
        )
      }</div>
    );
  }
}

Players.propTypes = {
  isCurrentPlayer: PropTypes.func.isRequired,
  players: PropTypes.array.isRequired
};
