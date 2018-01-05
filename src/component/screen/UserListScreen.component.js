import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, Button, FlatList } from 'react-native';
import styles from 'src/style/main.style.js';
import io from 'socket.io-client';
import SocketConnector from 'src/utility/SocketConnector.js';

class UserListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      usernames: [
      ]
    };
    SocketConnector.startConnection();
    SocketConnector.on('connect', this.onChangeStatus(true));
    SocketConnector.on('disconnect', this.onChangeStatus(false));
    
  }
  componentDidMount = async () => {
    const naviParams = this.props.navigation.state.params;
    SocketConnector.emit('connect', naviParams.username);
    let res = await fetch("http://localhost:3000/api/users");
    let resJson = await res.json();
    this.setState({
        usernames: resJson,
        username: naviParams.username
    });
  }
  onEnterChatRoom = (item) => {
    this.props.navigation.navigate("ChatRoom", {
      me: this.state.username,
      you: item.name,
      SocketConnector
    });   
  }

  onChangeStatus = (status) => {
    let func = username => {
      let usernames = this.state.usernames;
      for (let i = 0; i < usernames.length; ++i) {
        if (usernames[i].username == username) {
          usernames[i].connected = status;
        }
      }
      this.setState({
        usernames
      })
    }
    return func;
  }

  onLogout = async () => {
    SocketConnector.emit('disconnect', naviParams.username);    
    const body = this.state;    
    let res = await fetch("http://localhost:3000/api/auth/logout/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(body)
    });
    let resJson = await res.json();
    console.log(resJson);
    this.props.navigation.goBack(null);
    SocketConnector.stopConnection();
  }

  static navigationOptions = {
    header: null
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.header, styles.alignCenter]}>
          <TouchableOpacity
            style={[styles.alignCenter]}
            onPress={this.onLogout}
          >
            <Text>登出</Text>
          </TouchableOpacity>
          <Text style={[styles.headerText]}>Welcome, {this.state.username}!</Text>
        </View>
        <View style={[styles.main, styles.alignCenter]}>
          <FlatList
            data={this.state.usernames.filter(user => user.username != this.state.username)
              .map((user, i) => {
                const item = {
                  "name": user.username,
                  "connected": user.connected,
                  "key": i};
                return item;})}
            renderItem={({item}) => (
            <TouchableOpacity
              style={[styles.button]}
              title={item.name}
              onPress={() => {this.onEnterChatRoom(item)}}
            >
              <Text >{item.name}</Text>
              <Text>{item.connected ? "online" : "offline"}</Text>
            </TouchableOpacity>
          )}
          />
        </View>
        <View style={[styles.footer, styles.alignCenter]}>
        </View>
      </View>
    );
  }
}

module.exports = UserListScreen;
