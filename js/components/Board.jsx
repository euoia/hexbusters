import Border from './Border.jsx';
import GRID from '../constants/Grid.js';
import React, { Component, PropTypes } from 'react';
import Tile from './Tile.jsx';
import hg from 'hex-grid';

export default class Board extends Component {
  constructor (props, context) {
    super(props, context);

    this.grid = {
      ...GRID,
      width: GRID.width + 2,
      height: GRID.height + 2
    };

    this.borderGridTileIds = hg.getTileIds(this.grid);
  }

  render () {
    const { tileColours, chooseTile } = this.props;
    const borderGridTileIds = this.borderGridTileIds;

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

          {
            borderGridTileIds.map(
              tileId =>
                <Border
                  grid={this.grid}
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
