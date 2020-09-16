import React, { Component } from 'react';
import { StyleSheet, TextInput, View, Alert, Button, Text, TouchableOpacity, AsyncStorage, KeyboardAvoidingView, Image, Dimensions, ActivityIndicator } from 'react-native';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Card, Icon } from 'react-native-elements';


  SafeAreaView.setStatusBarHeight(0);


export default class App extends Component {
  static navigationOptions = {
    title: 'Log In',
    headerStyle: { backgroundColor: '#18e794' },
    headerTitleStyle: { color: 'white' },
    headerTintColor: 'white'
  }
  constructor(props) {

    super(props)

    this.state = {

      email: '',
      password: '',
      token: '',
      isLoading: false,
      emailToken: false,
      status: true,
      tokenInput: '',

    }
    console.log('test');
    const deviceHeight = Dimensions.get('window').height;
    console.log(deviceHeight);

  }


  render() {

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="position"
      >
        {this.state.emailToken && (
          <View>
            <View style={styles.loginStuff}>
              <Icon
                name='vpn-key'
                type='MaterialIcons'
                color='#444242'
                size={20}
                marginLeft='8%'
              />
              <Text style={styles.token1}>Confirmation Code:</Text>
            </View>
            <TextInput
              placeholder="Enter your confirmation Code"
              onChangeText={tokenInput => this.setState({ tokenInput })}
              underlineColorAndroid='transparent'
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.TextInputStyleClass}
              marginBottom='2%'
            />
            <View style={styles.Button}>
              <TouchableOpacity onPress={this.ComfirmEmail}>
                <View style={styles.touchableLogin}>
                  <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: '8%', fontSize: 18 }}>
                    Confirm Email
                    </Text>
                  <Icon
                    name='contact-mail'
                    type='MaterialIcons'
                    color='#444242'
                    size={26}
                    marginLeft='8%'
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {this.state.status && (
          <View>
            <View style={styles.loginContainer}>
              <Image
                source={{ uri: 'https://i.imgur.com/LeYnpAr.png' }}
                style={styles.welcomeImage}
              />
            </View>
            <View style={styles.loginStuff}>
              <Icon
                name='mail'
                type='MaterialIcons'
                color='#444242'
                size={20}
                marginLeft='8%'
              />
              <Text style={styles.textLogin}>E-mail:</Text>
            </View>
            <TextInput
              placeholder="Enter your Email"
              onChangeText={email => this.setState({ email })}
              underlineColorAndroid='transparent'
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.TextInputStyleClass}
            />
            <View style={styles.loginStuff}>
              <Icon
                name='vpn-key'
                type='MaterialIcons'
                color='#444242'
                size={20}
                marginLeft='8%'
              />
              <Text style={styles.textLogin}>Password:</Text>
            </View>
            <TextInput
              placeholder="Enter your Password"
              onChangeText={password => this.setState({ password })}
              underlineColorAndroid='transparent'
              style={styles.TextInputStyleClass}
              secureTextEntry={true}
              marginBottom='4%'
            />
            <View style={styles.Button}>
              <TouchableOpacity onPress={this.Login}>
                <View style={styles.touchableLogin}>
                  <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: '8%', fontSize: 18 }}>
                    Log In
                </Text>
                  <Icon
                    name='input'
                    type='MaterialIcons'
                    color='#444242'
                    size={26}
                    marginLeft='8%'
                  />
                </View>
              </TouchableOpacity>
            </View>
            <Text
              onPress={this.ForgotPassword.bind(this)}
              style={styles.Forgot}
            >
              Forgot your password?
            </Text>
          </View>
        )}
        {this.state.isLoading && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#18ee94" />
          </View>
        )}
      </KeyboardAvoidingView>
    );
  }

  ForgotPassword() {
    const { navigate } = this.props.navigation;
    navigate('Forgot')
  }

  Login = () => {
    const { navigate } = this.props.navigation;
    this.setState({ isLoading: true });

    fetch('http://e1f63cbbbe63.ngrok.io/api/auth/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == 'ok') {

          this.setState({ token: responseJson.token, isLoading: false });

          if (responseJson.verified == 0) {
            this.setState({ status: false, emailToken: true, isLoading: false });
          }
          else {
            switch (responseJson.AccStep) {
              case 1: {
                navigate('NameRegister', { token: this.state.token })
                break;
              }
              case 2: {
                navigate('DateBirth', { token: this.state.token })
                break;
              }
              case 3: {
                navigate('Gender', { token: this.state.token })
                break;
              }
              case 4: {
                navigate('Image', { token: this.state.token })
                break;
              }
              case 5: {
                this.saveToken(this.state.token);
                this.props.navigation.state.params.refresh();
                this.props.navigation.goBack();
                break;
              }
            }
          }
        }
        else {
          Alert.alert(
            'Error',
            'Email or Password are invalid',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false }
          )
          this.setState({ isLoading: false });
        }

      })
      .catch((error) => {
        this.setState({ isLoading: false });
        console.log(error);
      });
  }


  ComfirmEmail = () => {
    const { navigate } = this.props.navigation;

    this.setState({ isLoading: true });

    fetch('http://e1f63cbbbe63.ngrok.io/api/auth/confirmEmail', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.state.token
      },
      body: JSON.stringify({
        tokenTry: this.state.tokenInput,
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.Confirmed == 'Account activated') {
          this.setState({ isLoading: false }, function () {
            navigate('NameRegister', { token: this.state.token })
          });
        }
        else {
          Alert.alert(
            'Error',
            'Token not valid',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false }
          )
          this.setState({ isLoading: false });
        }

      })
      .catch((error) => {
        this.setState({ isLoading: false });
        console.log(error);
      });
  }

  async saveToken(token) {
    if (!token == '') {
      try {
        await AsyncStorage.setItem('@MySuperStore:token', token);
        console.log("token saved");
      } catch (error) {
        console.log("Error saving data" + error);
      }
    }
    else {
      console.log("token empty");
    }
  }

}

