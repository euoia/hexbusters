import React, { Component, PropTypes } from 'react';

class Tile extends Component {
  constructor (props, context) {
    super(props, context);
  }

  render () {
    const {tile, chooseTile, getPositionById} = this.props;

    let tilePos = getPositionById(tile.id);

    let colour = tile.colour;
    if (colour === null) {
      colour = 'neutral';
    }

    let style = {
      position: 'absolute',
      left: `${tilePos.x * 63}px`,
      top: `${tilePos.y * 74}px`,
      width: `90px`,
      height: `78px`,
      backgroundImage: `url(./assets/img/hex-${colour}@2x.png)`,
      WebkitClipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
    };

    return (
      <div
        className={tile.owner}
        onClick={chooseTile.bind(null, tile.id)}
        style={style}
      />
    );
  }
}

Tile.propTypes = {
  chooseTile: PropTypes.func.isRequired,
  getPositionById: PropTypes.func.isRequired,
  tile: PropTypes.object.isRequired
};

export default Tile;
