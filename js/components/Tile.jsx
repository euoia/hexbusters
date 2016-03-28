import React, { Component, PropTypes } from 'react';
import { getTilePositionById, getTileCoordinatesById } from 'hex-grid';
import GRID from '../constants/Grid.js';
import { COLOUR_RED, COLOUR_BLUE, COLOUR_NEUTRAL } from '../constants/Colours.js';

const tileWidth = 38;
const tileHeight = 44;

class Tile extends Component {
  constructor (props, context) {
    super(props, context);
  }

  render () {
    const {colour, chooseTile, tileId} = this.props;
    const tilePos = getTilePositionById(GRID, tileId);

    let colourName, zIndex = 2;
    switch (colour) {
      case COLOUR_RED:
        colourName = 'red';
        break;
      case COLOUR_BLUE:
        colourName = 'blue';
        break;
      case COLOUR_NEUTRAL:
        colourName = 'neutral'
        break;
      default:
        throw new Error(`Unhandled colour: ${colour}`);
    }

    // Move across for the border.
    const xPos = tilePos.x + 1.5;
    const yPos = tilePos.y + 1;

    const style = {
      position: 'absolute',
      left: `${xPos * tileWidth}px`,
      top: `${yPos * (tileHeight * 0.75)}px`,
      width: `${tileWidth}px`,
      height: `${tileHeight}px`,
      lineHeight: `${tileHeight}px`, // For the text.
      backgroundImage: `url(/assets/img/hex-${colourName}@3x.png)`,
      backgroundSize: `${tileWidth}px, ${tileHeight}px`,
      fontSize: `${tileHeight / 4}px`,
      fontFamily: 'sans-serif',
      zIndex: zIndex,
      backgroundRepeat: 'round'
    };

    const tileCoordinates = getTileCoordinatesById(GRID, tileId);

    return (
      <div
        className="tile"
        onClick={chooseTile ? chooseTile.bind(null, tileId) : null}
        style={style}
      >
        <div style={{display: "none"}}>{tileId}: {tileCoordinates.x} {tileCoordinates.y}</div>
      </div>
    );
  }
}

Tile.propTypes = {
  colour: PropTypes.number.isRequired,
  tileId: PropTypes.any.isRequired
};

export default Tile;
