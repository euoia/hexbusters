import { HUMAN_PLAYER } from '../constants/PlayerTypes.js';
import BasePlayer from './BasePlayer.js';

export default class HumanPlayer extends BasePlayer {
  constructor(options) {
    super(options);
    this.playerType = HUMAN_PLAYER;
  }
}
