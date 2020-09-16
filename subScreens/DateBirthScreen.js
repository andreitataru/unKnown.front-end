import React, { Component } from 'react';
import { View, StyleSheet, Text, Button, TouchableOpacity, AsyncStorage, Alert, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DatePicker from './../components/DatePicker';
import { Icon, Card } from 'react-native-elements';

export default class App extends Component {
  static navigationOptions = {
    title: 'Date of Birth',
    headerStyle: { backgroundColor: '#18e794' },
    headerTitleStyle: { color: 'white' },
    headerTintColor: 'white'
  }

  constructor() {
    super();
    this.state = {
      date: new Date(),
      dateBirth: 'dd/mm/yyyy',
      dateBirthForSv: '',
      isShowPicker: false,
      token: '',
      isLoading: false,


      pickedDay: '',
      pickedMonth: '',
      pickedYear: '',

      dateTodaySV: '',
      svDay: '',
      svMonth: '',
      svYear: '',
    };
  }

  _onDateSelected = (result) => {

    this.setState({
      dateBirth: `${result.day}/${result.month + 1}/${result.year}`,
      dateBirthForSv: `${result.year}-${result.month + 1}-${result.day}`,

      pickedDay: `${result.day}`,
      pickedMonth: `${result.month}`,
      pickedYear: `${result.year}`,

      isShowPicker: false
    }, function () {
      if (this.state.dateBirth == 'undefined/NaN/undefined') {
        this.setState({ dateBirth: 'dd/mm/yyyy' });
      }
      console.log(this.state.dateBirthForSv);
    });

  }

  _showDatePicker = () => {
    this.setState({ isShowPicker: true })
  }
  render() {

    let iconName;
    iconName = Platform.OS === 'ios' ? `ios-calendar` : 'md-calendar';

    return (
      <View style={styles.container}>
        <Text style={styles.TextCreateAcc}>When were you born?</Text>
        <View style={{ flexDirection: 'row', marginLeft: '26%', }}>
          <Text style={styles.TextDate}>{this.state.dateBirth}</Text>
          <TouchableOpacity style={styles.calendar} onPress={this._showDatePicker}>
            <Ionicons
              name={iconName}
              size={40}
              color={'#18ee94'}
            />
            <Text style={styles.littleInfoText}>Pick</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.Button}>
          <TouchableOpacity onPress={this.dateBirthSv}>
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
        {this.state.isShowPicker ? <DatePicker onDateSelected={this._onDateSelected} /> : null}
        {this.state.isLoading && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#18ee94" />
          </View>
        )}
      </View>
    );
  }

  componentWillMount() {
    //this.getToken('token');
    this.setState({ token: this.props.navigation.state.params.token });
  }

  componentDidMount() {
    this.getTodayDate();
  }

  getTodayDate = () => {
    fetch('http://8d71766e66bc.ngrok.io/api/serverTodayDate', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        let obj = responseJson;
        this.setState({
          dateTodaySV: obj.dateToday,
          svDay: obj.day,
          svMonth: obj.month,
          svYear: obj.year,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }


  dateBirthSv = () => {
    const { navigate } = this.props.navigation;

    let birth = new Date(this.state.pickedYear, this.state.pickedMonth, this.state.pickedDay);
    let server = new Date(this.state.svYear, this.state.svMonth, this.state.svDay);

    let abc = server.getTime() - birth.getTime();
    let age = Math.floor(abc / 31557600000);

    if (server < birth) {
      Alert.alert(
        'Error',
        'You have not been born yet.',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false }
      )
    }
    else {
      if (age >= 16) {
        this.setState({ isLoading: true }, function () {
          if (this.state.dateBirthForSv < this.state.dateTodaySV) {
            fetch('http://8d71766e66bc.ngrok.io/api/auth/updateDateBirth', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.token
              },
              body: JSON.stringify({
                datebirth: this.state.dateBirthForSv,
              }),
            }).then((response) => response.json())
              .then((responseJson) => {
                console.log(responseJson);
                let obj = responseJson;
                if (obj.Success == "DateBirth Changed") {
                  this.setState({ isLoading: false });
                  navigate('Gender', { token: this.state.token });
                }
                else {
                  this.setState({ isLoading: false });
                  Alert.alert(
                    'Error',
                    'Pick Date',
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
        });
      }
      else {
        Alert.alert(
          'Error',
          'You must be at least 16 years old',
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ],
          { cancelable: false }
        )
      }
    }
  }
}

