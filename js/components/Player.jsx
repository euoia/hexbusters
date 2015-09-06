import React from 'react';
let ReactPropTypes = React.PropTypes;

module.exports = React.createClass({

  propTypes: {
   player: ReactPropTypes.object.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    let player = this.props.player;

    return (
      <div className="player">
        {player.name}
      </div>
    );
  }
});
