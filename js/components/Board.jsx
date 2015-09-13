import React, { Component, PropTypes } from 'react';
import Tile from './Tile.jsx';

export default class Board extends Component {
  constructor (props, context) {
    super(props, context);
  }

  render () {
    const { board, chooseTile } = this.props;

    return (
      <div id="middle">
        <div id="board">
          {board.tiles.map(
            tile =>
              <Tile
                chooseTile={chooseTile}
                getPositionById={board.getPositionById.bind(board)}
                key={tile.id}
                tile={tile}
              />
          )}
        </div>
      </div>
    );
  }
}

Board.propTypes = {
  board: PropTypes.object.isRequired,
  chooseTile: PropTypes.func.isRequired
};
