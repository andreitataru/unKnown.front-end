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
    title: 'Change Password',
    headerStyle: { backgroundColor: '#18e794' },
    headerTitleStyle: { color: 'white' },
    headerTintColor: 'white'
  }
  constructor(props) {

    super(props)

    this.state = {
      isLoading: false,
      currentPassword: '',
      newPassword: '',
      CnewPassword: '',
      newPasswordValid: false,
      token: '',

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
            name='lock'
            type='MaterialIcons'
            color='#444242'
            size={20}
            marginLeft='8%'
          />
          <Text style={styles.textLogin}>Current Password</Text>
        </View>
        <TextInput
          placeholder="Enter your current Password"
          onChangeText={currentPassword => this.setState({ currentPassword })}
          underlineColorAndroid='transparent'
          autoCapitalize="none"
          autoCorrect={false}
          ref={input => { this.textInput1 = input }}
          secureTextEntry={true}
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
          <Text style={styles.textLogin}>New Password:</Text>
        </View>
        <TextInput
          placeholder="Enter your new Password"
          onChangeText={newPassword => this.setState({ newPassword })}
          underlineColorAndroid='transparent'
          style={styles.TextInputStyleClass}
          secureTextEntry={true}
          ref={input => { this.textInput2 = input }}
        />
        <View style={styles.loginStuff}>
          <Icon
            name='lock'
            type='MaterialIcons'
            color='#444242'
            size={20}
            marginLeft='8%'
          />
          <Text style={styles.textLogin}>Confirm New Password:</Text>
        </View>
        <TextInput
          placeholder="Enter your new Password again"
          onChangeText={CnewPassword => this.setState({ CnewPassword })}
          underlineColorAndroid='transparent'
          style={styles.TextInputStyleClass}
          secureTextEntry={true}
          marginBottom='2%'
          ref={input => { this.textInput3 = input }}
        />
        <View style={styles.Button}>
          <TouchableOpacity onPress={this.ChangePassword}>
            <View style={styles.touchableLogin}>
              <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: '8%', fontSize: 18 }}>
                Change Password
                </Text>
              <Icon
                name='lock-outline'
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

  ChangePassword = () => {
    this.setState({ isLoading: true }, function () {
      this.checkFormValid(this.state.newPassword, this.state.CnewPassword);
    });
  }

  checkFormValid = (newPassword, CnewPassword) => {
    if (((newPassword == CnewPassword) && (newPassword.length >= 6 && newPassword.length <= 12))) {
      this.setState({ newPasswordValid: true }, function () {
        this.ServerPassChange();
      });
    }
    else if (!(newPassword == CnewPassword)) {
      this.setState({ isLoading: false });
      Alert.alert(
        'Error',
        'New Passwords must be equal',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false }
      )
    }
    else if (!(newPassword.length >= 6 && newPassword.length <= 12)) {
      this.setState({ newPasswordValid: false }, function () {
        this.setState({ isLoading: false });
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

  ServerPassChange = () => {
    fetch('http://e1f63cbbbe63.ngrok.io/api/auth/changePassword', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.state.token
      },
      body: JSON.stringify({
        password: this.state.newPassword,
        password_confirmation: this.state.CnewPassword,
        oldPassword: this.state.currentPassword,
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.Success == "Password Changed") {
          Alert.alert(
            'Success',
            'Password Changed Successfully',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false }
          )
          this.textInput1.clear();
          this.textInput2.clear();
          this.textInput3.clear();
        }
        else {
          Alert.alert(
            'Error',
            'Current Password not valid',
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