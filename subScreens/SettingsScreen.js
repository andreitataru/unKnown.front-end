import React, { Component } from 'react';
import {
  StyleSheet, TextInput, View, Alert, Button, Text, TouchableOpacity, TouchableWithoutFeedback, Switch,
  KeyboardAvoidingView, AsyncStorage, Image, Dimensions, ActivityIndicator, ScrollView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { Card, Icon } from 'react-native-elements';

if (Platform.OS === 'android') {
  SafeAreaView.setStatusBarHeight(0);
}

export default class App extends Component {
  static navigationOptions = {
    title: 'Settings',
    headerStyle: { backgroundColor: '#18e794' },
    headerTitleStyle: { color: 'white' },
    headerTintColor: 'white'
  }
  constructor(props) {

    super(props)

    this.state = {
      Discovery: true,
      token: '',
      email: '',
      verified: '',
      normalUser: false,
    }

  }
  render() {
    const { navigate } = this.props.navigation;

    let iconName;
    iconNameLogout = Platform.OS === 'ios' ? `ios-log-out` : 'md-log-out';

    return (
      <ScrollView>
        <View style={styles.settingsMainContainer}>
          <Card containerStyle={{ width: '85%', height: 116 }}>
            <View style={styles.Button}>
              <TouchableWithoutFeedback>
                <View style={styles.touchableSettingsDiscovery}>
                  <Text style={styles.buttonTextDiscovery}>
                    Discovery
                  </Text>
                  <Icon
                    name='person-pin-circle'
                    type='MaterialIcons'
                    color='#444242'
                    size={28}
                  />
                  <Switch
                    onValueChange={(value) => this.DiscoveryChange(value)}
                    value={this.state.Discovery} />
                </View>
              </TouchableWithoutFeedback>
              <Text style={styles.mediumInfoText}>You will not appear on the map but you can continue to chat with your matches</Text>
            </View>
          </Card>
          {this.state.normalUser && (
            <Card containerStyle={{ width: '85%', height: 80 }}>
              <View style={styles.Button}>
                <TouchableOpacity onPress={() => navigate('ChangeEmail')}>
                  <View style={styles.touchableSettings}>
                    <Text style={styles.buttonTextWithRightSpace}>
                      Change Email
                  </Text>
                    <Icon
                      name='mail-outline'
                      type='MaterialIcons'
                      color='#444242'
                      size={24}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </Card>
          )
          }
          {this.state.normalUser && (
            <Card containerStyle={{ width: '85%', height: 80 }}>
              <View style={styles.Button}>
                <TouchableOpacity onPress={() => navigate('ChangePwd')}>
                  <View style={styles.touchableSettings}>
                    <Text style={styles.buttonTextWithRightSpace2}>
                      Change Password
                  </Text>
                    <Icon
                      name='lock-outline'
                      type='MaterialIcons'
                      color='#444242'
                      size={24}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </Card>
          )
          }
          <Card containerStyle={{ width: '85%', height: 80, alignItems: 'center' }}>
            <View style={styles.Button}>
              <TouchableOpacity onPress={this.LogOut}>
                <View style={styles.touchableSettings}>
                  <Text style={styles.buttonTextWithRightSpace3}>
                    Log Out
                  </Text>
                  <Ionicons
                    name={iconNameLogout}
                    size={24}
                    color={'#444242'}
                    marginLeft={10}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </Card>
          <Image
            source={{ uri: 'https://i.imgur.com/XqOBaLG.png' }}
            style={styles.settingImage}
          />
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Card containerStyle={{ width: '85%', height: 90, marginBottom: 20 }}>
            <View style={styles.Button}>
              <TouchableOpacity onPress={this.deleteAccount}>
                <View style={styles.touchableSettingsLast}>
                  <Text style={styles.buttonText}>
                    Delete Account
                  </Text>
                  <Icon
                    name='delete-forever'
                    type='MaterialIcons'
                    color='#444242'
                    size={24}
                  />
                </View>
              </TouchableOpacity>
              <Text style={styles.mediumInfoText}>Your account will be deleted permanently</Text>
            </View>
          </Card>
        </View>
      </ScrollView>

    );
  }

  componentWillMount() {
    this.getToken('token');
  }


  DiscoveryChange = (value) => {
    this.setState({
      Discovery: value
    })

    if (value == true) {
      this.updateDiscovery(1);
    }
    else {
      this.updateDiscovery(0);
    }

  }

  async getToken(key) {
    try {
      const value = await AsyncStorage.getItem('@MySuperStore:' + key);
      this.setState({ token: value }, function () {
        this.GetUserInfo();
      });

    } catch (error) {
      console.log("Error retrieving data" + error);
    }
  }

  updateDiscovery = (value) => {
    fetch('http://e1f63cbbbe63.ngrok.io/api/auth/updateDiscovery', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.state.token
      },
      body: JSON.stringify({
        discovery: value,
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
      })
      .catch((error) => {
        console.log(error);
      });
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
        console.log(responseJson.fbUser);
        if (responseJson.fbUser == '1') {
          this.setState({ normalUser: false });
        }
        else {
          this.setState({ normalUser: true });
        }
        if (responseJson.discovery == 1) {
          this.setState({ Discovery: true });
        }
        else {
          this.setState({ Discovery: false });
        }
      })
      .catch((error) => {
        console.log(error);
      });

  }

  deleteAccount = () => {
    const { navigate } = this.props.navigation;

    Alert.alert(
      'Delete Account',
      'You want to delete your account?',
      [
        { text: 'Yes', onPress: () => this.deleteAcc() },
        { text: 'No' },
      ],
      { cancelable: false }
    )
  }

  deleteAcc() {
    fetch('http://e1f63cbbbe63.ngrok.io/api/auth/deleteUser', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.state.token
      },
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.resetKey();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  LogOut = () => {
    fetch('http://e1f63cbbbe63.ngrok.io/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + this.state.token
      }
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
      })
      .catch((error) => {
        console.log(error);
      });
    this.resetKey();
  }


  async resetKey() {
    const { navigate } = this.props.navigation;
    try {
      await AsyncStorage.removeItem('@MySuperStore:token');
      this.setState({ token: null });
      AsyncStorage.clear();
      navigate('Home')
    } catch (error) {
      console.log("Error resetting data" + error);
    }
  }

}