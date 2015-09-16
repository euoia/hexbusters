import { COLOUR_NEUTRAL } from '../constants/Colours.js';
import Immutable from 'immutable';
import _ from 'lodash';
import HexGrid from 'hex-grid.js';
import GridSettings from '../constants/GridSettings.js';

export default {
  players: [],
  currentPlayerIdx: 0,
  messages: [],
  tileColours: Immutable.Map(
    _.chain(HexGrid.getTileIds(GridSettings))
    .indexBy()
    .mapValues(() => COLOUR_NEUTRAL)
    .value()
  )
}
