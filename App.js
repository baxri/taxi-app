/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const GOOGLE_API_KEY = 'AIzaSyA2xyrDSw6pndpokaymwV2eW6d_JuT4-yo';

export default class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      latitude: 0,
      longitute: 0,
      error: null,
    }
  }


  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {

        this.setState({
          latitude: position.coords.latitude,
          longitute: position.coords.longitude,
          error: null,
        })
      },
      (error) => { this.setState({ error: error.message }) },
      { enableHighAccuracy: true, timeout: 30000 }
    )
  }

  render() {
    return (
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          // latitude: this.state.longitute,
          // longitude: this.state.latitude,
          // latitudeDelta: 0.015,
          // longitudeDelta: 0.012,
        }}
        showsUserLocation={true}
      >
      </MapView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
