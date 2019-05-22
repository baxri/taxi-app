import React, { Component } from 'react';
import { Platform, Linking, ActivityIndicator, StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity, Keyboard, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import apiKey from '../apiKey';
import axios from 'axios';
import _ from 'lodash';
import PolyLine from '@mapbox/polyline';
import socketIO from "socket.io-client";
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import GenericContainer from "../components/GenericContainer";

class Driver extends Component {

  constructor(props) {
    super(props)

    this.state = {
      error: "",
      lookingForPassengers: false,
      buttonText: "FIND PASSENGER",
      passengerFound: false,
    }
  }

  componentDidMount() {

    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 50,
      distanceFilter: 50,
      debug: false,
      startOnBoot: false,
      stopOnTerminate: true,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 10000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      stopOnStillActivity: false,
    });

    BackgroundGeolocation.on('authorization', (status) => {
      console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        // we need to set delay or otherwise alert may not be shown
        setTimeout(() =>
          Alert.alert('App requires location tracking permission', 'Would you like to open app settings?', [
            { text: 'Yes', onPress: () => BackgroundGeolocation.showAppSettings() },
            { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' }
          ]), 1000);
      }
    });
  }

  lookForPassengers = async () => {

    this.setState({ lookingForPassengers: true });

    this.socket = socketIO.connect("http://192.168.0.101:3000");

    this.socket.on("connect", () => {
      this.socket.emit("lookingForPassengers");

      this.socket.on("taxiRequest", routeResponse => {
        this.props.getRouteDirection(routeResponse.geocoded_waypoints[0].place_id);
        this.setState({ lookingForPassengers: false, passengerFound: true, buttonText: "ACCEPT RIDE?" });
      });
    });

  }

  acceptPassenger = async () => {

    // BackgroundGeolocation.on('location', (location) => {
    //   this.socket.emit("driverLocation", {
    //     latitude: location.latitude,
    //     longitude: location.longitute,
    //   });
    // });


    // BackgroundGeolocation.checkStatus(status => {
    //   // you don't need to check status before start (this is just the example)
    //   // alert("checkStatus!");
    //   if (!status.isRunning) {
    //     BackgroundGeolocation.start(); //triggers start on start event
    //   }
    // });




    this.socket.emit("driverLocation", {
      latitude: this.props.latitude,
      longitude: this.props.longitude,
    });

    const passengerLocation = this.props.pointCoords[this.props.pointCoords.length - 1];

    if (Platform.OS == 'ios') {
      Linking.openURL(`http://maps.apple.com/?daddr=${passengerLocation.latitude},${passengerLocation.longitude}`);
    } else {
      Linking.openURL(`geo:0,0?q=${passengerLocation.latitude},${passengerLocation.longitude}(Passenger)`);
    }
  }

  render() {

    let marker = null;
    let bottomButtonFunction = this.lookForPassengers;

    if (this.props.pointCoords.length > 0) {
      marker = <Marker coordinate={this.props.pointCoords[this.props.pointCoords.length - 1]} />
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
            latitude: this.props.latitude,
            longitude: this.props.longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1 * (width / height),
          }}
          showsUserLocation={true}
        >
          <MapView.Polyline coordinates={this.props.pointCoords} strokeWidth={4} strokeColor="red" />
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

export default GenericContainer(Driver);
