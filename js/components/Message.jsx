import React from 'react';
let ReactPropTypes = React.PropTypes;

module.exports = React.createClass({

  propTypes: {
   message: ReactPropTypes.string.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    return (
      <div>{this.props.message}</div>
    );
  }
});
