import Border from './Border.jsx';
import GRID from '../constants/Grid.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Tile from './Tile.jsx';
import Winner from './Winner.jsx';
import hg from 'hex-grid';
import {
  COLOUR_RED,
  COLOUR_BLUE,
  COLOUR_NEUTRAL
} from '../constants/Colours.js';

export default class Board extends Component {
  constructor(props, context) {
    super(props, context);

    this.grid = {
      ...GRID,
      width: GRID.width + 2,
      height: GRID.height + 2
    };

    this.borderGridTileIds = hg.getTileIds(this.grid);
  }

  render() {
    const { tiles, chooseTile, winner } = this.props;

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
        <div id="board" style={boardStyle}>
          <Winner winner={winner} />
          {tiles.neutral.toArray().map((tileId) => (
            <Tile
              chooseTile={chooseTile}
              colour={COLOUR_NEUTRAL}
              key={tileId}
              tileId={tileId}
            />
          ))}
          {tiles.red.toArray().map((tileId) => (
            <Tile colour={COLOUR_RED} key={tileId} tileId={tileId} />
          ))}
          {tiles.blue.toArray().map((tileId) => (
            <Tile colour={COLOUR_BLUE} key={tileId} tileId={tileId} />
          ))}
          {borderGridTileIds.map((tileId) => (
            <Border grid={this.grid} key={`b` + tileId} tileId={tileId} />
          ))}
        </div>
      </div>
    );
  }
}

Board.propTypes = {
  chooseTile: PropTypes.func,
  tiles: PropTypes.object.isRequired,
  winner: PropTypes.number
};
