import SocketIOClient from 'socket.io-client';
//import AppConstants from 'src/constant/AppConstants.constant.js';
class SocketConnector {
  constructor() {
    this.socket = null;
  }

  static startConnection = () => {
    this.socket = SocketIOClient('http://localhost:3000');
  }

  static stopConnection = () => {
    if (this.socket !== null) {
      this.socket.disconnect();
    }
  }

  static giveUserID = () => {
    this.socket.emit('GIVE_USER_ID', {});
  }

  static emit = (eventType, params) => {
    this.socket.emit(eventType, params);
  }
  static on = (eventType, callback) => {
    this.socket.on(eventType, callback);
  }
}

module.exports = SocketConnector;