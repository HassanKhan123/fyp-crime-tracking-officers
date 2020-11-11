import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ImageBackground,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
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
import {
  AntDesign,
  MaterialIcons,
  FontAwesome,
  Feather,
  Fontisto,
} from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Font from 'expo-font';
import * as firebase from 'firebase';
import { Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import MapView, { Marker } from 'react-native-maps';
import moment from 'moment';
import { NavigationEvents } from 'react-navigation';

import fire from '../config/firebase';

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

class allRobHistory extends Component {
  static navigationOptions = {
    header: null,
    drawerLabel: 'News Feed',
    drawerIcon: ({ tintColor }) => (
      <Feather name='align-justify' size={24} color={tintColor} />
    ),
  };
  constructor(props) {
    super(props);
    this.state = {
      isMapReady: false,
      fontLoaded: false,
      marker_lat: 24.8822179,
      marker_long: 67.0652013,
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      limit: 2,
      contentOffsetY: 0,
      infoArray: [],
      modalVisible: false,
      loading: true,
      officerName: '',
      officerID: '',
    };
  }
  fetchData() {
    console.log('fetch run');
    // let infoArray = [];
    // this.setState({ infoArray: [] });
    // fire
    //   .firestore()
    //   .collection('allAlerts')
    //   .onSnapshot((snap) => {
    //     snap.forEach((doc) => {
    //       console.log(doc.id);
    //       let snapShot = doc.data();

    //       let userkey = doc.id;

    //       let ProfileURL = snapShot.ProfileURL;
    //       let userName = snapShot.userName;
    //       let createdAt = snapShot.createdAt.toDate();
    //       let userId = snapShot.UserId;
    //       let time = moment(createdAt).format('MMMM Do YYYY, h:mm A');
    //       let time2 = moment(createdAt).format('MMM D, YYYY, h:mm A');

    //       let description = snapShot.ReportDesc;
    //       let acknowledgedData = snapShot.acknowledged;
    //       let street, city, marker_lat, marker_long, name;
    //       if (snapShot.location) {
    //         street = snapShot.location.regionName[0].street;
    //         city = snapShot.location.regionName[0].city;
    //         name = snapShot.location.regionName[0].name;
    //         marker_lat = snapShot.location.marker_lat;
    //         marker_long = snapShot.location.marker_long;
    //       }
    //       let region = {
    //         latitude: marker_lat,
    //         longitude: marker_long,
    //         latitudeDelta: 0.03,
    //         longitudeDelta: 0.02,
    //       };
    //       let crimeDetail = {
    //         street,
    //         city,
    //         name,
    //         ProfileURL,
    //         userName,
    //         time,
    //         time2,

    //         marker_lat,
    //         marker_long,
    //         region,
    //         userkey,
    //         description,

    //         userId,
    //         acknowledgedData,
    //       };
    //       infoArray.push(crimeDetail);
    //       this.setState({ infoArray, loading: false });
    //     });
    //     console.log('s====', infoArray.length);
    //   });
  }

  async componentDidMount() {
    try {
      await Font.loadAsync({
        ralewayRegular: require('../assets/fonts/Raleway-Regular.ttf'),
      });
      // this.setState({ infoArray: [] }, () => {
      //   this.fetchData();
      // });

      this.setState({ infoArray: [] });
      fire
        .firestore()
        .collection('allAlerts')
        .onSnapshot((snap) => {
          let infoArray = [];
          snap.forEach((doc) => {
            // console.log(doc.id);
            let snapShot = doc.data();

            let userkey = doc.id;

            let ProfileURL = snapShot.ProfileURL;
            let userName = snapShot.userName;
            let createdAt = snapShot.createdAt.toDate();
            let userId = snapShot.UserId;
            let time = moment(createdAt).format('MMMM Do YYYY, h:mm A');
            let time2 = moment(createdAt).format('MMM D, YYYY, h:mm A');

            let description = snapShot.ReportDesc;
            let acknowledgedData = snapShot.acknowledged;
            let street, city, marker_lat, marker_long, name;
            if (snapShot.location) {
              street = snapShot.location.regionName[0].street;
              city = snapShot.location.regionName[0].city;
              name = snapShot.location.regionName[0].name;
              marker_lat = snapShot.location.marker_lat;
              marker_long = snapShot.location.marker_long;
            }
            let region = {
              latitude: marker_lat,
              longitude: marker_long,
              latitudeDelta: 0.03,
              longitudeDelta: 0.02,
            };
            let crimeDetail = {
              street,
              city,
              name,
              ProfileURL,
              userName,
              time,
              time2,

              marker_lat,
              marker_long,
              region,
              userkey,
              description,

              userId,
              acknowledgedData,
            };
            infoArray.push(crimeDetail);
          });
          this.setState({ infoArray, loading: false });
          console.log('s====', infoArray.length);
        });

      this.setState({ fontLoaded: true });
      firebase.auth().onAuthStateChanged((user) => {
        if (user != null) {
          fire
            .firestore()
            .collection('Officers')
            .doc(user.uid)
            .get()
            .then((user) => {
              let snapShot = user.data();
              this.setState({
                officerName: snapShot.userName,
                officerID: snapShot.UserId,
              });
            });
        } else {
          this.setState({ loading: false });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  onMapLayout = () => {
    this.setState({ isMapReady: true });
  };

  handleScroll = (e) => {
    // var contentOffset = e.nativeEvent.contentOffset.y;
    // this.state.contentOffsetY < contentOffset ? //("Scroll Down") : //("Scroll Up");
    // this.setState({ contentOffsetY: contentOffset });
    var windowHeight = Dimensions.get('window').height,
      height = e.nativeEvent.contentSize.height,
      offset = e.nativeEvent.contentOffset.y;
    if (windowHeight + offset >= height) {
      //('End Scroll')
      this.loadMore();
    }
  };

  loadMore() {
    //('loadmore ==>')
    this.setState({
      limit: this.state.limit + 2,
    });
  }
  modal = () => {
    this.setState({ modalVisible: true });
  };
  acknowledgeCrime = async (postId) => {
    const { officerName, officerID } = this.state;
    console.log(postId, officerID, officerName);
    try {
      fire
        .firestore()
        .collection('allAlerts')
        .doc(postId)
        .set(
          {
            acknowledged: {
              acknowledgedById: officerID,
              acknowledgedByName: officerName,
              acknowledgedStatus: true,
              acknowledgedAt: firebase.firestore.FieldValue.serverTimestamp(),
            },
          },
          { merge: true }
        );
      // this.setState({ infoArray: [] });
      // this.fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    // //('infoArray---->', this.state.infoArray)
    //('render==========>')
    const { limit, loading, infoArray } = this.state;
    // const temp = [...this.state.infoArray];

    // //('List============================', temp.length)
    // temp.length = limit;
    // //('List--------------------->0', temp)
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
        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator />
          </View>
        ) : (
          <View
            onScroll={this.handleScroll}
            style={{
              backgroundColor: '#eee',
              paddingLeft: 7,
              paddingRight: 7,
              flex: 1,
            }}
          >
            <ScrollView
              onScroll={this.handleScroll}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 30 }}
              showsVerticalScrollIndicator={true}
            >
              {infoArray.map((mark, index) => (
                <View style={styles.card} key={index}>
                  <View style={{ padding: 10, flexDirection: 'row' }}>
                    <View>
                      <Image
                        style={{
                          height: 50,
                          width: 50,
                          borderRadius: 75,
                        }}
                        source={{ uri: mark.ProfileURL }}
                      />
                    </View>
                    <View style={{ justifyContent: 'center', marginLeft: 4 }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontFamily: 'ralewayRegular',
                          color: '#333846',
                          fontWeight: 'bold',
                        }}
                      >
                        {mark.userName}
                      </Text>
                      <View style={{ flexDirection: 'row', marginTop: 4 }}>
                        <AntDesign
                          name='clockcircleo'
                          size={12}
                          color='#5d616f'
                        />
                        <Text
                          style={{
                            fontSize: 11,
                            fontFamily: 'ralewayRegular',
                            color: '#5d616f',
                            paddingBottom: 3,
                            paddingLeft: 2,
                          }}
                        >
                          {mark.time}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 4 }}
                  >
                    <View style={{ flexDirection: 'row' }}>
                      <Text
                        style={{
                          color: '#5d616f',
                          fontSize: 12,
                          justifyContent: 'flex-start',
                          fontFamily: 'ralewayRegular',
                          paddingLeft: 1,
                          paddingBottom: 4,
                        }}
                      >
                        •{mark.street !== null ? mark.street : mark.name},
                        {mark.city} •
                      </Text>
                      <Fontisto name='earth' size={13} color='#5d616f' />
                    </View>
                    {mark.description && mark.description.description ? (
                      <View style={{ paddingTop: 4, paddingBottom: 10 }}>
                        <Text
                          style={{
                            fontSize: 15,
                            paddingTop: 4,
                            fontFamily: 'ralewayRegular',
                            textAlign: 'justify',
                          }}
                        >
                          {mark.description.description}
                        </Text>
                      </View>
                    ) : (
                      <View style={{ paddingBottom: 4 }}></View>
                    )}
                  </View>
                  <View style={styles.container}>
                    <MapView
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: 200,
                      }}
                      ref={(map) => {
                        this.map = map;
                      }}
                      region={{
                        latitude: mark.marker_lat,
                        longitude: mark.marker_long,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      }}
                      initialRegion={mark.region}
                      customMapStyle={mapStyle}
                      followUserLocation={true}
                      zoomEnabled={true}
                      onLayout={this.onMapLayout}
                    >
                      {this.state.isMapReady && (
                        <Marker
                          ref={(marker) => {
                            this.marker = marker;
                          }}
                          coordinate={{
                            latitude: mark.marker_lat,
                            longitude: mark.marker_long,
                          }}
                          title={'Current Location'}
                        />
                      )}
                    </MapView>
                  </View>
                  <View
                    style={{
                      padding: 10,
                      paddingTop: 15,
                      paddingBottom: 15,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    {mark.acknowledgedData.acknowledgedStatus ? (
                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          alignItems: 'space-between',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Text>
                          Acknowledged By{' '}
                          {mark.acknowledgedData.acknowledgedByName}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <Button
                        dark
                        style={{
                          padding: 20,
                          borderRadius: 10,
                        }}
                        onPress={() => this.acknowledgeCrime(mark.userkey)}
                      >
                        <Text style={{ color: 'white' }}>
                          Acknowledged Now!
                        </Text>
                      </Button>
                    )}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    left: '47%',
  },
  container: {
    zIndex: -1, //...StyleSheet.absoluteFill,
    height: 200,
  },
  card: {
    backgroundColor: '#fff',
    shadowOffset: { width: 10, height: 10 },
    elevation: 2,
    shadowColor: '#ccc',
    shadowOpacity: 1.0,
    borderRadius: 1,
    marginTop: 15,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default allRobHistory;
