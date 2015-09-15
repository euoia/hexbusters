import React, { Component, PropTypes } from 'react';
import Tile from './Tile.jsx';

export default class Board extends Component {
  constructor (props, context) {
    super(props, context);
  }

  render () {
    const { tileColours, chooseTile } = this.props;

    return (
      <div id="middle">
        <div id="board">
          {
            tileColours.map(
              (colour, tileId) =>
                <Tile
                  chooseTile={chooseTile}
                  colour={colour}
                  key={tileId}
                  tileId={tileId}
                />
            )
          }
        </div>
      </div>
    );
  }
}

Board.propTypes = {
  chooseTile: PropTypes.func.isRequired,
  tileColours: PropTypes.object.isRequired
};
