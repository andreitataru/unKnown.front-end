import React, { Component } from 'react';
import { StyleSheet, TextInput, View, Alert, Button, Text, TouchableOpacity, KeyboardAvoidingView, AsyncStorage, Image, Dimensions, ActivityIndicator, BackAndroid } from 'react-native';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { Icon, Card } from 'react-native-elements';

if (Platform.OS === 'android') {
  SafeAreaView.setStatusBarHeight(0);
}

export default class App extends Component {
  static navigationOptions = {
    title: 'Name',
    headerStyle: { backgroundColor: '#18e794' },
    headerTitleStyle: { color: 'white' },
    headerTintColor: 'white',
    headerLeft: null
  }
  constructor(props) {

    super(props)

    this.state = {
      name: '',
      token: '',
      nameValid: false
    }

  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="position"
      >
        <Text style={styles.TextCreateAcc}>What's your first name?</Text>
        <TextInput
          placeholder="Enter your Name"
          onChangeText={name => this.setState({ name })}
          underlineColorAndroid='transparent'
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.TextInputStyleClass}
        />
        <View style={styles.Button}>
          <TouchableOpacity onPress={this.NameSv}>
            <View style={styles.touchableLogin}>
              <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: '8%', fontSize: 18 }}>
                Next
                </Text>
              <Icon
                name='navigate-next'
                type='MaterialIcons'
                color='#444242'
                size={28}
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
    //this.getToken('token');
    console.log(this.props.navigation.state.params.token);
    this.setState({ token: this.props.navigation.state.params.token });
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton() {
    return true;
  }


  NameSv = () => {
    const { navigate } = this.props.navigation;
    this.setState({ isLoading: true }, function () {
      if ((!/[^a-zA-Z]/.test(this.state.name)) && (this.state.name.length > 0)) {
        fetch('http://e1f63cbbbe63.ngrok.io/api/auth/updateName', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.state.token
          },
          body: JSON.stringify({
            name: this.state.name,
          }),
        }).then((response) => response.json())
          .then((responseJson) => {
            console.log('response:' + responseJson);
            let obj;
            obj = responseJson;
            console.log(responseJson);
            navigate('DateBirth', { token: this.state.token })
            this.setState({ isLoading: false });
          })
          .catch((error) => {
            this.setState({ isLoading: false });
            console.log(error);
          });
      }
      else if (this.state.name.length == 0) {
        this.setState({ isLoading: false });
        Alert.alert(
          'Error',
          'Enter your first name',
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ],
          { cancelable: false }
        )
      }
      else if ((/[^a-zA-Z]/.test(this.state.name))) {
        this.setState({ isLoading: false });
        Alert.alert(
          'Error',
          'Only letters are allowed',
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ],
          { cancelable: false }
        )
        console.log('name not valid');
      }
    });

  }

  async getToken(key) {
    try {

      const value = await AsyncStorage.getItem('@MySuperStore:' + key);
      this.setState({ token: value });

    } catch (error) {
      console.log("Error retrieving data" + error);
    }
  }

}