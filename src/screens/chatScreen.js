import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, View, TextInput, ImageBackground, Image, ScrollView, Alert } from 'react-native';
import { Icon, Button, Container, Header, Content, Left, Body, Right, Card, CardItem, } from 'native-base'
import { AntDesign, MaterialIcons, FontAwesome, Ionicons, Fontisto } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Font from 'expo-font';
import * as firebase from 'firebase';

import fire from '../config/firebase';
import { Dimensions } from 'react-native';
import { NavigationEvents } from 'react-navigation';

import MapView, {
    Marker,
} from 'react-native-maps';
import moment from 'moment'
const mapStyle = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#242f3e"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#746855"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#242f3e"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#d59563"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#d59563"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#263c3f"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#6b9a76"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#38414e"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#212a37"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9ca5b3"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#746855"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#1f2835"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#f3d19c"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#2f3948"
            }
        ]
    },
    {
        "featureType": "transit.station",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#d59563"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#17263c"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#515c6d"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#17263c"
            }
        ]
    }
]


class chatScreen extends Component {
    static navigationOptions = {
        drawerLabel: () => null
    }

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
            comment: '',
            commentsArr: []



        };

    }

    fetchData() {
        const userId = this.props.navigation.getParam('userId')
        const chabi = this.props.navigation.getParam('chabi')
        console.log(userId,chabi)
        // //('userId---->', userId)
        //('chabi-------------------->', chabi)


        let infoArray = []
        let comments = [];
        fire.firestore().collection('usersAlerts').doc(userId).collection('userAlerts').doc(chabi).get()
        .then((snapshot) => {
            let snapShot = snapshot.data()
            // //("snapShot--->", snapShot)

            // //('---->' , snapShot[key].ProfileURL)
            // //('---->' , snapShot[key].userName)
            // //('---->' , snapShot[key].createdAt)
            // //('---->' , snapShot[key].location.marker_lat)
            // //('---->' , snapShot[key].location.regionName[0].city)
            let comments = snapShot.comments;
            // if(comment && comment.length > 0){

            //     comments.push(comment)
            // }


            let street = snapShot.location.regionName[0].street
            let city = snapShot.location.regionName[0].city
            let ProfileURL = snapShot.ProfileURL
            let userName = snapShot.userName
            let createdAt = snapShot.createdAt.toDate();
            //('createdAt', createdAt)
            // let event = new Date(createdAt);
           
            let time = moment(createdAt).format('MMMM Do YYYY, h:mm A')
            let marker_lat = snapShot.location.marker_lat
            let marker_long = snapShot.location.marker_long
            let description = snapShot.ReportDesc
            // let comments = snapShot.comments
            let region = {
                latitude: marker_lat,
                longitude: marker_long,
                latitudeDelta: 0.03,
                longitudeDelta: 0.02,
            }
            let crimeDetail = {
                street,
                city,
                ProfileURL,
                userName,
                time,
                // date,
                comments,
                marker_lat,
                marker_long,
                region,
                chabi,
                description
            }
            infoArray.push(crimeDetail)
            infoArray.reverse()
            this.setState({ infoArray, commentsArr: comments })


        })

    }
   
    componentWillUnmount() {
        this.willFocusSubscription.remove();
    }

    async componentDidMount() {
        await Font.loadAsync({
            'ralewayRegular': require('../assets/fonts/Raleway-Regular.ttf'),
        });
        this.fetchData()
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            () => {
                this.fetchData();
            }
        );
        this.setState({ fontLoaded: true });
    }

    onMapLayout = () => {
        this.setState({ isMapReady: true });
    }

    comment = () => {
        let commentsArr = []
        const userId = this.props.navigation.getParam('userId', 'NO-ID')
        const chabi = this.props.navigation.getParam('chabi', 'NO-ID')
        const ProfileURL = this.props.navigation.getParam('userProfile', 'NO-ID')
        const userName = this.props.navigation.getParam('Name', 'NO-ID')

        const { comment } = this.state;
        //('----->', comment)

        let writeComment = {
            ProfileURL,
            userName,
            comment
        }

        fire.firestore().collection('usersAlerts').doc(userId).collection('userAlerts').doc(chabi).update({
            comments: firebase.firestore.FieldValue.arrayUnion(writeComment)
        })
        .then((res) => {
            fire.firestore().collection('allAlerts').doc(chabi).update({
                comments: firebase.firestore.FieldValue.arrayUnion(writeComment)
               
            })
        })
        .then((response) => {
                //('Comments Successfully Added')
                this.setState({ comment: '' })
                fire.firestore().collection('usersAlerts').doc(userId).collection('userAlerts').doc(chabi)
                .onSnapshot(snapshot => {
                    let data = snapshot.data().comments

                   
                        
                    this.setState({ commentsArr:data })
                });

            })
    }
    render() {
        console.log('commentsArr-->', this.state.commentsArr)
        //('commentsArr-->', this.state.commentsArr.length)

        return this.state.fontLoaded ? (
            <Container>
                <Header style={{ backgroundColor: '#333846', height: 46, fontFamily: 'ralewayRegular' }}>
                    <Left style={{ flex: 1 }}>
                        <Ionicons name='ios-arrow-back' size={24} style={{ color: '#fff' }} onPress={() =>
                            this.props.navigation.navigate('UserRobHistory')} />
                    </Left>
                    <Body style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{}}><MaterialIcons name="my-location" size={28} color="white" /></Text>
                            <Text style={{ fontSize: 16, fontFamily: 'ralewayRegular', color: 'white', letterSpacing: 1.2, paddingTop: 4, }}>CITIZEN</Text>
                        </View>
                    </Body>
                    <Right style={{ flex: 1 }} />
                </Header>

                <View style={{ backgroundColor: '#eee', paddingLeft: 7, paddingRight: 7, flex: 1, }}>
                    <ScrollView onScroll={this.handleScroll} contentContainerStyle={{ paddingBottom: 30, }} showsVerticalScrollIndicator={true}>
                        {this.state.infoArray.map((mark, index) => (
                            <View style={styles.card} key={mark.chabi}>
                                <View style={{ padding: 10, flexDirection: 'row' }}>
                                    <View>
                                        <Image
                                            style={{
                                                height: 50,
                                                width: 50,
                                                borderRadius: 75
                                            }}
                                            source={{ uri: mark.ProfileURL }} />
                                    </View>
                                    <View style={{ justifyContent: 'center', marginLeft: 4 }}>
                                        <Text style={{ fontSize: 15, fontFamily: 'ralewayRegular', color: '#333846', fontWeight: 'bold' }}>{mark.userName}</Text>
                                        <View style={{ flexDirection: 'row', marginTop: 4 }}>
                                            <AntDesign name="clockcircleo" size={12} color='#5d616f' />
                                            <Text style={{ fontSize: 11, fontFamily: 'ralewayRegular', color: '#5d616f', paddingBottom: 3, paddingLeft: 2 }}>{mark.time}</Text>
                                        </View>

                                    </View>

                                </View>
                                <View style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 4 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: '#5d616f', fontSize: 12, justifyContent: 'flex-start', fontFamily: 'ralewayRegular', paddingLeft: 1, paddingBottom: 4 }}>•{mark.street},{mark.city} •</Text>
                                        <Fontisto name="earth" size={13} color='#5d616f' />
                                    </View>
                                    {mark.description &&  mark.description.description? (
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
                                    <MapView style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        height: 200
                                    }}
                                        ref={map => { this.map = map }}
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
                                        {this.state.isMapReady &&
                                            <Marker
                                                ref={marker => {
                                                    this.marker = marker;
                                                }}
                                                coordinate={{
                                                    latitude: mark.marker_lat,
                                                    longitude: mark.marker_long
                                                }}
                                                title={'Current Location'}
                                            />}
                                    </MapView>
                                </View>
                                <View style={{
                                    padding: 10, paddingTop: 15, paddingBottom: 15, flexDirection: 'row', justifyContent: 'space-between',
                                    borderBottomColor: '#CCCCCC', borderBottomWidth: 1
                                }} >
                                    <TouchableOpacity style={{ flexDirection: 'row' }}>

                                        <FontAwesome name="comments" size={15} color='#5d616f' />
                                        <Text style={{ fontSize: 15, color: '#5d616f', paddingLeft: 4, fontFamily: 'ralewayRegular', }}>{this.state.commentsArr.length} Comments</Text>

                                    </TouchableOpacity>
                                    <View>
                                        <Text style={{ fontFamily: 'ralewayRegular', fontSize: 15, color: '#5d616f', }}>{mark.date}</Text>
                                    </View>
                                </View>
                                <View style={{ paddingTop: 15, paddingBottom: 15, paddingLeft: 10, paddingRight: 10, flexDirection: 'row', flex: 1 }}>
                                    <View style={{ marginRight: 4, flex: 0.5 }}>
                                        <Image
                                            style={{
                                                height: 44,
                                                width: 44,
                                                borderRadius: 75
                                            }}
                                            source={{ uri: this.props.navigation.state.params.userProfile }} />
                                    </View>
                                    <View style={{ flex: 3, flexDirection: 'row' }}>
                                        <View style={{ flex: 3, marginRight: 1 }}>
                                            <TextInput
                                                style={{ borderColor: '#ccd0d5', backgroundColor: '#f2f3f5', borderWidth: 1, paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4, fontSize: 14, fontFamily: 'ralewayRegular', borderRadius: 30, }}
                                                onChangeText={text => this.setState({ comment: text })}
                                                selectionColor={'#CCCCCC'}
                                                placeholder='Write a comment...'
                                                value={this.state.comment}
                                            />
                                        </View>

                                        <View style={{
                                            flex: 0.5, justifyContent: 'center', marginLeft: 2

                                        }} onPress={this.comment}>
                                            <TouchableOpacity style={{
                                                justifyContent: 'center', alignItems: 'center',
                                                backgroundColor: '#333846', borderWidth: 1, height: 38,
                                                width: 38,
                                                borderRadius: 24,
                                                paddingLeft: 4
                                            }} onPress={this.comment}>
                                                <Ionicons name="md-send" size={20} color='#FFFFFF' />
                                            </TouchableOpacity>
                                        </View>

                                    </View>

                                </View>
                            </View>
                        ))}
                        <View style={{ paddingTop: 15, paddingBottom: 15, paddingLeft: 10, paddingRight: 10, flex: 1, backgroundColor: '#fff' }}>
                            {this.state.commentsArr.map((item, index) => (
                                    
                                        <View key={index} style={{ flexDirection: 'row', flex: 1, marginBottom: 10 }}>
                                            <View style={{ marginRight: 4, flex: 0.5 }}>
                                                <Image
                                                    style={{
                                                        height: 44,
                                                        width: 44,
                                                        borderRadius: 75
                                                    }}
                                                    source={{ uri: item.ProfileURL }} />
                                            </View>
                                            <View style={{ flex: 3, flexDirection: 'row', alignItems: 'center', marginLeft: 2, backgroundColor: '#f2f3f5', borderRadius: 30, paddingTop: 15, paddingBottom: 15, paddingLeft: 8, paddingRight: 8 }}>
                                                <Text style={{ fontWeight: 'bold', color: '#333846', fontFamily: 'ralewayRegular', marginRight: 2 }}>{item.userName}</Text>
                                                <Text style={{ color: '#333846', fontFamily: 'ralewayRegular', marginLeft: 1 }}>{item.comment}</Text>
        
                                            </View>
                                        </View>)
                               
                             )}
                        </View>
                    </ScrollView>
                </View>
            </Container >

        ) : null;
    }
}

const styles = StyleSheet.create({
    container: {
        zIndex: -1,//...StyleSheet.absoluteFill,
        height: 200,



    },
    card: {
        backgroundColor: '#fff',
        shadowOffset: { width: 10, height: 10, },
        elevation: 2,
        shadowColor: '#ccc',
        shadowOpacity: 1.0,
        borderRadius: 1,
        marginTop: 15


    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});

export default chatScreen;