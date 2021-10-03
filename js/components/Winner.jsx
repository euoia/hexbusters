import React, { Component } from 'react';
import { COLOUR_RED, COLOUR_BLUE } from '../constants/Colours.js';
import PropTypes from 'prop-types';

export default class Board extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { winner } = this.props;
    if (winner === null) {
      return <div />;
    }

    let winningColour = {
      [COLOUR_RED]: 'red',
      [COLOUR_BLUE]: 'blue'
    }[winner];

    if (winningColour === undefined) {
      throw new Error(`Unhandled winning colour: ${winner}`);
    }

    const containerStyle = {
      width: '100%',
      height: '100%',
      position: 'relative'
    };

    const style = {
      zIndex: 1000,
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '228px',
      height: '132px',
      margin: '-62px 0px 0px -124px'
    };

    return (
      <div style={containerStyle}>
        <div>
          <img
            src={require(`/assets/img/${winningColour}-wins@2x.png`)}
            style={style}
          />
        </div>
      </div>
    );
  }
}

Board.propTypes = {
  winner: PropTypes.number.isRequired
};
