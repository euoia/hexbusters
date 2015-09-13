import React, { Component, PropTypes } from 'react';
import Message from './Message.jsx';

export default class Messages extends Component {
  render () {
    const { messages } = this.props;

    return (
      <div id="messages">
        {
          messages.map(
            (message, idx) =>
              <Message key={idx} message={message} />
          )
        }
      </div>
    );
  }
}

Messages.propTypes = {
  messages: PropTypes.array.isRequired
};
