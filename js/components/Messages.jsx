import React from 'react';
import Message from './Message.jsx';
import _ from 'lodash';

let ReactPropTypes = React.PropTypes;

module.exports = React.createClass({
  propTypes: {
    messages: ReactPropTypes.array.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    let messages = _.map(
      this.props.messages,
      (message, idx) => <Message key={idx} message={message} />
    );

    return (
      <div id="messages">
        {messages}
      </div>
    );
  }
});
