import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, View, Platform, SafeAreaView } from 'react-native';
import { StatusBar } from 'react-native';
import Navigation from './src/config/navigation'
import Constants from 'expo-constants';



export default function App() {
  return (
    <Fragment>
      <View style={styles.statusBar}>
        <StatusBar
          backgroundColor="#333846"
          barStyle="light-content"
        />
      </View>
      <View style={styles.container}>
        <Navigation />
      </View>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333846',
    justifyContent: 'center',
    // paddingTop: Constants.statusBarHeight,
  },
  statusBar: {
    backgroundColor: "#333846",

  },
});
