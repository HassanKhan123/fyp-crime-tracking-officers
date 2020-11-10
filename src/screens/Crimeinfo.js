import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, View, TextInput, ImageBackground, Image, KeyboardAvoidingView, Platform, Keyboard, ScrollView, TouchableWithoutFeedback, Alert, SafeAreaView } from 'react-native';
import { Icon, Button, Container, Header, Content, Left, Body, Right, DatePicker, Textarea, } from 'native-base'
import { Ionicons, MaterialIcons, EvilIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import Constants from 'expo-constants';

import * as Font from 'expo-font';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import fire from '../config/firebase';

class Crimeinfo extends Component {
    static navigationOptions = {
        drawerLabel: () => null
    }
    constructor(props) {
        super(props);
        this.state = { chosenDate: new Date(), text: '', description: '', fontLoaded: false, userId: '' };
        this.setDate = this.setDate.bind(this);
    }

    setDate(newDate) {
        this.setState({ chosenDate: newDate });
    }

    async componentDidMount() {
        StatusBar.setBackgroundColor('#333846', true)
        await Font.loadAsync({
            'ralewayRegular': require('../assets/fonts/Raleway-Regular.ttf'),
        });

        this.setState({ fontLoaded: true });
    }

    submitForm = () => {
        console.log('date', this.state.chosenDate.toString().substr(4, 12))
        const date = this.state.chosenDate.toString().substr(4, 12)
        const description = this.state.description
        const userkey = this.props.navigation.getParam('userkey', 'NO-ID')
        const allKey = this.props.navigation.getParam('allKey', 'NO-ID')
        const userId = this.props.navigation.getParam('userId', 'NO-ID')

        const userName = this.props.navigation.getParam('Name', 'NO-ID')
        const userProfile = this.props.navigation.getParam('userProfile', 'NO-ID')
        const userToken = this.props.navigation.getParam('UserToken', 'NO-ID')
        const deviceInfo = this.props.navigation.getParam('deviceInfo', 'NO-ID')


        const ReportDesc = {
            description: description,
            submitDate: date
        }
        fire.firestore().collection('usersAlerts').doc(userId).collection('userAlerts').doc(userkey).set({
            ReportDesc
        },{merge:true}).then(() => {
            fire.firestore().collection('allAlerts').doc(userkey).set({ReportDesc},{merge:true})
            .then(() => {
                Alert.alert(
                    'Your Response has been noticed!',
                    ' We will shortly inspect this area.',
                    [
                        { text: 'Thank You', onPress: this.goToHistory },


                    ],
                    { cancelable: false }
                );

                this.setState({ description: '', userId })
            })
        })
        
        this.props.navigation.navigate('UserRobHistory',{
            userId, Name: userName, userProfile: userProfile, UserToken: userToken,
            deviceinfo: deviceInfo, userkey, allKey: allKey
        })
    }
    render() {
        return this.state.fontLoaded ? (
            <Fragment>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} keyboardShouldPersistTaps="always">
                        <View style={styles.wrapper}>
                            <KeyboardAwareScrollView
                                // enableOnAndroid
                                // enableAutomaticScroll
                                keyboardOpeningTime={0}
                            // extraHeight={Platform.select({ android: 400 })}
                            >
                                <Container style={{ backgroundColor: '#fff', flex: 1, fontFamily: 'ralewayRegular' }}>
                                    <Header style={{ backgroundColor: '#333846', height: 46, fontFamily: 'ralewayRegular' }}>
                                        <Left style={{ flex: 1 }}>
                                            <Icon name='ios-menu' style={{ color: '#fff' }} onPress={() =>
                                                this.props.navigation.toggleDrawer()} />
                                        </Left>
                                        <Body style={{ flex: 1 }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{}}><MaterialIcons name="my-location" size={28} color="white" /></Text>
                                                <Text style={{ fontSize: 16, fontFamily: 'ralewayRegular', color: 'white', letterSpacing: 1.2, paddingTop: 4, }}>CITIZEN</Text>
                                            </View>
                                        </Body>
                                        <Right style={{ flex: 1 }} />

                                    </Header>

                                    <View style={{ flex: 1, fontFamily: 'ralewayRegular', justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: '#fff', opacity: 0.9 }}>
                                        <View style={{ paddingTop: 30, paddingBottom: 30, width: 300, padding: 18, shadowOffset: { height: 1, width: 1 }, shadowOpacity: 1, elevation: 1 }}>
                                            <ScrollView contentContainerStyle={{ flexGrow: 1, }}>
                                                <View style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                                                    <Image source={require('../assets/images/message.png')} style={{ width: 200, height: 200, }} />
                                                </View>
                                                <View style={{ flexDirection: 'row', marginTop: 8, marginBottom: 14 }}>
                                                    <Text style={{ fontFamily: 'ralewayRegular', fontSize: 36, color: '#333846' }}>Hey!</Text>
                                                    <Text style={{ fontFamily: 'ralewayRegular', fontSize: 14, alignSelf: 'flex-end', paddingLeft: 5, color: '#333846' }}>Help us to find criminals...</Text>
                                                </View>
                                                <View style={{ borderBottomColor: '#333846', color: '#f2f3f5', backgroundColor: '#f2f3f5', borderBottomWidth: 1, marginBottom: 10, paddingTop: 8, paddingBottom: 8, fontFamily: 'ralewayRegular' }}>
                                                    <DatePicker
                                                        defaultDate={new Date()}
                                                        minimumDate={new Date(2018, 1, 1)}
                                                        maximumDate={new Date(2050, 12, 30)}
                                                        locale={"en"}
                                                        timeZoneOffsetInMinutes={undefined}
                                                        modalTransparent={false}
                                                        animationType={"fade"}
                                                        androidMode={"default"}

                                                        textStyle={{ color: "#5d616f", fontFamily: 'ralewayRegular' }}
                                                        // placeHolderTextStyle={{ color: "#d3d3d3" }}
                                                        onDateChange={this.setDate}
                                                        disabled={false}
                                                    />
                                                </View>
                                                <View style={{ borderBottomColor: '#333846', borderBottomWidth: 1, color: '#222222', backgroundColor: '#f2f3f5' }}>
                                                    <Textarea rowSpan={5} value={this.state.description} placeholderTextColor="#5d616f" placeholder="What Happened?" style={{ paddingTop: 8, color: '#222222', fontFamily: 'ralewayRegular' }} onChangeText={(text) => { this.setState({ description: text }) }} />
                                                </View>
                                                <View style={{ marginTop: 10, marginBottom: 20 }}>
                                                    <TouchableOpacity style={{ backgroundColor: '#333846', paddingTop: 14, paddingBottom: 14 }}
                                                        onPress={() => this.submitForm()}
                                                    >
                                                        <Text style={{ color: 'white', marginLeft: 5, fontSize: 15, textAlign: 'center', fontFamily: 'ralewayRegular' }}>Submit</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </ScrollView>
                                        </View>


                                    </View>

                                </Container >
                            </KeyboardAwareScrollView>
                        </View>
                    </SafeAreaView>
                </TouchableWithoutFeedback>
            </Fragment>
        ) : null;
    }
}

const styles = StyleSheet.create({
    backgroundImg: {
        flex: 1,
        // remove width and height to override fixed static size
        width: null,
        height: null,
        resizeMode: 'cover',
        backgroundColor: '#333846'
    },
    wrapper: {
        zIndex: -1,//...StyleSheet.absoluteFill,
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },

});



export default Crimeinfo;