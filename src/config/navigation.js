import React, { Component } from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import { Ionicons, MaterialIcons, EvilIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View, Image } from 'react-native';
import {
  Icon,
  Button,
  Container,
  Header,
  Content,
  Left,
  Body,
  Right,
} from 'native-base';
import { Easing, Animated } from 'react-native';
import firebase from 'firebase/app';

import HomeScreen from '../screens/Home';
import AuthScreen from '../screens/Auth';
import AllRobHistories from '../screens/allRobHistory';

const logoutHandler = async (props) => {
  try {
    await firebase.auth().signOut();
    props.navigation.navigate('Auth');
  } catch (error) {
    console.log(error);
  }
};
const CustomDrawerContentComponent = (props) => (
  <Container>
    <Header
      style={{
        height: 220,
        backgroundColor: '#333846',
        shadowOffset: { height: 0, width: 0 },
        shadowOpacity: 0,
        elevation: 0,
      }}
    >
      <Body style={{ justifyContent: 'center', alignItems: 'center' }}>
        <View>
          <Image
            style={styles.drawerImage}
            source={{ uri: props.navigation.state.params.userProfile }}
          />
        </View>
        <View
          style={{
            marginTop: 10,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'ralewayRegular',
              color: '#fff',
            }}
          >
            {props.navigation.state.params.Name}
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'ralewayRegular',
              color: '#5d616f',
              marginTop: 3,
            }}
          >
            Mobile#: {props.navigation.state.params.deviceinfo}
          </Text>
          <Button
            warning
            style={styles.btn}
            onPress={() => logoutHandler(props)}
          >
            <Text>Logout</Text>
          </Button>
        </View>
      </Body>
    </Header>
    <Content style={{ backgroundColor: '#333846' }}>
      <DrawerItems
        iconContainerStyle={{ opacity: 1, fontFamily: 'ralewayRegular' }}
        {...props}
      />
    </Content>
  </Container>
);

const MyDrawerNavigator = createDrawerNavigator(
  {
    Home: { screen: HomeScreen },
    AllRobHistories: {
      screen: AllRobHistories,
    },
  },
  {
    contentOptions: {
      activeTintColor: '#F2AA4CFF',
      activeBackgroundColor: 'rgba(0,0,0,0)',
      inactiveBackgroundColor: 'rgba(0,0,0,0)',
      inactiveTintColor: '#fff',
      style: {
        marginVertical: 0,
      },
      labelStyle: {
        fontWeight: 'normal',
        fontFamily: 'ralewayRegular',
        backgroundColor: 'transparent',
      },
    },
    contentComponent: CustomDrawerContentComponent,
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    drawerBackgroundColor: '#333846',
  }
);

const TransitionConfiguration = () => {
  return {
    transitionSpec: {
      duration: 750,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: (sceneProps) => {
      const { layout, position, scene } = sceneProps;
      const width = layout.initWidth;
      const { index, route } = scene;
      const params = route.params || {}; // <- That's new
      const transition = params.transition || 'default'; // <- That's new
      return {
        collapseExpand: CollapseExpand(index, position),
        default: SlideFromRight(index, position, width),
      }[transition];
    },
  };
};

let SlideFromRight = (index, position, width) => {
  const inputRange = [index - 1, index, index + 1];
  const translateX = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [width, 0, 0],
  });
  const slideFromRight = { transform: [{ translateX }] };
  return slideFromRight;
};
let CollapseExpand = (index, position) => {
  const inputRange = [index - 1, index, index + 1];
  const opacity = position.interpolate({
    inputRange,
    outputRange: [0, 1, 1],
  });

  const scaleY = position.interpolate({
    inputRange,
    outputRange: [0, 1, 1],
  });

  return {
    opacity,
    transform: [{ scaleY }],
  };
};

const HomeNavigation = createStackNavigator(
  {
    Auth: { screen: AuthScreen },
    CrimeInfo: { screen: MyDrawerNavigator },
  },
  {
    initialRouteName: 'Auth',
    header: null,
    headerMode: 'none',
    mode: 'modal',
    cardStyle: { backgroundColor: '#333846' },
    transitionConfig: TransitionConfiguration,
  }
);

const styles = StyleSheet.create({
  drawerImage: {
    height: 90,
    width: 90,
    borderRadius: 75,
  },
  btn: {
    width: 80,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 15,
  },
});

export default createAppContainer(HomeNavigation);
