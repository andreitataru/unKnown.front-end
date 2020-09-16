import React, { Component } from 'react';
import { StyleSheet, TextInput, View, Alert, Button, Text, TouchableOpacity, KeyboardAvoidingView, AsyncStorage, Image, Dimensions, ActivityIndicator } from 'react-native';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { Icon } from 'react-native-elements';

if (Platform.OS === 'android') {
  SafeAreaView.setStatusBarHeight(0);
}

export default class App extends Component {
  static navigationOptions = {
    title: 'Change Email',
    headerStyle: { backgroundColor: '#18e794' },
    headerTitleStyle: { color: 'white' },
    headerTintColor: 'white'
  }
  constructor(props) {

    super(props)

    this.state = {
      isLoading: false,
      email: '',
      token: '',
      canShow: false,
      code: '',
    }

  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="position"
      >
        <View style={styles.loginContainer}>
          <Image
            source={{ uri: 'https://i.imgur.com/LeYnpAr.png' }}
            style={styles.welcomeImage}
          />
        </View>
        <View style={styles.loginStuff}>
          <Icon
            name='email'
            type='MaterialIcons'
            color='#444242'
            size={20}
            marginLeft='8%'
          />
          <Text style={styles.textLogin}>New Email</Text>
        </View>
        <TextInput
          placeholder="Enter your new Email"
          onChangeText={email => this.setState({ email })}
          underlineColorAndroid='transparent'
          keyboardType="email-address"
          autoCapitalize="none"
          ref={input => { this.textInput = input }}
          autoCorrect={false}
          editable={!this.state.canShow}
          style={styles.TextInputStyleClass}
        />
        {this.state.canShow && (
          <View>
            <View style={styles.loginStuff}>
              <Icon
                name='vpn-key'
                type='MaterialIcons'
                color='#444242'
                size={20}
                marginLeft='8%'
              />
              <Text style={styles.textLogin}>Confirmation Code:</Text>
            </View>
            <TextInput
              placeholder="Enter your confirmation Code"
              onChangeText={code => this.setState({ code })}
              underlineColorAndroid='transparent'
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.TextInputStyleClass}
              marginBottom='2%'
            />
          </View>
        )}
        <View style={styles.Button}>
          <TouchableOpacity onPress={this.EmailValid.bind(this)}>
            <View style={styles.touchableLogin}>
              <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: '8%', fontSize: 18 }}>
                Change Email
                </Text>
              <Icon
                name='mail-outline'
                type='MaterialIcons'
                color='#444242'
                size={26}
                marginLeft='8%'
              />
            </View>
          </TouchableOpacity>
        </View>
        {this.state.isLoading && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#18ee94" />
          </View>
        )}
      </KeyboardAvoidingView>

    );
  }

  componentWillMount() {
    this.setState({ canShow: false });
    this.getToken('token');
  }

  async getToken(key) {
    try {

      const value = await AsyncStorage.getItem('@MySuperStore:' + key);
      this.setState({ token: value });
      console.log(this.state.token);

    } catch (error) {
      console.log("Error retrieving data" + error);
    }
  }

  EmailValid() {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (this.state.canShow) {
      this.ServerEmailChange();
    }
    else {
      if ((reg.test(this.state.email) === true)) {
        this.SendCode();
      }
      else {
        Alert.alert(
          'Success',
          'Email not Valid',
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ],
          { cancelable: false }
        )
      }
    }

  }
  

  SendCode = () => {
    this.setState({ isLoading: true });
    fetch('http://e1f63cbbbe63.ngrok.io/api/auth/sendCode', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.state.token
      },
      body: JSON.stringify({
        email: this.state.email,
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.Success == 'CodeOk') {
          this.setState({ canShow: true });
          Alert.alert(
            'Email Confirmation',
            'A Code was sent to your email: ' + this.state.email,
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false }
          )
        }
        else {
          Alert.alert(
            'Error',
            'Email already exists',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false }
          )
        }
        this.setState({ isLoading: false });
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        console.log(error);
      });
  }

  ServerEmailChange = () => {
    this.setState({ isLoading: true });
    fetch('http://e1f63cbbbe63.ngrok.io/api/auth/changeEmail', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.state.token
      },
      body: JSON.stringify({
        email: this.state.email,
        code: this.state.code
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.Success == 'Email changed') {
          Alert.alert(
            'Success',
            'Email changed successfully',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false }
          )
          this.setState({ email: '', code: '', canShow: false });
          this.textInput.clear();
        }
        else {
          Alert.alert(
            'Error',
            'Code not valid',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false }
          )
        }

        this.setState({ isLoading: false });
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        console.log(error);
      });
  }

}