import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Dimensions,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  ToastAndroid,
  Alert,
  TouchableHighlight,
  Image,
} from 'react-native';
import {
  Icon,
  Button,
  Container,
  Header,
  Content,
  Left,
  Body,
  Right,
  Card,
  CardItem,
} from 'native-base';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Entypo, MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import * as Font from 'expo-font';
import MapView, { Marker } from 'react-native-maps';
import { TouchableOpacity } from 'react-native-gesture-handler';
import fire from '../config/firebase';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import * as firebase from 'firebase';
// import Modal from "react-native-modal";

import { YellowBox } from 'react-native';
import _ from 'lodash';

YellowBox.ignoreWarnings(['Warning: google places autocomplete']);

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;

const mapStyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#242f3e',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#746855',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#242f3e',
      },
    ],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#263c3f',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#6b9a76',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#38414e',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#212a37',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9ca5b3',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#746855',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#1f2835',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#f3d19c',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [
      {
        color: '#2f3948',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#17263c',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#515c6d',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#17263c',
      },
    ],
  },
];

const Toast = (props) => {
  if (props.visible) {
    ToastAndroid.showWithGravityAndOffset(
      props.message,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
    return null;
  }
  return null;
};

class HomeScreen extends Component {
  static navigationOptions = {
    header: null,
    drawerLabel: 'Home',
    drawerIcon: ({ tintColor }) => (
      <MaterialIcons name='home' size={24} color={tintColor} />
    ),
  };
  constructor(props) {
    super(props);
    this.state = {
      marker_lat: 24.8822179,
      marker_long: 67.0652013,
      hasCameraPermission: null,
      location: null,
      region: null,
      errorMessage: null,
      regionName: [],
      expoToken: '',
      fontLoaded: false,
      visible: false,
      userName: '',
      UserToken: '',
      UserId: '',
      ProfileURL: '',
      deviceInfo: '',
      visiblemodal: true,
      markers: [],
      placemarkers: [],
      isModalVisible: true,
      userKey: '',
      allKey: '',
      locationcity: '',
      locationStreet: '',
      locationcoords: [],
      visible: true,
    };
    this._getLocationAsync = this._getLocationAsync.bind(this);
    this.onMapRegionChange = this.onMapRegionChange.bind(this);
    this._onLongPressButton = this._onLongPressButton.bind(this);

    this.sendNotification = this.sendNotification.bind(this);
  }

  // _showModal = () => this.setState({ visible: true });
  // _hideModal = () => this.setState({ visible: false });

  registerForPushNotificationAsync = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    let deviceName = this.state.deviceInfo;
    // let alltokens = {
    //     [deviceName]: token
    // }
    let alltokens = [token];

    //('toooken****', token)
    fire
      .firestore()
      .collection('Users')
      .doc(this.state.UserId)
      .set(
        {
          devices: {
            [this.state.deviceInfo]: {
              expoToken: token,
            },
          },
        },
        { merge: true }
      )
      .then(() => {
        fire
          .firestore()
          .collection('ExpoNotifyTokens')
          .doc(this.state.UserId)
          .set({ alltokens });
      });

    this.setState({ expoToken: token });
  };
  async componentDidMount() {
    this.animation.play();
    setTimeout(() => {
      this.setState({
        visible: !this.state.visible,
      });
    }, 5000);

    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage:
          'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }

    await Font.loadAsync({
      ralewayRegular: require('../assets/fonts/Raleway-Regular.ttf'),
    });
    console.log(
      'aaa=========',
      this.props.navigation.state.params.Name,
      this.props.navigation.state.params.userId,
      this.props.navigation.state.params.userProfile,
      this.props.navigation.state.params.UserToken,
      this.props.navigation.state.params.deviceinfo
    );
    const userName = this.props.navigation.state.params.Name;
    const UserId = this.props.navigation.state.params.userId;
    const ProfileURL = this.props.navigation.state.params.userProfile;
    const UserToken = this.props.navigation.state.params.UserToken;
    const deviceInfo = this.props.navigation.state.params.deviceinfo;

    console.log('===', UserId, userName, UserToken, deviceInfo);

    this.setState({
      fontLoaded: true,
      userName,
      UserId,
      ProfileURL,
      UserToken,
      deviceInfo,
    });
    await this.registerForPushNotificationAsync();
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    const region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0922 * ASPECT_RATIO,
    };
    let regionName = await Location.reverseGeocodeAsync({
      longitude: location.coords.longitude,
      latitude: location.coords.latitude,
    });

    this.setState({
      location,
      region,
      marker_lat: location.coords.latitude,
      marker_long: location.coords.longitude,
      regionName,
    });

    this.locationPosition = await Location.watchPositionAsync(
      { timeInterval: 1000, distanceInterval: 0.1 },
      (loc) => {
        this.setState({
          marker_long: loc.coords.longitude,
          marker_lat: loc.coords.latitude,
        });
      }
    );
  };

  onMapRegionChange(region) {
    this.setState({ region });
  }

  handleButtonPress = () => {
    this.setState(
      {
        visible: true,
      },
      () => {
        this.hideToast();
      }
    );
  };

  hideToast = () => {
    this.setState({
      visible: false,
    });
  };

  sendNotification(regionName) {
    console.log(regionName);
    // <ScreenChild navigation={this.props.navigation} />

    const { userName, UserId, ProfileURL, UserToken } = this.state;

    let TokenArr = [];
    let locationcoords = [];
    let locationName;
    let locationcity;
    let locationStreet;
    let locationcountry;
    let locationregion;

    fire
      .firestore()
      .collection('ExpoNotifyTokens')
      .get()
      .then((data) => {
        data.docs.forEach((d) => {
          let tokenData = d.data();
          for (var key in tokenData) {
            TokenArr.push(tokenData[key]);
          }
        });
      })
      .then(() => {
        for (let i = 0; i < TokenArr.length; i++) {
          fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: TokenArr[i],
              body:
                'Criminal activity happened at - ' +
                ' ' +
                `${regionName[0].street || regionName[0].name}` +
                ', ' +
                regionName[0].city,
              sound: 'default',
            }),
          });
        }
        Alert.alert(
          'Notification Generated..',
          'Do you want to put some details now?',
          [
            { text: 'NOW', onPress: this.goToCrimeInfo },

            { text: 'LATER', onPress: this.showCrimeMarkers },
          ],
          { cancelable: false }
        );
      });
  }
  goToCrimeInfo = () => {
    this.props.navigation.navigate('crimeInfo', {
      userId: this.state.UserId,
      Name: this.state.userName,
      userProfile: this.state.ProfileURL,
      UserToken: this.state.UserToken,
      deviceinfo: this.state.deviceInfo,
      userkey: this.state.userKey,
      allKey: this.state.allKey,
    });
    //('crimeinfoo----->')
  };
  showCrimeMarkers = () => {
    let AlertArr = [];
    let placemarkers = [];
    let coordinates = {};
    fire
      .firestore()
      .collection('allAlerts')
      .get()
      .then((data) => {
        data.forEach((d) => {
          let AlertData = d.data();
          if (AlertData.location.marker_lat && AlertData.location.marker_long) {
            let latitude = AlertData.location.marker_lat;
            let longitude = AlertData.location.marker_long;

            coordinates = {
              latitude: latitude,
              longitude: longitude,
            };
            AlertArr.push({ coordinates });
            placemarkers.push(coordinates);
          }
        });
      })
      .then(() => {
        this.setState({
          markers: AlertArr,
          placemarkers,
          isModalVisible: false,
        });
      });
  };

  _onLongPressButton() {
    let userkey;
    let allkey;
    const {
      marker_lat,
      marker_long,
      regionName,
      expoToken,
      userName,
      UserId,
      ProfileURL,
      UserToken,
    } = this.state;

    const userRobNotification = {
      userName,
      UserId,
      ProfileURL,
      UserToken,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      location: {
        marker_lat,
        marker_long,
        regionName,
      },
      description: '',
      comments: [],
      acknowledged: {
        acknowledgedStatus: false,
        acknowledgedById: '',
        acknowledgedByName: '',
      },
    };

    fire
      .firestore()
      .collection('usersAlerts')
      .doc(UserId)
      .collection('userAlerts')
      .add(userRobNotification)
      .then((res) => {
        fire
          .firestore()
          .collection('allAlerts')
          .doc(res.id)
          .set(userRobNotification)
          .then((response) => {
            // allkey = response.key

            //("Rob information has been created");
            this.setState({ userKey: res.id });
            this.sendNotification(regionName);
          });
      })
      .catch((e) => {
        var errorMessage = e.message;
        //(errorMessage);
        console.log(errorMessage);
      });
  }

  // toggleModal = () => {
  //     this.setState({ isModalVisible: !this.state.isModalVisible });
  //   };

  toBack = () => {
    this.setState({ markers: '', isModalVisible: true });
  };

  render() {
    const { visible } = this.state;
    return (
      <Container>
        <Header
          style={{
            backgroundColor: '#333846',
            height: 46,
            fontFamily: 'ralewayRegular',
          }}
        >
          <Left style={{ flex: 1 }}>
            <Icon
              name='ios-menu'
              style={{ color: '#fff' }}
              onPress={() => this.props.navigation.toggleDrawer()}
            />
          </Left>
          <Body style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{}}>
                <MaterialIcons name='my-location' size={28} color='white' />
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'ralewayRegular',
                  color: 'white',
                  letterSpacing: 1.2,
                  paddingTop: 4,
                }}
              >
                CITIZEN
              </Text>
            </View>
          </Body>
          <Right style={{ flex: 1 }} />
        </Header>
        {this.state.visible ? (
          <View style={styles.animationContainer}>
            <LottieView
              ref={(animation) => {
                this.animation = animation;
              }}
              style={{
                width: 140,
                height: 140,
              }}
              source={require('../assets/animation/location.json')}
              // OR find more Lottie files @ https://lottiefiles.com/featured
              // Just click the one you like, place that file in the 'assets' folder to the left, and replace the above 'require' statement
            />
          </View>
        ) : (
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <SafeAreaView
              style={{ flex: 1, backgroundColor: '#fff' }}
              keyboardShouldPersistTaps='always'
            >
              <View style={styles.wrapper}>
                <Toast
                  style={{
                    backgroundColor: '#2d3441BF',
                    borderRadius: 0,
                    color: '#fff',
                    fontFamily: 'ralewayRegular',
                    fontSize: 16,
                  }}
                  visible={this.state.visible}
                  message='Hold on a second.'
                />

                {this.state.markers.length > 0 ? (
                  <MapView
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}
                    ref={(mapRef) =>
                      mapRef === null ? null : mapRef.fitToElements(true)
                    }
                    customMapStyle={mapStyle}
                    followUserLocation={true}
                    zoomEnabled={true}
                    onLayout={() =>
                      this.mapRef.fitToCoordinates(this.state.placemarkers, {
                        edgePadding: {
                          top: 50,
                          right: 10,
                          bottom: 10,
                          left: 10,
                        },
                        animated: false,
                      })
                    }
                  >
                    {this.state.markers.map((mark, index) => (
                      <Marker
                        key={index}
                        ref={(marker) => {
                          this.marker = marker;
                        }}
                        coordinate={mark.coordinates}
                      >
                        {/* <Image source={require('../assets/images/loc.png')} style={{ width: 40, height: 40 }} /> */}
                      </Marker>
                    ))}
                  </MapView>
                ) : (
                  <MapView
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}
                    ref={(map) => {
                      this.map = map;
                    }}
                    region={this.state.region}
                    initialRegion={this.state.region}
                    customMapStyle={mapStyle}
                    followUserLocation={true}
                    zoomEnabled={true}
                  >
                    <Marker
                      ref={(marker) => {
                        this.marker = marker;
                      }}
                      coordinate={{
                        latitude: this.state.marker_lat,
                        longitude: this.state.marker_long,
                      }}
                      title={'Current Location'}
                    />
                  </MapView>
                )}

                {!this.state.isModalVisible && (
                  <View style={{ position: 'absolute', top: 10, left: 10 }}>
                    <TouchableOpacity
                      style={{ flexDirection: 'row' }}
                      onPress={this.toBack}
                    >
                      <Ionicons name='ios-arrow-back' size={22} color='white' />
                      <Text
                        style={{
                          fontFamily: 'ralewayRegular',
                          fontSize: 14,
                          color: 'white',
                          paddingLeft: 7,
                          paddingTop: 4,
                        }}
                      >
                        Back
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                {/* this.state.isModalVisible && <View style={{ position: 'absolute', top: 28, left: 27, width: '85%' }}>
                                <GooglePlacesAutocomplete
                                    placeholder='Search Location...'
                                    minLength={2}
                                    autoFocus={false}
                                    returnKeyType={'default'}
                                    fetchDetails={true}
                                    listViewDisplayed={false}
                                    returnKeyType={'search'}
                                    query={{
                                        // available options: https://developers.google.com/places/web-service/autocomplete

                                        key: 'AIzaSyAGF8cAOPFPIKCZYqxuibF9xx5XD4JBb84',
                                        // key: 'AIzaSyBVFhY3cURPTbAoOnkyAeijkAt2kqRJ2iY',
                                        language: 'en', // language of the results type: '(cities,regions)'
                                        types: '',
                                        components: 'country:pk'
                                        // default: 'geocode'
                                    }}

                                    onPress={async (data, details) => { // 'details' is provided when fetchDetails = true
                                        this.locationPosition.remove();
                                        // //('data--->', data)
                                        // //('Details--->', details.address_components[0].short_name)
                                        let regionName = await Location.reverseGeocodeAsync({ longitude: details.geometry.location.lng, latitude: details.geometry.location.lat, });
                                        regionName[0].street = details.address_components[0].short_name;
                                        this.setState({
                                            marker_lat: details.geometry.location.lat,
                                            marker_long: details.geometry.location.lng,
                                            regionName,

                                            region: {
                                                latitude: details.geometry.location.lat,
                                                longitude: details.geometry.location.lng,
                                                latitudeDelta: 0.0922,
                                                longitudeDelta: 0.0922 * ASPECT_RATIO
                                            }
                                        });
                                    }}
                                    getDefaultValue={() => ''}

                                    styles={{
                                        textInputContainer: {
                                            borderTopWidth: 0,
                                            borderBottomWidth: 0,
                                            paddingLeft: 20,
                                            backgroundColor: '#2d3441',
                                            paddingTop: 0,
                                            elevation: 1,
                                            color: 'white',
                                            height: 50,
                                            fontFamily: 'ralewayRegular'

                                        },
                                        textInput: {
                                            marginLeft: 0,
                                            marginRight: 0,
                                            borderRadius: 0,
                                            height: 40,
                                            color: '#fff',
                                            fontSize: 16,
                                            paddingLeft: 10,
                                            paddingRight: 5,
                                            paddingBottom: 10,

                                            backgroundColor: 'transparent',
                                            fontFamily: 'ralewayRegular'
                                        },
                                        listView: {
                                            // This right here - remove the margin top and click on the first result, that will work.
                                            elevation: 1,
                                            lineHeight: 2,
                                            paddingTop: 1,
                                            paddingBottom: 1,
                                            backgroundColor: '#2d3441BF',
                                            fontFamily: 'ralewayRegular',

                                            color: 'white',
                                            // and the absolute position.

                                        },
                                        description: {
                                            color: "white",
                                            borderTopWidth: 0,
                                            borderBottomWidth: 0,

                                        },
                                        predefinedPlacesDescription: {
                                            color: 'white'
                                        },
                                    }}


                                    currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
                                    currentLocationLabel="Current location"
                                    nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                                    filterReverseGeocodingByTypes={[
                                        'locality',
                                        'sublocality',
                                        // 'administrative_area_level_1',

                                    ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities

                                    debounce={200}
                                    renderLeftButton={() => <MaterialIcons style={{ paddingTop: 15 }} name="my-location" size={20} color="white" />}
                                />

                                </View> */}
                {this.state.isModalVisible && (
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 26,
                      left: 27,
                      width: '85%',
                      backgroundColor: '#333846',
                      padding: 18,
                      elevation: 1,
                    }}
                  >
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ flex: 1 }}>
                        <Text>
                          <Entypo name='direction' size={40} color='#d98e3c' />
                        </Text>
                      </View>
                      {this.state.regionName.length > 0 && (
                        <View style={{ flex: 5, fontFamily: 'ralewayRegular' }}>
                          {this.state.regionName &&
                          this.state.regionName.length > 0 &&
                          this.state.regionName[0] !== undefined &&
                          this.state.regionName[0].street ? (
                            <Text
                              style={{
                                color: 'white',
                                letterSpacing: 1,
                                paddingBottom: 4,
                                fontFamily: 'ralewayRegular',
                                fontSize: 16,
                                textTransform: 'capitalize',
                              }}
                            >
                              {this.state.regionName[0].street}
                            </Text>
                          ) : (
                            <Text
                              style={{
                                color: 'white',
                                letterSpacing: 1,
                                paddingBottom: 4,
                                fontFamily: 'ralewayRegular',
                                fontSize: 16,
                                textTransform: 'capitalize',
                              }}
                            >
                              {this.state.regionName[0].name &&
                                this.state.regionName[0].name}
                            </Text>
                          )}

                          <Text
                            style={{
                              color: '#5d616f',
                              letterSpacing: 1,
                              paddingBottom: 4,
                              fontFamily: 'ralewayRegular',
                              fontSize: 16,
                              textTransform: 'capitalize',
                            }}
                          >
                            {this.state.regionName &&
                              this.state.regionName.length > 0 &&
                              this.state.regionName[0].city +
                                ',' +
                                this.state.regionName[0].country}
                          </Text>
                          <Text
                            style={{
                              color: '#5d616f',
                              letterSpacing: 1,
                              fontFamily: 'ralewayRegular',
                              fontSize: 16,
                              textTransform: 'capitalize',
                            }}
                          >
                            {this.state.regionName &&
                              this.state.regionName.length > 0 &&
                              this.state.regionName[0].region + ','}
                          </Text>
                          {/* <Text style={{color:'#5d616f',letterSpacing : 1, fontFamily: 'ralewayRegular' , fontSize : 14 , textTransform: 'capitalize'}}>latitude: {this.state.marker_lat}</Text>
                                    <Text style={{color:'#5d616f',letterSpacing : 1, fontFamily: 'ralewayRegular' , fontSize : 14 , textTransform: 'capitalize'}}>longitude: {this.state.marker_long}</Text> */}
                          <Text
                            style={{
                              color: '#5d616f',
                              letterSpacing: 1,
                              fontFamily: 'ralewayRegular',
                              fontSize: 14,
                              textTransform: 'capitalize',
                            }}
                          >
                            Coords: {this.state.marker_lat},{' '}
                            {this.state.marker_long}
                          </Text>
                        </View>
                      )}
                    </View>
                    <View
                      style={{
                        justifyContent: 'center',
                        textAlign: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        paddingTop: 8,
                        width: '100%',
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          borderColor: '#5d616f',
                          borderWidth: 1,
                          color: 'white',
                          paddingTop: 10,
                          paddingBottom: 10,
                          paddingLeft: 18,
                          paddingRight: 18,
                          alignItems: 'center',
                          textAlign: 'center',
                        }}
                        onPress={this.handleButtonPress}
                        onLongPress={this._onLongPressButton}
                      >
                        <Text
                          style={{
                            color: 'white',
                            fontFamily: 'ralewayRegular',
                            fontSize: 16,
                            letterSpacing: 1.2,
                          }}
                        >
                          {' '}
                          Robbed{' '}
                          <Feather
                            name='alert-triangle'
                            size={20}
                            color='white'
                          />
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    zIndex: -1, //...StyleSheet.absoluteFill,
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  statusBar: {
    backgroundColor: '#2e363d',
    paddingTop: Constants.statusBarHeight,
  },
  animationContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

export default HomeScreen;
