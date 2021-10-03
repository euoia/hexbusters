import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { COLOUR_RED, COLOUR_BLUE } from '../constants/Colours.js';

export default class Player extends Component {
  render() {
    const { current, player } = this.props;

    if (current === false) {
      return <span />;
    }

    const colour = {
      [COLOUR_RED]: current ? 'red' : 'grey',
      [COLOUR_BLUE]: current ? 'blue' : 'grey'
    }[player.colour];

    const style = {
      position: 'absolute',
      right: `-100px`,
      width: '256px',
      height: '75px'
    };

    if (player.name === 'Hexbot') {
      return (
        <img
          src={require(`../../assets/img/${colour}-hexbots-turn@3x.png`)}
          style={style}
        />
      );
    } else {
      return (
        <img
          src={require(`../../assets/img/${colour}-players-turn@3x.png`)}
          style={style}
        />
      );
    }
  }
}

Player.propTypes = {
  current: PropTypes.boolean.isRequired,
  player: PropTypes.object.isRequired
};
