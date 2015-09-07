import React, { Component, PropTypes } from 'react';
import Tile from './Tile.jsx';

let ReactPropTypes = React.PropTypes;

class Board extends Component {
  constructor (props, context) {
    super(props, context);
  }

  render () {
    const { board, actions } = this.props;

    return (
      <div id="middle">
        <div id="board">
          {board.tiles.map(
            tile => <Tile
              key={tile.id}
              tile={tile}
              getPositionById={board.getPositionById.bind(board)}
              {...actions} />
          )}
        </div>
      </div>
    );
  }
}

Board.propTypes = {
  board: ReactPropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

export default Board;
