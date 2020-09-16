import React, { Component } from 'react';
import {
  StyleSheet, TextInput, View, Alert, Button, Text, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, AsyncStorage, Image, Dimensions, ActivityIndicator
} from 'react-native';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { Card, Icon, Divider } from 'react-native-elements';

if (Platform.OS === 'android') {
  SafeAreaView.setStatusBarHeight(0);
}

export default class App extends Component {
  static navigationOptions = {
    title: 'Profile',
    headerStyle: { backgroundColor: '#18e794' },
    headerTitleStyle: { color: 'white' },
    headerTintColor: 'white'
  }
  constructor(props) {

    super(props)

    this.state = {
      imageURL: '',
      Name: '',
      Age: '',
      gender: '',
      bio: '',
      work: '',
      place: '',
      school: '',
      at: '',
      isLoading: false,
      token: '',
      userId: '',
      user: false,
      like: false,
      birth: '',

      canLike: true,
    }

  }
  render() {
    const { navigate } = this.props.navigation;
    let iconName;
    let iconNameMale = Platform.OS === 'ios' ? `ios-male` : 'md-male';
    let iconNameFemale = Platform.OS === 'ios' ? `ios-female` : 'md-female';

    if (this.state.gender == 'male') {
      iconName = iconNameMale;
    }
    else if (this.state.gender == 'female') {
      iconName = iconNameFemale;
    }
    else {
      iconName = '';
    }
    let color;
    let iconNameLike;
    if (this.state.user == true) {
      iconNameLike = 'thumb-up';
      if (this.state.like == true) {
        color = '#18ee94';
      }
      else if (this.state.like == false) {
        color = '#D3D3D3';
      }
    }

    return (
      <ScrollView style={backgroundColor = '#f5f5f5'}>
        <View style={styles.containerWithGrey}>
          <TouchableOpacity style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: '#ee6e73',
            position: 'absolute',
            bottom: 10,
            right: 10,
          }}>
            <Icon
              name='create'
              type='MaterialIcons'
              color='#444242'
              size={20}
            />
          </TouchableOpacity>
          <Card containerStyle={{ width: '100%', height: 600, alignSelf: 'center' }}>
            <Image
              style={styles.picture}
              resizeMode="cover"
              source={{ uri: this.state.imageURL }}
              maxHeight={350}
            />
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.userNameAgeStyleProf}>
                {this.state.Name} , {this.state.Age}
              </Text>
              <View style={{ marginLeft: '1%', width: '45%' }}>
                <Ionicons
                  name={iconName}
                  size={27}
                  color={'#444242'}
                />
              </View>
              {
                this.state.canLike && (
                  <Icon
                    name={iconNameLike}
                    type='MaterialIcons'
                    color={color}
                    size={50}
                    onPress={this.changeLike.bind(this)}
                  />
                )
              }
            </View>
            <View style={styles.iconLeft}>
              <Icon
                name='work'
                type='MaterialIcons'
                color='#444242'
                size={20}
                marginLeft='1%'
              />
              <Text style={styles.publifProfInfo}>
                {this.state.work} {this.state.at} {this.state.place}
              </Text>
            </View>
            <View style={styles.iconLeftLast}>
              <Icon
                name='school'
                type='MaterialIcons'
                color='#444242'
                size={20}
                marginLeft='1%'
              />
              <Text style={styles.publifProfInfo}>
                {this.state.school}
              </Text>
            </View>
            <Divider style={{ backgroundColor: '#D3D3D3' }} />
            <View style={styles.bio}>
              <Text style={styles.mediumPlusInfoText}>
                {this.state.bio}
              </Text>
            </View>
            <Divider style={{ backgroundColor: '#D3D3D3' }} />
          </Card>
        </View>
        {
          this.state.isLoading && (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color="#18ee94" />
            </View>
          )
        }
      </ScrollView>

    );
  }

  componentWillMount() {
    if (this.props.navigation.state.params.id == 'ok') {
      this.setState({ isLoading: true });
      this.getInfo();
    }
    else {
      this.setState({ userId: this.props.navigation.state.params.id, token: this.props.navigation.state.params.token, canLike: this.props.navigation.state.params.canLike }, function () {
        console.log(this.state.userId);
        this.GetUserData();
        console.log(this.state.token);
      });
    }
  }

  changeLike() {
    if (this.state.like == true) {
      this.setState({ like: false });
    }
    else {
      this.setState({ like: true });
      this.setState({ isLoading: true });
      fetch('http://e1f63cbbbe63.ngrok.io/api/auth/Like', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.state.token
        },
        body: JSON.stringify({
          TargetId: this.state.userId
        }),
      }).then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);

          this.setState({ isLoading: false });
        })
        .catch((error) => {
          this.setState({ isLoading: false });
          console.log(error);
        });
    }
  }

  GetUserData = () => {
    this.setState({ isLoading: true });

    fetch('http://e1f63cbbbe63.ngrok.io/api/auth/getUser', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.state.token
      },
      body: JSON.stringify({
        id: this.state.userId,
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson[0]);
        console.log(responseJson.Success[0].name);
        this.setState({ Name: responseJson.Success[0].name, birth: responseJson.Success[0].datebirth });
        if (responseJson.Success[0].gender != null) {
          this.setState({ gender: responseJson.Success[0].gender });
        }
        if (responseJson.Success[0].picture == null || responseJson.Success[0].picture == 'deleted' || responseJson.Success[0].picture == 'NULL') {
          this.setState({ imageURL: 'http://www.pocketbi.es/wp-content/uploads/2017/10/facebook-anonymous-app.jpg' });
        }
        else {
          this.setState({ imageURL: `data:image/jpg;base64,${responseJson.Success[0].picture}` })
        }
        if (responseJson.Success[0].bio != null) {
          this.setState({ bio: responseJson.Success[0].bio });
        }
        if (responseJson.Success[0].work != null) {
          this.setState({ work: responseJson.Success[0].work });
        }
        if (responseJson.Success[0].place != null) {
          this.setState({ place: responseJson.Success[0].place });
        }
        if (responseJson.Success[0].school != null) {
          this.setState({ school: responseJson.Success[0].school });
        }
        if (this.state.work != null && this.state.place != null) {
          this.setState({ at: '-' });
        }
        else {
          this.setState({ at: '' });
        }
        this.setState({ user: true });

        let birth = new Date(this.state.birth);
        let server = new Date(responseJson[0]);

        let abc = server.getTime() - birth.getTime();
        let age = Math.floor(abc / 31557600000);
        this.setState({ Age: age });
        this.setState({ isLoading: false });
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        console.log(error);
      });
  }


  async getInfo() {
    try {
      this.setState({
        Name: await AsyncStorage.getItem('@MySuperStore:name'),
        Age: await AsyncStorage.getItem('@MySuperStore:age'),
        gender: await AsyncStorage.getItem('@MySuperStore:gender'),
        imageURL: `data:image/jpg;base64,${await AsyncStorage.getItem('@MySuperStore:base64')}`,
        bio: await AsyncStorage.getItem('@MySuperStore:bio'),
        work: await AsyncStorage.getItem('@MySuperStore:work'),
        place: await AsyncStorage.getItem('@MySuperStore:place'),
        school: await AsyncStorage.getItem('@MySuperStore:school'),
      });
      console.log(this.state.imageURL);
      if (this.state.imageURL == null || this.state.imageURL == 'deleted' || this.state.imageURL == 'data:image/jpg;base64,null' || this.state.imageURL == 'data:image/jpg;base64,deleted') {
        this.setState({ imageURL: 'http://www.pocketbi.es/wp-content/uploads/2017/10/facebook-anonymous-app.jpg' });
      }
      console.log(this.state.work);
      console.log(this.state.place);
      if (this.state.work != null && this.state.place != null) {
        this.setState({ at: '-' });
      }
      else {
        this.setState({ at: '' });
      }
      this.setState({ user: false });
      console.log(this.state.at);
      this.setState({ isLoading: false });
    } catch (error) {
      console.log("Error retrieving data" + error);
      this.setState({ isLoading: false });
    }
  }

}