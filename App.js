import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import apiKey from './apiKey';
import axios from 'axios';
import _ from 'lodash';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      latitude: 0,
      longitute: 0,
      error: "",
      destination: "",
      predictions: [],
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

  onChangeDestination = async (destination) => {
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${destination}&key=${apiKey}&sessiontoken=1234567890&location=${this.state.latitude},${this.state.longitute}&radius=2`;
    const { data } = await axios.get(apiUrl);

    this.setState({
      destination,
      predictions: data.predictions
    })

    console.log(data);

  }

  render() {

    const predictions = this.state.predictions.map(prediction => <Text style={styles.suggestions} key={prediction.id}>{prediction.description}</Text>);

    console.log(predictions)

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
        <TextInput style={styles.destinationInput} placeholder="Enter location" value={this.destination} onChangeText={_.debounce(this.onChangeDestination, 1000)} />
        {predictions}
      </View>
    );
  }
}

const styles = StyleSheet.create({

  suggestions: {
    backgroundColor: "white",
    padding: 5,
    fontSize: 18,
    borderWidth: 0.5,
    marginHorizontal: 5,
  },

  destinationInput: {
    height: 40,
    borderWidth: 0.5,
    marginTop: 50,
    marginLeft: 5,
    marginRight: 5,
    paddingLeft: 5,
    padding: 5,
    backgroundColor: "white",

  },
  container: {
    ...StyleSheet.absoluteFillObject
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },

});
