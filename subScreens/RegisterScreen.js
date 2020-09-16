import React, { Component } from 'react';
import { StyleSheet, TextInput, View, Alert, Button, Text, TouchableOpacity, KeyboardAvoidingView, AsyncStorage, Image, Dimensions, ActivityIndicator } from 'react-native';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Icon, Card } from 'react-native-elements';

if (Platform.OS === 'android') {
  SafeAreaView.setStatusBarHeight(0);
}

export default class App extends Component {
  static navigationOptions = {
    title: 'Create Account',
    headerStyle: { backgroundColor: '#18e794' },
    headerTitleStyle: { color: 'white' },
    headerTintColor: 'white'
  }
  constructor(props) {

    super(props)

    this.state = {
      name: '',
      email: '',
      password: '',
      Cpassword: '',
      token: '',
      isLoading: false,
      canNavigate: false,
      status: true,
      emailToken: false,
      tokenInput: '',
    }

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
                name='lock'
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
            />
            <View style={styles.loginStuff}>
              <Icon
                name='lock'
                type='MaterialIcons'
                color='#444242'
                size={20}
                marginLeft='8%'
              />
              <Text style={styles.textLogin}>Confirm Password:</Text>
            </View>
            <TextInput
              placeholder="Enter your Password again"
              onChangeText={Cpassword => this.setState({ Cpassword })}
              underlineColorAndroid='transparent'
              style={styles.TextInputStyleClass}
              secureTextEntry={true}
              marginBottom='2%'
            />
            <View style={styles.Button}>
              <TouchableOpacity onPress={this.Register}>
                <View style={styles.touchableLogin}>
                  <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: '8%', fontSize: 18 }}>
                    Create Account
                </Text>
                  <Icon
                    name='account-circle'
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
        {this.state.isLoading && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#18ee94" />
          </View>
        )}
      </KeyboardAvoidingView>
    );
  }

  Register = () => {
    this.setState({ isLoading: true }, function () {
      this.checkFormValid(this.state.email, this.state.password, this.state.Cpassword);
    });
  }

  checkFormValid = (email, pass, Cpass) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if ((reg.test(email) === true) && ((pass == Cpass) && (pass.length >= 6 && pass.length <= 12))) {
      this.setState({ emailValid: true, passwordValid: true }, function () {
        this.ServerRegister();
      });
    }
    else if ((reg.test(email) === false) && (!(pass == Cpass) || !(pass.length >= 6 && pass.length <= 12))) {
      this.setState({ isLoading: false });
      Alert.alert(
        'Error',
        'Email and Password are invalid',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false }
      )
    }
    else if (reg.test(email) === false) {
      this.setState({ isLoading: false });
      this.setState({ emailValid: false }, function () {
        Alert.alert(
          'Error',
          'Email is invalid',
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ],
          { cancelable: false }
        )
      });
    }
    else if (!(pass == Cpass)) {
      this.setState({ passwordValid: false }, function () {
        this.setState({ isLoading: false });
        Alert.alert(
          'Error',
          'Passwords need to be equal',
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ],
          { cancelable: false }
        )
      });
    }
    else if (!(pass.length >= 6 && pass.length <= 12)) {
      this.setState({ isLoading: false });
      this.setState({ passwordValid: false }, function () {
        Alert.alert(
          'Error',
          'Password needs to be between 6 and 12 characters',
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ],
          { cancelable: false }
        )
      });
    }

  }

  ServerRegister = () => {
    fetch('http://8d71766e66bc.ngrok.io/api/auth/signup', {
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
        console.log(responseJson);
        console.log(responseJson.status);
        this.setState({ isLoading: false });
        if (responseJson.status == 'ok') {
          Alert.alert(
            'Email Confirmation',
            'A Code was sent to your email: ' + this.state.email,
            [
              { text: 'OK', onPress: () => this.tokenConfirm() },
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
      })
      .catch((error) => {
        this.setState({ isLoading: false });

        console.log(error);
      });
  }

  tokenConfirm() {
    this.setState({ status: false, emailToken: true });
    this.Login();
  }


  Login = () => {
    const { navigate } = this.props.navigation;

    this.setState({ isLoading: true });

    fetch('http://8d71766e66bc.ngrok.io/api/auth/login', {
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
        this.setState({ token: responseJson.token });
        this.setState({ isLoading: false });
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        console.log(error);
      });
  }


  ComfirmEmail = () => {
    const { navigate } = this.props.navigation;

    this.setState({ isLoading: true });

    fetch('http://8d71766e66bc.ngrok.io/api/auth/confirmEmail', {
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
            //this.saveToken(this.state.token);
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

