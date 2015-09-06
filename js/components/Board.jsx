import React from 'react';
import Tile from './Tile.jsx';
import _ from 'lodash';

let ReactPropTypes = React.PropTypes;

module.exports = React.createClass({
  propTypes: {
    board: ReactPropTypes.object.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    let tiles = _.map(
      this.props.board.tiles,
      tile => <Tile tile={tile} />
    );

    return (
      <section id="board">
        <div id="hex-board">{tiles}</div>
      </section>
    );
  }
});
