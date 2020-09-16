import React from 'react';
import {
  Button, View, Image, Text, CameraRoll, TouchableOpacity,
  ImageStore, ImageEditor, ActivityIndicator, Alert, AsyncStorage
} from 'react-native';
import { ImagePicker, Permissions } from 'expo';

import { Card, Icon } from 'react-native-elements';

export default class ImagePickerExample extends React.Component {
  static navigationOptions = {
    title: 'Profile Picture',
    headerStyle: { backgroundColor: '#18e794' },
    headerTitleStyle: { color: 'white' },
    headerTintColor: 'white'
  }
  state = {
    imageURL: 'http://www.pocketbi.es/wp-content/uploads/2017/10/facebook-anonymous-app.jpg',
    isLoading: false,
    token: '',
    imageReady: false,
  };

  render() {

    return (
      <View style={styles.container}>
        <View style={styles.containerWithAlign}>
          <Card containerStyle={{ width: '85%', height: '70%' }} title="Picture">
            <View>
              <Image
                style={styles.picture}
                resizeMode="cover"
                source={{ uri: this.state.imageURL }}
              />
            </View>
          </Card>
        </View>
        <View style={styles.ButtonCamera}>
          <TouchableOpacity onPress={this.pickImage.bind(this)}>
            <View style={styles.touchableLogin}>
              <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: '8%', fontSize: 18 }}>
                Camera Roll
                </Text>
              <Icon
                name='photo-camera'
                type='MaterialIcons'
                color='#444242'
                size={26}
                marginLeft='8%'
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.Button}>
          <TouchableOpacity onPress={this.getBase64FromImg.bind(this)}>
            <View style={styles.touchableCameraN}>
              <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: '8%', fontSize: 18 }}>
                Finish
                </Text>
              <Icon
                name='cloud-upload'
                type='MaterialIcons'
                color='#444242'
                size={26}
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

  getBase64FromImg() {
    if (this.state.imageReady) {
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
            console.log(base64Data);
            //ImageStore.removeImageForTag(imageURI);
          }, (reason) => console.log(reason))
        }, (reason) => console.log(reason))
      }, (reason) => console.log(reason))
    }
    else {
      Alert.alert(
        'Error',
        'Select a picture',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false }
      )
    }


  }

  imageSvUpload(base64Data) {
    const { navigate } = this.props.navigation;
    if (!base64Data == '') {
      this.setState({ isLoading: true }, function () {
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
            let obj = responseJson;
            if (obj.Success == "Picture Changed") {
              this.setState({ isLoading: false });
              this.saveToken(this.state.token);
              navigate('MainApp');
              console.log('ok :D');
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
        'Error idk',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false }
      )
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
      console.log(this.state.imageURL);

    }
  };

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
