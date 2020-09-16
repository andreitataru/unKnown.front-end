import React, { Component } from 'react';
import {
  StyleSheet, TextInput, View, Alert, Button, Text, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, AsyncStorage, Image, Dimensions, ActivityIndicator, CheckBox,
  ImageStore, ImageEditor
} from 'react-native';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Card, Icon, Divider } from 'react-native-elements';
import { ImagePicker, Permissions } from 'expo';
import { Ionicons } from '@expo/vector-icons';

if (Platform.OS === 'android') {
  SafeAreaView.setStatusBarHeight(0);
}

export default class App extends Component {
  static navigationOptions = {
    title: 'Edit Profile',
    headerStyle: { backgroundColor: '#18e794' },
    headerTitleStyle: { color: 'white' },
    headerTintColor: 'white'
  }
  constructor(props) {

    super(props)

    this.state = {
      imageURL: '',
      token: '',
      Name: '',
      Age: '',
      gender: '',
      bio: '',
      work: '',
      place: '',
      school: '',
      male: false,
      female: false,
      isLoading: false,


      NameCheck: '',
      ageCheck: '',
      genderCheck: '',
      bioCheck: '',
      workCheck: '',
      placeCheck: '',
      schoolCheck: ''
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

    return (
      <ScrollView style={backgroundColor = '#f5f5f5'}>
        <Card containerStyle={{ width: '100%', height: 400, alignSelf: 'center' }}>
          <Image
            style={styles.picture}
            resizeMode="cover"
            source={{ uri: this.state.imageURL }}
            maxHeight={350}
          />
          <View style={styles.iconsEditProf}>
            <Text style={styles.userNameAgeEdit}>
              {this.state.Name} , {this.state.Age}
            </Text>
            <View style={{ marginLeft: '1%', width: '40%' }}>
              <Ionicons
                name={iconName}
                size={27}
                color={'#444242'}
              />
            </View>
            <Icon
              name='photo-camera'
              type='MaterialIcons'
              color='#18ee94'
              size={40}
              onPress={this.pickImage.bind(this)}
            />
            <Icon
              name='delete'
              type='MaterialIcons'
              color='#444242'
              size={40}
              onPress={this.deleteImage.bind(this)}
            />
          </View>
        </Card>
        <View style={styles.editbioView}>
          <Text style={styles.about}>
            About {this.state.Name}
          </Text>
          <View style={styles.inputView}>
            <TextInput
              onChangeText={val => this.setState({ bio: val })}
              placeholder="About you"
              value={this.state.bio}
              autoCapitalize="none"
              autoCorrect={false}
              multiline
              underlineColorAndroid='transparent'
              style={{ minHeight: 60, height: 'auto', marginLeft: '2%', color: 'grey' }}
            />
          </View>
        </View>
        <View style={styles.editbioView}>
          <Text style={styles.about}>
            Current Work
          </Text>
          <View style={styles.inputView}>
            <TextInput
              onChangeText={val => this.setState({ work: val })}
              placeholder="Add Current Work"
              value={this.state.work}
              autoCapitalize="none"
              autoCorrect={false}
              underlineColorAndroid='transparent'
              style={{ marginLeft: '2%', color: 'grey' }}
            />
          </View>
        </View>
        <View style={styles.editbioView}>
          <Text style={styles.about}>
            Company
          </Text>
          <View style={styles.inputView}>
            <TextInput
              onChangeText={val => this.setState({ place: val })}
              placeholder="Add Company"
              value={this.state.place}
              autoCapitalize="none"
              autoCorrect={false}
              underlineColorAndroid='transparent'
              style={{ marginLeft: '2%', color: 'grey' }}
            />
          </View>
        </View>
        <View style={styles.editbioView}>
          <Text style={styles.about}>
            School
          </Text>
          <View style={styles.inputView}>
            <TextInput
              onChangeText={val => this.setState({ school: val })}
              placeholder="Add School"
              value={this.state.school}
              autoCapitalize="none"
              autoCorrect={false}
              underlineColorAndroid='transparent'
              style={{ marginLeft: '2%', color: 'grey' }}
            />
          </View>
        </View>
        <View style={styles.editbioView}>
          <Text style={styles.about}>
            Sex
          </Text>
          <View style={styles.inputView}>
            <View style={{ flexDirection: 'row', marginLeft: '26%' }}>
              <Text style={{ fontSize: 20, color: '#444242' }}>
                Male
              </Text>
              <CheckBox
                value={this.state.male}
                onChange={() => this.checkBoxTest('male')} />
              <Text style={{ fontSize: 20, color: '#444242' }}>
                Female
              </Text >
              <CheckBox
                value={this.state.female}
                onChange={() => this.checkBoxTest('female')} />

            </View>
          </View>
        </View>
        <View style={styles.big}>
        </View>
      </ScrollView>

    );
  }

  componentWillMount() {
    this.setState({ isLoading: true });
    this.getToken('token');
    this.getInfo();
  }

  componentWillUnmount() {
    this.getBase64FromImg();
    this.setState({ isLoading: true });
  }

  checkBoxTest(gender) {

    switch (gender) {
      case 'male': {
        this.setState({ male: !this.state.male }, function () {
          if (this.state.male == true) {
            this.setState({ female: false });
            this.setState({ gender: 'male' });
          }
        });
        break;
      }
      case 'female': {
        this.setState({ female: !this.state.female }, function () {
          if (this.state.female == true) {
            this.setState({ male: false });
            this.setState({ gender: 'female' });
          }
        });
        break;
      }
    }
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
      }, function () {

        this.setState({
          NameCheck: this.state.Name,
          ageCheck: this.state.Age,
          genderCheck: this.state.gender,
          bioCheck: this.state.bio,
          workCheck: this.state.work,
          placeCheck: this.state.place,
          schoolCheck: this.state.school
        });

      });

