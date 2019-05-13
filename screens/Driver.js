import React, { Component } from 'react';
import { Platform, Linking, ActivityIndicator, StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity, Keyboard } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import apiKey from '../apiKey';
import axios from 'axios';
import _ from 'lodash';
import PolyLine from '@mapbox/polyline';
import socketIO from "socket.io-client";

export default class Driver extends Component {

  constructor(props) {
    super(props)

    this.state = {
      latitude: 0,
      longitute: 0,
      error: "",
      pointCoords: [],
      lookingForPassengers: false,
      buttonText: "FIND PASSENGER",
      passengerFound: false,
      socket: null,
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

  getRouteDirection = async (placeId) => {
    try {
      const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${this.state.latitude},${this.state.longitute}&destination=place_id:${placeId}&key=${apiKey}`;
      const { data } = await axios.get(apiUrl);
      const points = PolyLine.decode(data.routes[0].overview_polyline.points);
      const pointCoords = points.map(point => { return { latitude: point[0], longitude: point[1] } });
      this.setState({ pointCoords });
      this.map.fitToCoordinates(pointCoords, { edgePadding: { top: 50, right: 30, left: 30 } });
    } catch (err) {
      alert(err.message)
    }
  }

  lookForPassengers = async () => {

    this.setState({ lookingForPassengers: true });

    this.socket = socketIO.connect("http://192.168.0.102:3000");

    this.socket.on("connect", () => {
      this.socket.emit("lookingForPassengers", this.state.routeResponse);

      this.socket.on("taxiRequest", routeResponse => {
        this.getRouteDirection(routeResponse.geocoded_waypoints[0].place_id);
        this.setState({ lookingForPassengers: false, passengerFound: true, buttonText: "ACCEPT RIDE?" });
      });
    });

  }

  acceptPassenger = async () => {
    this.socket.emit("driverLocation", {
      latitude: this.state.latitude,
      longitude: this.state.longitute,
    });

    const passengerLocation = this.state.pointCoords[this.state.pointCoords.length - 1];

    if (Platform.OS == 'ios') {
      Linking.openURL(`http://maps.apple.com/?daddr=${passengerLocation.latitude},${passengerLocation.longitude}`);
    } else {
      Linking.openURL(`https://www.google.com/dir/?api=1&destination=${passengerLocation.latitude},${passengerLocation.longitude}`);
    }
  }

  render() {

    let marker = null;
    let bottomButtonFunction = this.lookForPassengers;

    if (this.state.pointCoords.length > 0) {
      marker = <Marker coordinate={this.state.pointCoords[this.state.pointCoords.length - 1]} />
    }

    if (this.state.passengerFound) {
      bottomButtonFunction = this.acceptPassenger;
    }

    const { width, height } = Dimensions.get('window');

    return (
      <View style={styles.container}>
        <MapView
          ref={map => {
            this.map = map;
          }}
          style={styles.map}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitute,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1 * (width / height),
          }}
          showsUserLocation={true}
        >
          <MapView.Polyline coordinates={this.state.pointCoords} strokeWidth={4} strokeColor="red" />
          {marker}
        </MapView>

        <TouchableOpacity onPress={() => bottomButtonFunction()} style={styles.bottomButton}>
          <Text style={styles.bottomButtonText}>{this.state.buttonText}</Text>
          <ActivityIndicator animating={this.state.lookingForPassengers} size="large" />
        </TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create({

  bottomButton: {
    backgroundColor: "black",
    marginTop: "auto",
    margin: 20,
    padding: 15,
    paddingHorizontal: 30,
    alignSelf: 'center',
  },

  bottomButtonText: {
    color: "white",
    fontSize: 20,
  },

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
