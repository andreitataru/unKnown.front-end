import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabNavigator, TabBarBottom } from 'react-navigation';

import Colors from '../constants/Colors';

import ProfileScreen from '../screens/ProfileScreen';
import MapScreen from '../screens/MapScreen';
import ChatScreen from '../screens/ChatScreen';

export default TabNavigator(
  {
    Profile: {
      screen: ProfileScreen,
    },
    Map: {
      screen: MapScreen,
    },
    Chat: {
      screen: ChatScreen,
    },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case 'Profile':
            iconName = Platform.OS === 'ios' ? `ios-person${focused ? '' : '-outline'}` : 'md-person';
            break;
          case 'Map':
            iconName = Platform.OS === 'ios' ? `ios-pin${focused ? '' : '-outline'}` : 'md-pin';
            break;
          case 'Chat':
            iconName = Platform.OS === 'ios' ? `ios-chatbubbles${focused ? '' : '-outline'}` : 'md-chatboxes';
        }
        return (
          <Ionicons
            name={iconName}
            size={40}
            color={focused ? Color = '#18ee94' : Color = '#444242'}
          />
        );
      },
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'top',
    animationEnabled: true,
    swipeEnabled: true,
    tabBarOptions: {
      showLabel: false
    },
  }
);
