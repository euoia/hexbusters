import React, { Component, PropTypes } from 'react';
import { COLOUR_RED, COLOUR_BLUE }  from '../constants/Colours.js';

export default class Player extends Component {
  render () {
    const {current, player} = this.props;

    const playerColour = {
      [COLOUR_RED]: '#E95A26',
      [COLOUR_BLUE]: '#084595'
    }[player.colour];

    const style = {
      color: playerColour,
      fontSize: '30px',
      fontWeight: 600,
      textAlign: 'left',
    };

    if (current) {
      return (
        <div className="player" style={style}>{player.name}'s turn</div>
      );
    } else {
      return (
        <div className="player" style={style}>{player.name}</div>
      );
    }
  }
}

Player.propTypes = {
  player: PropTypes.object.isRequired
};
