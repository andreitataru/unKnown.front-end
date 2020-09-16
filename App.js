import React from 'react';
import {
  Platform, StatusBar, StyleSheet, View, Button, Image,
  ScrollView, Alert, TouchableOpacity, Text, TextInput, AsyncStorage,
  KeyboardAvoidingView, BackHandler, ActivityIndicator, ImageEditor, ImageStore
} from 'react-native';
import Expo, { AppLoading, Asset, Font, Constants } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import TabNavigator from './navigation/MainTabNavigator';
import Slider from './components/Slider';
import LoginScreen from './subScreens/LoginScreen';
import RegisterScreen from './subScreens/RegisterScreen';
import SettingsScreen from './subScreens/SettingsScreen';
import ChangePwdScreen from './subScreens/ChangePwdScreen';
import EditScreen from './subScreens/EditScreen';
import PublicProfileScreen from './subScreens/PublicProfileScreen';
import NameRegisterScreen from './subScreens/NameRegisterScreen';
import DateBirthScreen from './subScreens/DateBirthScreen';
import GenderScreen from './subScreens/GenderScreen';
import ImageScreen from './subScreens/ImageScreen';
import ChangeEmailScreen from './subScreens/ChangeEmailScreen';
import MessageScreen from './subScreens/MessageScreen';
import ForgotScreen from './subScreens/ForgotScreen';
import { StackNavigator } from 'react-navigation';
import styles from './components/styles';

class AppHome extends React.Component {
  state = {
    isLoadingComplete: false, newUserState: true, MainApp: false, isLoading: false,
    LoginScreen: false, responseJSON: null, token: "", tokenLog: "", dateFormated: '', dateFormatedYYYY: '', dateFormated2: '',
  };
  static navigationOptions = {
    header: null
  }

  componentWillMount() {
    console.disableYellowBox = true;
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    this.setState({ token: null });

    this.getToken('token');

  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton() {
    return true;
  }

  refreshFunction = () => {
    this.getToken('token');
  }

  render() {
    const { navigate } = this.props.navigation;
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    }
    else {
      if (this.state.token == null) {
        return (
          <View style={styles.container}>
            <ScrollView>
              <View style={styles.welcomeContainer}>
                <Image
                  source={require('./assets/images/unknownLogo.png')}
                  style={styles.welcomeImage}
                />
                <View style={styles.SliderContainer}>
                  <Slider />
                </View>
                <View style={styles.Button}>
                  <TouchableOpacity onPress={() => navigate('Login', { refresh: this.refreshFunction })}>
                    <View style={styles.touchable}>
                      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                        Log In
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.Button}>
                  <TouchableOpacity onPress={() => navigate('Register')}>
                    <View style={styles.touchable}>
                      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                        Create Account
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.Button}>
                  {this.renderFbButton()}
                </View>
                <Text style={styles.littleInfoText}>We dont post anything on Facebook</Text>
              </View>
              {this.state.isLoading && (
                <View style={styles.loading}>
                  <ActivityIndicator size="large" color="#18ee94" />
                </View>
              )
              }
            </ScrollView>
          </View>
        );
      }
      else if (!(this.state.token == null)) {
        return (
          navigate('MainApp')
        );
      }
    }
  }

  FbLogin = () => {
    fetch('http://e1f63cbbbe63.ngrok.io/api/auth/signUpFB', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.responseJSON.email,
        name: this.state.responseJSON.first_name,
        datebirth: this.state.dateFormated,
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.saveToken(responseJson.token)
        this.setState({ token: responseJson.token });
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        console.log(error);
      });
  }

  async getToken(key, type) {
    try {
      const value = await AsyncStorage.getItem('@MySuperStore:' + key);
      if (type == 'log') {
        this.setState({ tokenLog: value });
        this.LogOut();
      }
      else {
        this.setState({ token: value });
      }

    } catch (error) {
      console.log("Error retrieving data" + error);
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

  callGraph = async token => {
    const response = await fetch(
      `https://graph.facebook.com/me?access_token=${token}&fields=first_name,email,birthday`
    );
    console.log(token);
    const responseJSON = await response.json();
    console.log(responseJSON);


    let yyyy = responseJSON.birthday.replace(/\//g, '-').split("-", 3).reverse().join("-");
    let year = yyyy.split("-", 1);
    let string = year[0];
    console.log(year[0]);
    let dateFormat = responseJSON.birthday.replace(/\//g, '-').split("-", 2).reverse().join("-").concat('-').concat(string);

    console.log(this.state.dateFormatedYYYY);
    this.setState({ dateFormated: dateFormat.split("-", 3).reverse().join("-") });
    console.log(this.state.dateFormated);
    this.setState({ responseJSON }, function () {
      this.FbLogin();
    });



  };

  login = async () => {
    const {
      type,
      token,
    } = await Expo.Facebook.logInWithReadPermissionsAsync('457697454665367', {
      permissions: ['public_profile', 'email', 'user_friends', 'user_birthday'],
    });

    if (type === 'success') {
      this.callGraph(token);
    }
  };

  SetNewUserFalse = () => {
    this.setState({
      newUserState: false,
      MainApp: true
    })
  }
  SetLogin = () => {
    this.setState({
      newUserState: false,
      LoginScreen: true
    })
  }
  BackMain = () => {
    this.setState({
      newUserState: true,
      LoginScreen: false
    })
  }

  renderFbButton = () => (
    <TouchableOpacity onPress={() => this.login()}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: 230,
          height: 40,
          backgroundColor: '#3b5998',
          borderRadius: 100,
        }}>
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
          Log in with Facebook
        </Text>
      </View>
    </TouchableOpacity>
  );

  renderValue = value => (
    <Text key={value} style={styles.paragraph}>{value}</Text>
  );

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/unknownLogo.png'),
      ]),
      Font.loadAsync({
        ...Ionicons.font,
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    console.log(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

}



export const SimpleApp = StackNavigator({
  Home: { screen: AppHome },
  Login: { screen: LoginScreen },
  Register: { screen: RegisterScreen },
  Settings: { screen: SettingsScreen },
  Edit: { screen: EditScreen },
  ChangePwd: { screen: ChangePwdScreen },
  PublicProfile: { screen: PublicProfileScreen },
  NameRegister: { screen: NameRegisterScreen },
  DateBirth: { screen: DateBirthScreen },
  Gender: { screen: GenderScreen },
  Image: { screen: ImageScreen },
  ChangeEmail: { screen: ChangeEmailScreen },
  Message: { screen: MessageScreen },
  Forgot: { screen: ForgotScreen },
  MainApp: { screen: TabNavigator },
});

export default class App extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.statusBar} />
        <SimpleApp />
      </View>
    );
  }
}
