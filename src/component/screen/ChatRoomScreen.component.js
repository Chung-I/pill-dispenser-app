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
import ChatBot from 'src/utility/ChatBot.js';

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
    this.socket.on('message', this.onReceiveMessage);
    this.socket.on('recognization', this.onReceiveRecogResult);
    this.socket.on('delivery', this.onReceiveRecogResult);
    const naviParams = this.props.navigation.state.params;
    let me = naviParams.me;
    let you = naviParams.you;
    this.setState({
      me,
      you,
    });
    console.log(me);
    let res = await fetch(`${AppConstants.SERVER_URL}/api/user/${me}`);
    let user = await res.json();
    console.log(user.prescription);
    let content = "";
    content += "you can register your face through the following command: \n";
    content += "\'/register\'\n";
    content += "you can set your prescription through the following command: \n";
    content += "to set the time and amount drugs should be taken, type: \n";
    content += "\'/setdrug [drug name], [taken time], [amount]\'\n";
    content += "to remove certain prescription, type: \n";
    content += "\'/deldrug [drug name], [taken time]\'";
    if (user.prescription.length > 0) {    
      content += "prescription: \n";
      content += user.prescription.map(instruction => {
        const drug = instruction["drug"];
        const time = instruction["time"];
        const hour = new Date(time).getHours();
        const amount = instruction["amount"];
        return [drug, hour, amount].join(" ");
      }).join("\n");
    }
    this.sendMessage(content, this.state.you, this.state.me);
    res = await fetch(`${AppConstants.SERVER_URL}/api/drugs`);
    let drugs = await res.json();
    drugs = drugs.map(drug => drug["drugname"]);
    this.chatbot = new ChatBot(drugs);
    for (let instruction in user.prescription) {
      const key = [instruction["drug"], instruction["time"]].join(",");
      this.chatbot.instructions[key] = instruction["amount"];
    }
  };

  static navigationOptions = {
    header: null
  };

  onReceiveMessage = (message) => {
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

  onReceiveRecogResult = (result) => {
    let content = '';
    if (result === 'success') {
      content = 'recognition success! sendind drug delivery signals to arduino ...';
    } else {
      content = 'recognition failed! please try again ...';
    }
    this.sendMessage(content, this.state.you, this.state.me);    
  }

  onReceiveDeliveryResult = (result) => {
    let content = '';
    if (result === 'success') {
      content = 'delivery success! delivering drugs ...';
    } else {
      content = 'failed to connect to arduino! please try again ...';
    }
    this.sendMessage(content, this.state.you, this.state.me);    
  }

  sendMessage = (content, me, you) => {
    let now = new Date();
    let message = {
      me,
      you,
      content,
      time: now.getTime() 
    }
    this.socket.emit('message', message);
    return message;
  } 
  sendPrescription = (prescription) => {
    let user = {
      "username": this.state.me,
      prescription
    }
    this.socket.emit('putUser', user);
  }

  register = () => {
    const deviceId = this.state.you;
    const username = this.state.me;
    const info = {
      deviceId,
      username
    }
    this.socket.emit('register', info);    
  }

  onSubmit = () => {
    let content = this.state.content;
    content = content.trim();
    if (content === "")
      return;
    const message = this.sendMessage(content, this.state.me, this.state.you);    
    this.setState({
      content: ""
    });
    this.chatBotReply(message);
  }

  chatBotReply = (message) => {
    const reply = this.chatbot.reply(message.content);
    this.sendMessage(reply["message"], this.state.you, this.state.me);
    const doDrug = () => {
      const prescription = this.chatbot.getPrescription();
      console.log(prescription);
      this.sendPrescription(prescription);
    };
    switch (reply["action"]) {
      case "setDrug":
        doDrug();
        break;
      case "delDrug":
        doDrug();
        break;
      case "register":
        this.register();
        break;
    }
   
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
            {this.state.me === item.me ? <View style={{flex: 1}} /> : null}
            <View
              style={this.state.me === item.me ? styles.meText : styles.youText}
              key={item.time}>
              <Text>{item.content}</Text>
            </View>
            {this.state.me === item.me ? null : <View style={{flex: 1}} /> }
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
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>
    );
  }
}

module.exports = ChatRoomScreen;
