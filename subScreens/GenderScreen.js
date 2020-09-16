import React, { Component } from 'react';
import { View, StyleSheet, Text, Button, TouchableOpacity, AsyncStorage, Alert, ActivityIndicator, CheckBox } from 'react-native';
import { Icon, Card } from 'react-native-elements';

export default class App extends Component {
  static navigationOptions = {
    title: 'Sex',
    headerStyle: { backgroundColor: '#18e794' },
    headerTitleStyle: { color: 'white' },
    headerTintColor: 'white'
  }

  constructor() {
    super();
    this.state = {

      token: '',
      isLoading: false,
      male: false,
      female: false,
      genderForSv: '',

    };
  }

  checkBoxTest(gender) {

    switch (gender) {
      case 'male': {
        this.setState({ male: !this.state.male }, function () {
          if (this.state.male == true) {
            this.setState({ female: false });
            this.setState({ genderForSv: 'male' });
          }
        });
        break;
      }
      case 'female': {
        this.setState({ female: !this.state.female }, function () {
          if (this.state.female == true) {
            this.setState({ male: false });
            this.setState({ genderForSv: 'female' });
          }
        });
        break;
      }
    }

  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.TextCreateAcc}>What's your sex?</Text>
        <View style={{ flexDirection: 'row', marginLeft: '26%', marginBottom: '5%' }}>
          <Text style={{ fontSize: 22, color: '#444242' }}>
            Male
            </Text>
          <CheckBox
            value={this.state.male}
            onChange={() => this.checkBoxTest('male')} />
          <Text style={{ fontSize: 22, color: '#444242' }}>
            Female
            </Text >
          <CheckBox
            value={this.state.female}
            onChange={() => this.checkBoxTest('female')} />

        </View>
        <View style={styles.Button}>
          <TouchableOpacity onPress={this.genderSv}>
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
        {
          this.state.isLoading && (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color="#18ee94" />
            </View>
          )
        }
      </View>

    );
  }


  componentWillMount() {
    //this.getToken('token');
    this.setState({ token: this.props.navigation.state.params.token });
  }



  genderSv = () => {
    const { navigate } = this.props.navigation;
    if (!this.state.genderForSv == '') {
      this.setState({ isLoading: true }, function () {
        fetch('http://e1f63cbbbe63.ngrok.io/api/auth/updateGender', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.state.token
          },
          body: JSON.stringify({
            gender: this.state.genderForSv,
          }),
        }).then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson);
            let obj = responseJson;
            if (obj.Success == "Gender Changed") {
              this.setState({ isLoading: false });
              navigate('Image', { token: this.state.token });
            }
            else {
              this.setState({ isLoading: false });
              Alert.alert(
                'Error',
                'Blabla',
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
      });

    }
    else {
      Alert.alert(
        'Error',
        'Pick your gender',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false }
      )
    }


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
}

