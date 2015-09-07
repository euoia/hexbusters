//import GameActions from '../actions/GameActions.js';
//import MessageActions from '../actions/MessageActions.js';

//class MessageStore {
  //constructor () {
    //this.bindListeners({
      //onPlayersJoin: GameActions.playersJoin,
      //onAddMessage: MessageActions.addMessage
    //});

    //this.messages = [];

    //this.exportPublicMethods({
      //getAll: this.getAll
    //});
  //}

  /**
   * Get the entire collection of players.
   * @return {object}
   */
  //getAll () {
    //return this.getState().messages;
  //}

  //onPlayersJoin (action) {
    //action.players.forEach(
      //player => {
        //this.messages.push(
          //`${player.name} joins as ${player.colour}.`
        //);
      //}
    //);
  //}

  //onAddMessage (action) {
    //this.messages.push(
      //`${action.playerName}: ${action.message}`
    //);
  //}
//}
