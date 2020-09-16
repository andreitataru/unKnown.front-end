import { Notifications } from 'expo';
import React from 'react';
import { StackNavigator } from 'react-navigation';
import { SimpleApp } from 'App';
import MainTabNavigator from './MainTabNavigator';

const RootStackNavigator = StackNavigator(
  {
    Main: {
      screen: MainTabNavigator,
    },
  },
);

export default class RootNavigator extends React.Component {

  render() {
    return <RootStackNavigator />;
  }

}
