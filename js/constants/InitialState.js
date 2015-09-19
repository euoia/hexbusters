import { COLOUR_NEUTRAL } from '../constants/Colours.js';
import Immutable from 'immutable';
import _ from 'lodash';
import HexGrid from 'hex-grid.js';
import GridSettings from '../constants/GridSettings.js';

export default {
  players: [],
  numPlayers: 2,
  messages: [],
  board: Immutable.fromJS({
    currentPlayerIdx: 0,
    tileColours: _.chain(HexGrid.getTileIds(GridSettings))
      .indexBy()
      .mapValues(() => COLOUR_NEUTRAL)
      .value()
  })
}