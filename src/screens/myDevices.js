import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, ImageBackground, Image } from 'react-native';
import { Icon, Button, Container, Header, Content, Left, Body, Right, DatePicker, Textarea, } from 'native-base'
import { Ionicons, MaterialIcons, EvilIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

import * as Font from 'expo-font';


class userDevices extends Component {
    static navigationOptions = {
        header: null,
        drawerLabel: 'My Devices',
        drawerIcon: ({ tintColor }) => <Ionicons name="ios-phone-portrait" size={24} color={tintColor} />
    };
    constructor(props) {
        super(props);
        this.state = { fontLoaded: false };

    }
    async componentDidMount() {
        await Font.loadAsync({
            'ralewayRegular': require('../assets/fonts/Raleway-Regular.ttf'),
        });

        this.setState({ fontLoaded: true });
    }

    render() {

        return this.state.fontLoaded ? (

            <Container>
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
                <View>
                    <Text>My Devices</Text>
                </View>
            </Container >

        ) : null;
    }
}



export default userDevices;