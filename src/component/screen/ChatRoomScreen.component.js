import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList
} from "react-native";
import styles from "src/style/main.style.js";
import EmptyDOM from "src/component/EmptyDOM.component.js";
import AppConstants from 'src/constant/AppConstants.constant.js';

if (typeof global.self === "undefined") {
  global.self = global;
}

class ChatRoomScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      me: "",
      you: "",
      content: "",
      messages: []
    };

  }

  componentDidMount = async () => {
    this.socket = this.props.navigation.state.params.SocketConnector;    
    this.socket.on('message', this.onReceivedMessage);
    const naviParams = this.props.navigation.state.params;
    let me = naviParams.me;
    let you = naviParams.you;
    this.setState({
      me,
      you,
    });
    let res = await fetch(`${AppConstants.SERVER_URL}/api/message/${me}/${you}`);
    let messages = await res.json();
    this.setState({
      messages
    })
  };

  static navigationOptions = {
    header: null
  };

  onReceivedMessage = (message) => {
    console.log(message);
    let youSend = message.you === this.state.me && message.me === this.state.you;
    let meSend = message.me === this.state.me && message.you === this.state.you;    
    if (youSend || meSend) {
      let messages = this.state.messages;
      messages.push(message);
      this.setState({
        messages
      });
    }
  }

  onSubmit = () => {
    let content = this.state.content;
    content = content.trim();
    if (content === "")
      return;
    let messages = this.state.messages;
    let now = new Date();
    let message = {
      me: this.state.me,
      you: this.state.you,
      content,
      time: now.getTime() 
    }
    //messages.push(message);
    this.socket.emit('message', message);    
    this.setState({
      content: ""
    });
  }

  _keyExtractor = message => message.time;

  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.header, styles.alignCenter]}>
          <TouchableOpacity
            style={[styles.alignCenter]}
            onPress={() => {this.props.navigation.goBack(null)}}
          >
            <Text>離開</Text>
          </TouchableOpacity>
          <Text style={[styles.headerText]}>{this.state.you}</Text>
        </View>
        <View style={[styles.main]}>
          <FlatList
          data={this.state.messages}
          renderItem={({item}) => (
          <View style={{flexDirection: 'row'}}>
            {this.state.me === item.me ? <View style={{flex: 2}} /> : null}
            <View
              style={this.state.me === item.me ? styles.meText : styles.youText}
              key={item.time}>
              <Text>{item.content}</Text>
            </View>
            {this.state.me === item.me ? null : <View style={{flex: 2}} /> }
          </View>)}
          keyExtractor={this._keyExtractor}
          ref={ref => this.scrollView = ref}
          onContentSizeChange={(contentWidth, contentHeight)=>{        
              this.scrollView.scrollToEnd({animated: true});
          }}
          />
        </View>
        <View style={[styles.footer, styles.alignCenter]}>
          <TextInput
            style={[styles.chatTextInput]}
            placeholder="text message here"
            underlineColorAndroid="transparent"
            onChangeText={content => {
              this.setState({ content });
            }}
            value={this.state.content}
            onSubmitEditing={this.onSubmit}
          />
        </View>
      </View>
    );
  }
}

module.exports = ChatRoomScreen;
