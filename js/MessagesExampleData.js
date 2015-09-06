import MessageActions from './actions/MessageActions.js';
module.exports = class MessagesExampleData {
  static init () {
    MessageActions.addMessage('bob', 'hello world');
  }
}
