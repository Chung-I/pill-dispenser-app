
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import LoginScreen from 'src/component/screen/LoginScreen.component.js';
import UserListScreen from 'src/component/screen/UserListScreen.component.js';
import ChatRoomScreen from 'src/component/screen/ChatRoomScreen.component.js';

const ChatRoomNavigator = StackNavigator({
    Start: { screen: LoginScreen },
    UserList: { screen: UserListScreen },
    ChatRoom: {screen: ChatRoomScreen } 
  });

  const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' +
      'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
      'Shake or press menu button for dev menu',
  });

export default class App extends Component<{}> {
    render() {
      return (
        <ChatRoomNavigator />
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
  });
  