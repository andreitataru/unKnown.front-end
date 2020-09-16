import React from 'react';
import {
  Image, Platform, ScrollView, StyleSheet, View,
  TouchableOpacity, Text, AsyncStorage, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';



export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {

    super(props)

    this.state = {

      token: '',
      email: '',
      Name: '',
      Age: '',
      picture: 'http://www.pocketbi.es/wp-content/uploads/2017/10/facebook-anonymous-app.jpg',
      base64: '',
      isLoading: false,
      gender: '',
      bio: '',
      work: '',
      place: '',
      school: '',

      dateTodaySV: '',

      dateUser: '',

    }


  }

  render() {
    const { navigate } = this.props.navigation;
    let iconName;
    iconNameSettings = Platform.OS === 'ios' ? `ios-settings` : 'md-settings';
    iconNameInfoEdit = Platform.OS === 'ios' ? `ios-create` : 'md-create';
    return (
      <View style={styles.containerProfile}>
        <ScrollView>
          <View style={styles.welcomeContainer}>
            <TouchableOpacity style={styles.imagestyle} onPress={() => navigate('PublicProfile', { id: 'ok', token: this.state.token })}>
              <Image style={styles.imageContainer}
                source={{ uri: this.state.picture }} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userNameAgeStyle}>
            {this.state.Name} , {this.state.Age}
          </Text>
          <View style={{ flexDirection: 'row', }}>
            <TouchableOpacity style={styles.Settings} onPress={() => navigate('Settings')}>
              <Ionicons
                name={iconNameSettings}
                size={65}
                color={'#18ee94'}
              />
              <Text style={styles.littleInfoText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.info} onPress={() => navigate('Edit', { refresh: this.refreshFunction })}>
              <Ionicons
                name={iconNameInfoEdit}
                size={65}
                color={'#18ee94'}
              />
              <Text style={styles.littleInfoText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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

  refreshFunction = () => {
    this.setState({ isLoading: true }, function () {
      this.GetUserInfo();
    });
  }

  componentWillMount() {
    this.setState({ isLoading: true }, function () {
      this.getToken('token', 'getUserInfo');
    });

  }

  componentDidMount() {
    console.log(this.state.gender);
  }

  GetUserInfo = () => {
    fetch('http://e1f63cbbbe63.ngrok.io/api/auth/me', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.state.token
      }
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.picture != null && responseJson.picture != 'deleted') {
          this.setState({ base64: responseJson.picture, picture: `data:image/jpg;base64,${responseJson.picture}` });
        }
        else {
          this.setState({ base64: 'deleted' });
          this.setState({ picture: 'http://www.pocketbi.es/wp-content/uploads/2017/10/facebook-anonymous-app.jpg' });
        }
        if (responseJson.gender != null) {
          this.setState({ gender: responseJson.gender });
        }
        if (responseJson.bio != null) {
          this.setState({ bio: responseJson.bio });
        }
        if (responseJson.work != null) {
          this.setState({ work: responseJson.work });
        }
        if (responseJson.place != null) {
          this.setState({ place: responseJson.place });
        }
        if (responseJson.school != null) {
          this.setState({ school: responseJson.school });
        }
        this.setState({ email: responseJson.email });
        this.setState({ Name: responseJson.name });
        if (responseJson.datebirth != null) {
          this.setState({
            dateUser: responseJson.datebirth,
          }, function () {
            this.getTodayDate();
          });
        }
        else {
          this.saveInfo(this.state.email, this.state.Name, this.state.Age, this.state.gender,
            this.state.base64, this.state.bio, this.state.work, this.state.place, this.state.school);
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({ isLoading: false });
      });

  }


  getTodayDate = () => {
    fetch('http://e1f63cbbbe63.ngrok.io/api/serverTodayDate', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json())
      .then((responseJson) => {

        let birth = new Date(this.state.dateUser);
        let server = new Date(responseJson.dateToday);

        let abc = server.getTime() - birth.getTime();
        let age = Math.floor(abc / 31557600000);
        this.setState({ Age: age });
        console.log(this.state.Name);
        this.saveInfo(this.state.email, this.state.Name, this.state.Age, this.state.gender,
          this.state.base64, this.state.bio, this.state.work, this.state.place, this.state.school);
      })
      .catch((error) => {
        console.log(error);
      });
  }


  async resetKey(navigate) {
    try {
      await AsyncStorage.removeItem('@MySuperStore:token');
    } catch (error) {
      console.log("Error resetting data" + error);
    }
  }

  async getToken(key, type) {
    try {
      const value = await AsyncStorage.getItem('@MySuperStore:' + key);
      this.setState({ token: value }, function () {
        if (type == 'getUserInfo') {
          this.GetUserInfo();
        }
      });
    } catch (error) {
      console.log("Error retrieving data" + error);
    }
  }

  async saveInfo(email, name, age, gender, base64, bio, work, place, school) {
    console.log(gender);
    try {
      await AsyncStorage.setItem('@MySuperStore:email', String(email));
      await AsyncStorage.setItem('@MySuperStore:name', String(name));
      await AsyncStorage.setItem('@MySuperStore:age', String(age));
      await AsyncStorage.setItem('@MySuperStore:gender', String(gender));
      await AsyncStorage.setItem('@MySuperStore:base64', String(base64));
      await AsyncStorage.setItem('@MySuperStore:bio', String(bio));
      await AsyncStorage.setItem('@MySuperStore:work', String(work));
      await AsyncStorage.setItem('@MySuperStore:place', String(place));
      await AsyncStorage.setItem('@MySuperStore:school', String(school));
      console.log("info saved");
      this.setState({ isLoading: false });
    } catch (error) {
      console.log("Error saving data" + error);
    }
  }


}

