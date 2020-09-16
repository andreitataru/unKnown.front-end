import React, { Component } from 'react';
import {
  StyleSheet, TextInput, View, Alert, Button, Text, TouchableOpacity,
  KeyboardAvoidingView, AsyncStorage, Image, Dimensions, ActivityIndicator, TouchableHighlight
} from 'react-native';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Icon, Card } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

import KeyboardSpacer from 'react-native-keyboard-spacer';
import { GiftedChat } from 'react-native-gifted-chat';

if (Platform.OS === 'android') {
  SafeAreaView.setStatusBarHeight(0);
}

export default class App extends Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    return {
      title: typeof (navigation.state.params) === 'undefined' || typeof (navigation.state.params.name) === 'undefined' ? 'find' : navigation.state.params.name,
      headerStyle: { backgroundColor: '#18e794' },
      headerTitleStyle: { color: 'white' },
      headerTintColor: 'white',
      headerRight:
        <TouchableHighlight onPress={() => params.handleRemove()}>
          <View>
            <Icon
              name='account-circle'
              type='MaterialIcons'
              color='#444242'
              size={40}
            />
          </View>
        </TouchableHighlight>
    }
  }

  constructor(props) {

    super(props)


    state = {
      messages: [],
      isLoading: false,
    }

  }
  render() {

    return (
      <View style={{ flex: 1 }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        {
          this.state.isLoading && (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color="#18ee94" />
            </View>
          )
        }
        {Platform.OS === 'android' ? <KeyboardSpacer /> : null}
      </View>
    );
  }

  componentWillMount() {
    this.setState({
      isLoading: true,
      messages: [
        {
          _id: 1,
          text: 'Say Hello to your Match',
          createdAt: this.props.navigation.state.params.created_at,
          system: true,
        }
      ],
    })
  }
  componentDidMount() {
    this.props.navigation.setParams({ handleRemove: this.removeVehicle });
    this.refreshMessage();
  }

  removeVehicle = () => {
    const { navigate } = this.props.navigation;
    console.log('test');
    console.log(this.state.token);
    navigate('PublicProfile', { id: this.props.navigation.state.params.id, token: this.props.navigation.state.params.token, canLike: false })
  }


  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
    this.SendApi(messages);
  }

  SendApi(message) {
    fetch('http://e1f63cbbbe63.ngrok.io/api/auth/SendMessage', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.navigation.state.params.token
      },
      body: JSON.stringify({
        IdMatch: this.props.navigation.state.params.IdMatch,
        message: message[0].text,
      }),
    }).then((response) => response.json())
      .then((responseJson) => {

      })
      .catch((error) => {
        this.setState({ isLoading: false });
        console.log(error);
      });
  }

  refreshMessage() {
    this.GetApi();

    setTimeout(function () {
      this.refreshMessage();
    }.bind(this), 2000);
  }

  GetApi() {
    fetch('http://e1f63cbbbe63.ngrok.io/api/auth/GetMessages', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.navigation.state.params.token
      },
      body: JSON.stringify({
        IdMatch: this.props.navigation.state.params.IdMatch,
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.length > 0) {
          this.setState({ messages: [] });
          for (let i = 0; i < responseJson.length; i++) {
            let idS;
            if (responseJson[i].idUser == this.props.navigation.state.params.myId) {
              idS = 1;
            }
            else {
              idS = 2;
            }
            let user = { _id: idS, name: 'React Native', avatar: `data:image/jpg;base64,${this.props.navigation.state.params.picture}` };
            let obj = { _id: i, text: responseJson[i].message, createdAt: responseJson[i].created_at, user };
            this.state.messages.push(obj);
          }
          this.setState(({
            messages: GiftedChat.append([], this.state.messages), isLoading: false
          }))
        }
        else {
          this.setState({ isLoading: false });
        }

      })
      .catch((error) => {
        this.setState({ isLoading: false });
        console.log(error);
      });
  }


}

