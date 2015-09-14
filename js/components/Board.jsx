import React, { Component, PropTypes } from 'react';
import Tile from './Tile.jsx';
import _ from 'lodash';

export default class Board extends Component {
  constructor (props, context) {
    super(props, context);
  }

  render () {
    const { tileColours, chooseTile } = this.props;

    return (
      <div id="middle">
        <div id="board">
          {_.mapValues(
            tileColours,
            (colour, tileId) =>
              <Tile
                chooseTile={chooseTile}
                colour={colour}
                key={tileId}
                tileId={tileId}
              />
          )}
        </div>
      </div>
    );
  }
}

Board.propTypes = {
  chooseTile: PropTypes.func.isRequired,
  tileColours: PropTypes.object.isRequired
};
