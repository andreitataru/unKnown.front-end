import React, { Component } from 'react';
import { StyleSheet, TextInput, View, Alert, Button, Text, TouchableOpacity, AsyncStorage, KeyboardAvoidingView, Image, Dimensions, ActivityIndicator } from 'react-native';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Card, Icon } from 'react-native-elements';

if (Platform.OS === 'android') {
  SafeAreaView.setStatusBarHeight(0);
}

export default class App extends Component {
  static navigationOptions = {
    title: 'Restore Password',
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
      status: true,
      tokenInput: '',
      canShow: false,
      code: '',
    }

  }


  render() {

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="position"
      >
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
              ref={input => { this.textInput = input }}
              editable={!this.state.canShow}
              autoCapitalize="none"
              autoCorrect={false}
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
              </View>
            )}
            <View style={styles.Button}>
              <TouchableOpacity onPress={this.Restore}>
                <View style={styles.touchableLogin}>
                  <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: '8%', fontSize: 18 }}>
                    Restore Password
                </Text>
                  <Icon
                    name='lock-open'
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

  componentWillMount() {
    this.setState({ canShow: false });
  }

  Restore = () => {
    const { navigate } = this.props.navigation;
    this.setState({ isLoading: true });

    if (this.state.canShow == false) {
      fetch('http://e1f63cbbbe63.ngrok.io/api/auth/SendCodeForgot', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.state.email,
        }),
      }).then((response) => response.json())
        .then((responseJson) => {
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
            this.setState({ canShow: true });
          }
          else {
            Alert.alert(
              'Error',
              'Email doesnt exist',
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
    else {

      if (((this.state.password.length >= 6 && this.state.password.length <= 12))) {
        fetch('http://e1f63cbbbe63.ngrok.io/api/auth/changePasswordF', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.state.email,
            password: this.state.password,
            code: this.state.code
          }),
        }).then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson);
            if (responseJson.Success == 'Password changed') {
              this.setState({ canShow: true });
              Alert.alert(
                'Success',
                'Password Changed Successfully',
                [
                  { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false }
              )
              this.setState({ canShow: false });
              this.textInput.clear();
            }
            else if (responseJson.Error == 'Code not valid') {
              Alert.alert(
                'Error',
                'Code not valid',
                [
                  { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false }
              )
            }
            else {
              Alert.alert(
                'Error',
                'Error',
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
      else {
        Alert.alert(
          'Error',
          'Password needs to be between 6 and 12 characters',
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ],
          { cancelable: false }
        )
        this.setState({ isLoading: false });
      }
    }

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

