import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { getTilePositionById, getTileCoordinatesById } from 'hex-grid';
import {
  BORDER_LEFT,
  BORDER_TOP,
  BORDER_TOP_RIGHT,
  BORDER_RIGHT,
  BORDER_BOTTOM,
  BORDER_BOTTOM_LEFT,
  BORDER_TOP_LEFT_BLUE,
  BORDER_TOP_LEFT_RED,
  BORDER_BOTTOM_RIGHT_RED,
  BORDER_BOTTOM_RIGHT_BLUE
} from '../constants/Colours.js';

const tileWidth = 38;
const tileHeight = 44;

class Border extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { tileId, grid } = this.props;
    const tilePos = getTilePositionById(grid, tileId);

    let colourName;
    const colour = getBorderColour(grid, tileId);
    switch (colour) {
      case BORDER_LEFT:
        colourName = 'blue-w';
        break;
      case BORDER_TOP:
        colourName = 'red-n';
        break;
      case BORDER_TOP_RIGHT:
        colourName = 'ne';
        break;
      case BORDER_RIGHT:
        colourName = 'blue-e';
        break;
      case BORDER_BOTTOM:
        colourName = 'red-s';
        break;
      case BORDER_BOTTOM_LEFT:
        colourName = 'sw';
        break;
      case BORDER_TOP_LEFT_BLUE:
        colourName = 'blue-nw';
        break;
      case BORDER_TOP_LEFT_RED:
        colourName = 'red-nw';
        break;
      case BORDER_BOTTOM_RIGHT_RED:
        colourName = 'red-se';
        break;
      case BORDER_BOTTOM_RIGHT_BLUE:
        colourName = 'blue-se';
        break;
      case null:
      default:
        return <div />;
    }

    const colourHex = require(`/assets/img/hex-${colourName}@3x.png`);

    const style = {
      position: 'absolute',
      left: `${tilePos.x * tileWidth}px`,
      top: `${tilePos.y * (tileHeight * 0.75)}px`,
      width: `${tileWidth}px`,
      height: `${tileHeight}px`,
      backgroundImage: `url(${colourHex})`,
      backgroundSize: `${tileWidth}px, ${tileHeight}px`,
      backgroundRepeat: 'round'
    };

    return <div className="tile" style={style}></div>;
  }
}

function getBorderColour(grid, tileId) {
  const { x, y } = getTileCoordinatesById(grid, tileId);

  let leftBorder = false,
    topBorder = false,
    rightBorder = false,
    bottomBorder = false;

  if (y === 0) {
    topBorder = true;
  }

  if (y === grid.height - 1) {
    bottomBorder = true;
  }

  if (x === 0) {
    leftBorder = true;
  }

  if (x === grid.width - 1) {
    rightBorder = true;
  }

  if (leftBorder && topBorder) {
    return null;
  }

  if (bottomBorder && rightBorder) {
    return null;
  }

  if (leftBorder && y === 1) {
    return BORDER_TOP_LEFT_BLUE;
  }

  if (topBorder && x === 1) {
    return BORDER_TOP_LEFT_RED;
  }

  if (leftBorder && bottomBorder) {
    return BORDER_BOTTOM_LEFT;
  }

  if (bottomBorder && x === grid.width - 2) {
    return BORDER_BOTTOM_RIGHT_RED;
  }

  if (rightBorder && y === grid.height - 2) {
    return BORDER_BOTTOM_RIGHT_BLUE;
  }

  if (topBorder && rightBorder) {
    return BORDER_TOP_RIGHT;
  }

  if (topBorder) {
    return BORDER_TOP;
  }

  if (rightBorder) {
    return BORDER_RIGHT;
  }

  if (bottomBorder) {
    return BORDER_BOTTOM;
  }

  if (leftBorder) {
    return BORDER_LEFT;
  }

  return null;
}

Border.propTypes = {
  grid: PropTypes.object.isRequired,
  tileId: PropTypes.any.isRequired
};

export default Border;
