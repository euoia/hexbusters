import React, { Component, PropTypes } from 'react';

export default class Player extends Component {
  render () {
    return (
      <div className="player">
        {this.props.current ? '> ' : ''}
        {this.props.player.name}
      </div>
    );
  }
}

Player.propTypes = {
  player: PropTypes.object.isRequired
};
