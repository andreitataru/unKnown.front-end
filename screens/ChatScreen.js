import React from 'react';
import { ScrollView, Text, AsyncStorage, Alert, View } from 'react-native';
import { List, ListItem, Header } from 'react-native-elements'

export default class ChatScreen extends React.Component {

  static navigationOptions = {
    header: null,
  };

  state = {
    token: '',
    list: [],
    myId: '',
    Matches: true,
  };

  render() {
    return (
      <ScrollView>
        <Header
          statusBarProps={{ barStyle: 'light-content' }}
          centerComponent={{ text: 'Matches', style: { color: '#fff', fontSize: 30, alignSelf: 'center' } }}
          outerContainerStyles={{ backgroundColor: '#18ee94' }}
        />
        {this.state.Matches &&
          <View style={{ flex: 1, height: 600 }}>
            <Text style={styles.Matches1}>
              You have no matches yet
          </Text>
            <Text style={styles.Matches2}>
              Like more people to get more matches
          </Text>
          </View>
        }
        <List containerStyle={{ marginBottom: 20, marginTop: -1 }}>
          {
            this.state.list.map((l, i) => (
              <ListItem
                roundAvatar
                avatar={{ uri: `data:image/jpg;base64,${l[0].picture}` }}
                key={i}
                title={l[0].name}
                onPress={(e) => { this.do(l.idMatch, l[0].picture, l[0].name, l[0].id, l.created_at) }}
                onLongPress={(e) => { this.test(l.idMatch, l[0].id) }}
              />
            ))
          }
        </List>
      </ScrollView>
    );
  }
  test(idMatch, targetId) {
    Alert.alert(
      'Delete Match',
      'You want to delete this match?',
      [
        { text: 'Yes', onPress: () => this.deleteMatch(idMatch, targetId) },
        { text: 'No' },
      ],
      { cancelable: false }
    )
  }

  deleteMatch(idMatch, targetId) {
    fetch('http://e1f63cbbbe63.ngrok.io/api/auth/DeleteMatch', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.state.token
      },
      body: JSON.stringify({
        IdMatch: idMatch,
        TargetId: targetId,
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({ isLoading: false });
        this.refreshMatch();
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        console.log(error);
      });
  }

  do(value, picture, name, id, created_at) {
    console.log(created_at);
    console.log('ok:', value);
    const { navigate } = this.props.navigation;
    console.log(picture);
    navigate('Message', { IdMatch: value, token: this.state.token, myId: this.state.myId, picture: picture, name: name, id: id, created_at: created_at });
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    this.getToken('token');
  }


  async getToken(key) {
    try {

      const value = await AsyncStorage.getItem('@MySuperStore:' + key);
      this.setState({ token: value }, function () {
        fetch('http://e1f63cbbbe63.ngrok.io/api/auth/getMatches', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.state.token
          }
        }).then((response) => response.json())
          .then((responseJson) => {
            this.setState({ list: [] });
            for (let i = 0; i < responseJson.length; i++) {
              this.state.list.push(responseJson[i]);
            }
            this.setState({ isLoading: false });
            this.refreshMatch();
          })
          .catch((error) => {
            this.setState({ isLoading: false });
            console.log(error);
          });
      });

    } catch (error) {
      console.log("Error retrieving data" + error);
    }
  }

  getMatches() {
    fetch('http://e1f63cbbbe63.ngrok.io/api/auth/getMatches', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.state.token
      }
    }).then((response) => response.json())
      .then((responseJson) => {
        this.setState({ list: [] });
        for (let i = 0; i < responseJson.length; i++) {
          this.state.list.push(responseJson[i]);
        }
        this.setState({ isLoading: false });
        this.getMyId();
        console.log(this.state.list.length);
        if (this.state.list.length == 0) {
          this.setState({ Matches: true });
        }
        else {
          this.setState({ Matches: false });
        }
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        console.log(error);
      });
  }

  getMyId() {
    fetch('http://e1f63cbbbe63.ngrok.io/api/auth/GetMyId', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.state.token
      }
    }).then((response) => response.json())
      .then((responseJson) => {
        this.setState({ myId: responseJson });
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        console.log(error);
      });
  }

  refreshMatch() {
    this.getMatches();

    setTimeout(function () {
      this.refreshMatch();
    }.bind(this), 40000);
  }
}


