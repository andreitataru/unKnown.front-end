import React from 'react';
import { ScrollView, StyleSheet, View, Text, Dimensions, ActivityIndicator, AsyncStorage, Slider } from 'react-native';
import { Constants, MapView, Location, Permissions } from 'expo';

export default class MapScreen extends React.Component {

  static navigationOptions = {
    header: null,
  };

  state = {
    value: 0.008,
    inputValue: 0,
    locationResult: null,
    location: { coords: { latitude: 0, longitude: 0 } },
    latitudeDelta: 0.008,
    longitudeDelta: 0.008,
    isLoading: false,
    Name: '',
    token: '',
    markers1: [],
    markers: [],

  };

  componentWillMount() {
    this.getInfo();
  }

  handleTextChange(value) {
    this.setState({ inputValue: value });
    this.setState({ latitudeDelta: value, longitudeDelta: value });
  };

  refreshLocation() {
    console.log(this.state.markers);
    this._getLocationAsync();
    this.getUsersClose();

    setTimeout(function () {
      this.refreshLocation();
    }.bind(this), 20000);
  }


  componentDidMount() {
    this._getLocationAsync();
    this.getUsersClose();
    this.refreshLocation();
  }



  _handleMapRegionChange = mapRegion => {
    this.setState({ location: this.state.location });

    if (mapRegion.longitudeDelta > 0.009 || mapRegion.latitudeDelta > 0.010) {
      this.setState({ latitudeDelta: 0.008, longitudeDelta: 0.008 });
    }

  };

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {

    }
    if (status == 'granted') {
      let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
      this.setState({ locationResult: JSON.stringify(location), location, }, function () {
        this.updatePosition();
      });
    }



  };

  getUsersClose = () => {
    fetch('http://8d71766e66bc.ngrok.io/api/auth/getUsersClose', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.state.token
      }
    }).then((response) => response.json())
      .then((responseJson) => {
        this.setState({ markers1: [] });
        let obj = responseJson.Success;
        if (obj != [] && obj != undefined) {
          for (let user of obj) {
            let coordinates = { latitude: parseFloat(user.latitude), longitude: parseFloat(user.longitude) };
            let userObj = { id: Number(user.id), name: user.name, coordinates };
            this.state.markers1.push(userObj);
          }
          this.setState({ markers: this.state.markers1 });
        }
        else {
          this.setState({ markers: [] });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={{
            latitude: this.state.location.coords.latitude, longitude: this.state.location.coords.longitude,
            latitudeDelta: this.state.latitudeDelta, longitudeDelta: this.state.longitudeDelta
          }}
          onRegionChange={this._handleMapRegionChange}
        >
          <MapView.Marker
            coordinate={this.state.location.coords}
            title={'You are here'}
            image={require('./../assets/images/pin.png')}
          />
          {this.state.markers.map(marker => (
            <MapView.Marker
              coordinate={marker.coordinates}
              image={require('./../assets/images/pin.png')}
              title={marker.name}
              onPress={(e) => { e.stopPropagation(); this.markerPressed(marker) }}
            />
          ))}
        </MapView>
        <Slider
          style={{ alignSelf: 'stretch' }}
          value={this.state.value}
          onValueChange={value => this.handleTextChange(value)}
          maximumValue={0.008}
        />
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

  async getToken(key) {
    try {

      const value = await AsyncStorage.getItem('@MySuperStore:' + key);
      this.setState({ token: value });

    } catch (error) {
      console.log("Error retrieving data" + error);
    }
  }

  markerPressed(marker) {
    const { navigate } = this.props.navigation;
    console.log(marker);
    navigate('PublicProfile', { id: marker.id, token: this.state.token, canLike: true });
  }

  updatePosition = () => {
    console.log(this.state.location.coords.latitude);
    console.log(this.state.location.coords.longitude);
    fetch('http://8d71766e66bc.ngrok.io/api/auth/updatePosition', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.state.token
      },
      body: JSON.stringify({
        latitude: this.state.location.coords.latitude,
        longitude: this.state.location.coords.longitude,
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
      })
      .catch((error) => {
        console.log(error);
      });
  }


  async getInfo() {
    this.setState({ isLoading: true });
    try {
      this.setState({
        Name: await AsyncStorage.getItem('@MySuperStore:name'),
        token: await AsyncStorage.getItem('@MySuperStore:token')
      });
      this.setState({ isLoading: false });
    } catch (error) {
      console.log("Error retrieving data" + error);
      this.setState({ isLoading: false });
    }
  }

}

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  map: {
    flex: 1,
    width,
    height
  },
});
