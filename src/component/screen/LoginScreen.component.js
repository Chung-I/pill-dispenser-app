import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import styles from 'src/style/main.style.js';
import EmptyDOM from 'src/component/EmptyDOM.component.js';
import UserListScreen from 'src/component/screen/UserListScreen.component.js';
import AppConstants from 'src/constant/AppConstants.constant.js';

if(typeof global.self === "undefined")
{
    global.self = global;
}

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      loginError: false
    };
  }

  static navigationOptions = {
    header: null
  };

  onLogin = async () => {
    let username = this.state.username.trim();
    let password = this.state.password.trim();
    if (username === "" || password === "")
      return;
    const body = {
      username,
      password
    };
    console.log(AppConstants.SERVER_URL);
    let res = await fetch(`${AppConstants.SERVER_URL}/api/auth/login/`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(body)
    });
    console.log("authorizing");
    let resJson = await res.json();
    this.setState({ loginError: !resJson.success });
    if (resJson.success === true) {
      this.props.navigation.navigate("UserList", {
        username: this.state.username,
        password: this.state.password
      });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.header, styles.alignCenter]}>
          <Text style={[styles.headerText]}>Smart Pill Dispenser</Text>
        </View>
        <View style={[styles.main, styles.alignCenter]}>
          <TextInput
            style={[styles.playerTextInput]}
            placeholder="account"
            underlineColorAndroid="transparent"
            onChangeText={username => {
              this.setState({ username });
            }}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={[styles.playerTextInput]}
            placeholder="password"
            underlineColorAndroid="transparent"
            secureTextEntry
            onChangeText={password => {
              this.setState({ password });
            }}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {this.state.loginError ? <Text>Error: wrong password</Text> : null}
        </View>
        <View style={[styles.footer, styles.alignCenter]}>
          <EmptyDOM />
          <TouchableOpacity
            style={[styles.startButton, styles.alignCenter]}
            onPress={this.onLogin}
          >
            <Text style={[styles.startButtonText]}>login</Text>
          </TouchableOpacity>
          <EmptyDOM />
        </View>
      </View>
    );
  }
}

module.exports = LoginScreen;