      if (await AsyncStorage.getItem('@MySuperStore:gender') == 'male') {
        this.setState({ male: true })
      }
      else if (await AsyncStorage.getItem('@MySuperStore:gender') == 'female') {
        this.setState({ female: true });
      }
      if (this.state.imageURL == null || this.state.imageURL == 'deleted' || this.state.imageURL == 'data:image/jpg;base64,null' || this.state.imageURL == 'data:image/jpg;base64,deleted') {
        this.setState({ imageURL: 'http://www.pocketbi.es/wp-content/uploads/2017/10/facebook-anonymous-app.jpg' });
      }
      this.setState({ isLoading: false });
    } catch (error) {
      console.log("Error retrieving data" + error);
      this.setState({ isLoading: false });
    }
  }

  _checkPermissions = async () => {
    const { status } = await Permissions.getAsync(Permissions.CAMERA);
    this.setState({ status });

    const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ cameraPermission: cameraPermission.status });
  };


  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync();

    console.log(result);
    if (!result.cancelled) {
      this.setState({ imageReady: true });
      this.setState({ imageURL: result.uri });
      //CameraRoll.saveToCameraRoll(result.uri);

    }
  };

  deleteImage() {
    this.imageSvUpload('deleted');
    this.setState({ imageURL: 'http://www.pocketbi.es/wp-content/uploads/2017/10/facebook-anonymous-app.jpg' });
    AsyncStorage.removeItem('@MySuperStore:base64');

  }


  getBase64FromImg() {
    console.log(this.state.imageReady);
    if (this.state.imageReady == true) {
      Image.getSize(this.state.imageURL, (width, height) => {
        var imageSize = {
          size: {
            width,
            height
          },
          offset: {
            x: 0,
            y: 0,
          },
        };
        ImageEditor.cropImage(this.state.imageURL, imageSize, (imageURI) => {
          console.log(this.state.imageURL);
          ImageStore.getBase64ForTag(this.state.imageURL, (base64Data) => {
            this.imageSvUpload(base64Data);
            //ImageStore.removeImageForTag(imageURI);
          }, (reason) => console.log(reason))
        }, (reason) => console.log(reason))
      }, (reason) => console.log(reason))
    }
    else {
      if (this.state.Name != this.state.NameCheck || this.state.Age != this.state.ageCheck || this.state.gender != this.state.genderCheck
        || this.state.bio != this.state.bioCheck || this.state.work != this.state.workCheck || this.state.place != this.state.placeCheck
        || this.state.school != this.state.schoolCheck) {

        this.uploadInfo();
      }
    }
  }

  imageSvUpload(base64Data) {
    const { navigate } = this.props.navigation;
    if (!base64Data == '') {
      fetch('http://8d71766e66bc.ngrok.io/api/auth/updatePicture', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.state.token
        },
        body: JSON.stringify({
          picture: base64Data,
        }),
      }).then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          console.log(base64Data);
          if (responseJson.Success == "Picture Changed") {
            this.uploadInfo();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }


  uploadInfo = () => {
    fetch('http://8d71766e66bc.ngrok.io/api/auth/updateInfo', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.state.token
      },
      body: JSON.stringify({
        bio: this.state.bio,
        work: this.state.work,
        place: this.state.place,
        school: this.state.school,
        gender: this.state.gender,
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.props.navigation.state.params.refresh();
      })
      .catch((error) => {
        console.log(error);
      });
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