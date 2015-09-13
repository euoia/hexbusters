import React, { Component, PropTypes } from 'react';
import Player from './Player.jsx';

export default class Players extends Component {
  render () {
    const { players } = this.props;

    return (
      <div id="players">{
        players.map(
          (player, idx) =>
            <Player
              current={this.props.isCurrentPlayer(player)}
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
