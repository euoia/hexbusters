import Border from './Border.jsx';
import GRID from '../constants/Grid.js';
import React, { Component, PropTypes } from 'react';
import Tile from './Tile.jsx';
import Winner from './Winner.jsx';
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
    const { tileColours, chooseTile, winner } = this.props;

    const borderGridTileIds = this.borderGridTileIds;
    const boardStyle = {
      width: `${this.grid.width * 38 * 1.5}px`,
      height: `${this.grid.height * 44 * 0.75}px`,
      position: 'absolute',
      top: 0,
      left: 0
    };

    return (
      <div id="middle">

        <div id="board" style={boardStyle} >
          <Winner winner={winner} />
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
  tileColours: PropTypes.object.isRequired,
  winner: PropTypes.string.isRequired
};
