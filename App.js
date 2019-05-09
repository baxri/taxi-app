/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput } from 'react-native';
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
      error: "",
      destination: "",
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

  onChangeDestination = (destination) => {



  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: this.state.longitute,
            longitude: this.state.latitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          showsUserLocation={true}
        >
        </MapView>
        <TextInput style={styles.destinationInput} placeholder="Enter location" value={this.destination} onChangeText={destination => this.onChangeDestination(destination)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  destinationInput: {
    height: 40,
    borderWidth: 1,
    marginTop: 50,
    marginLeft: 5,
    marginRight: 5,
    paddingLeft: 5,
    backgroundColor: "white",

  },
  container: {
    ...StyleSheet.absoluteFillObject
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },

});
