import React from 'react';
import Player from './Player.jsx';
import _ from 'lodash';

let ReactPropTypes = React.PropTypes;

module.exports = React.createClass({

  propTypes: {
    players: ReactPropTypes.array.isRequired,
    isCurrentPlayer: ReactPropTypes.func.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    let players = _.map(
      this.props.players,
      (player, idx) =>
        <Player
          current={this.props.isCurrentPlayer(player)}
          key={idx}
          player={player}
        />
    );

    return (
      <div id="players">{players}</div>
    );
  }
});
