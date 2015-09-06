import React from 'react';
let ReactPropTypes = React.PropTypes;

module.exports = React.createClass({

  propTypes: {
   tile: ReactPropTypes.object.isRequired
  },

  getInitialState: function() {
    return {};
  },

  /**
   * @return {object}
   */
  render: function() {
    let tile = this.props.tile;

    return (
      <div
        className={tile.owner}
        key={tile.id}
      />
    );
  }
});
