import React, { Component, PropTypes } from 'react';
import HexGrid from 'hex-grid.js';
import GridSettings from '../constants/GridSettings.js';
import { COLOUR_RED, COLOUR_BLUE, COLOUR_NEUTRAL } from '../constants/Colours.js';

class Tile extends Component {
  constructor (props, context) {
    super(props, context);
  }

  render () {
    const {colour, chooseTile, tileId} = this.props;

    const tilePos = HexGrid.getTilePositionById(GridSettings, tileId);

    let colourName;
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

    let style = {
      position: 'absolute',
      left: `${tilePos.x * 63}px`,
      top: `${tilePos.y * 74}px`,
      width: `90px`,
      height: `78px`,
      backgroundImage: `url(./assets/img/hex-${colourName}@2x.png)`,
      WebkitClipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
    };


    return (
      <div
        onClick={chooseTile.bind(null, tileId)}
        style={style}
      >
        {tilePos.x} {tilePos.y}
      </div>
    );
  }
}

Tile.propTypes = {
  chooseTile: PropTypes.func.isRequired,
  colour: PropTypes.any.isRequired
};

export default Tile;
