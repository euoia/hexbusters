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
    return (
      <div className="player">
        {this.props.current ? '> ' : ''}
        {this.props.player.name}
      </div>
    );
  }
});
