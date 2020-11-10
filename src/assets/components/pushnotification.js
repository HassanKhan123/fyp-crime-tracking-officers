import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
export default class PushNotification extends Component {



    render() {
        return (
            <View style={styles.container}>
                {console.log(this.props)}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },

});
