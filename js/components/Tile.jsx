import React, { Component, PropTypes } from 'react';
import HexGrid from 'hex-grid.js';
import GridSettings from '../constants/GridSettings.js';

class Tile extends Component {
  constructor (props, context) {
    super(props, context);
  }

  render () {
    const {colour, chooseTile, tileId} = this.props;

    let tilePos = HexGrid.getTilePositionById(GridSettings, tileId);

    const colourName = (colour === null) ? 'neutral' : colour;

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
  colour: PropTypes.string
};

export default Tile;
