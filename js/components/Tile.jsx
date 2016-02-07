import React, { Component, PropTypes } from 'react';
import { getTilePositionById, getTileCoordinatesById } from 'hex-grid';
import GRID from '../constants/Grid.js';
import { COLOUR_RED, COLOUR_BLUE, COLOUR_NEUTRAL, BORDER_LEFT,
  BORDER_TOP, BORDER_TOP_RIGHT, BORDER_RIGHT,
  BORDER_BOTTOM, BORDER_BOTTOM_LEFT, BORDER_TOP_LEFT_BLUE,
  BORDER_TOP_LEFT_RED, BORDER_BOTTOM_RIGHT_RED, BORDER_BOTTOM_RIGHT_BLUE
} from '../constants/Colours.js';

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
      case BORDER_LEFT:
        colourName = 'blue-w';
        zIndex = 1;
        break;
      case BORDER_TOP:
        colourName = 'red-n';
        zIndex = 1;
        break;
      case BORDER_TOP_RIGHT:
        colourName = 'ne';
        zIndex = 1;
        break;
      case BORDER_RIGHT:
        colourName = 'blue-e';
        zIndex = 1;
        break;
      case BORDER_BOTTOM:
        colourName = 'red-s';
        zIndex = 1;
        break;
      case BORDER_BOTTOM_LEFT:
        colourName = 'sw';
        zIndex = 1;
        break;
      case BORDER_TOP_LEFT_BLUE:
        colourName = 'blue-nw';
        zIndex = 1;
        break;
      case BORDER_TOP_LEFT_RED:
        colourName = 'red-nw';
        zIndex = 1;
        break;
      case BORDER_BOTTOM_RIGHT_RED:
        colourName = 'red-se';
        zIndex = 1;
        break;
      case BORDER_BOTTOM_RIGHT_BLUE:
        colourName = 'blue-se';
        zIndex = 1;
        break;
      case null:
        return (
          <div />
        );
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
      'line-height': `${tileHeight}px`, // For the text.
      backgroundImage: `url(./assets/img/hex-${colourName}@3x.png)`,
      backgroundSize: `${tileWidth}px, ${tileHeight}px`,
      'font-size': `${tileHeight / 4}px`,
      'font-family': 'sans-serif',
      zIndex: zIndex,
      backgroundRepeat: 'round'
    };

    const tileCoordinates = getTileCoordinatesById(GRID, tileId);
    return (
      <div
        class='tile'
        onClick={chooseTile.bind(null, tileId)}
        style={style}
      >
        <div>{tileCoordinates.x} {tileCoordinates.y}</div>
      </div>
    );
  }
}

Tile.propTypes = {
  chooseTile: PropTypes.func.isRequired,
  colour: PropTypes.any.isRequired
};

export default Tile;
