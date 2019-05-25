import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Dimensions, TouchableHighlight, TouchableOpacity, Keyboard, ActivityIndicator, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import apiKey from '../apiKey';
import axios from 'axios';
import _ from 'lodash';
import socketIO from "socket.io-client";
import GenericContainer from "../components/GenericContainer";

class Passenger extends Component {

    constructor(props) {
        super(props)

        this.state = {
            error: "",
            destination: "",
            predictions: [],
            // pointCoords: [],

            lookingForDriver: false,
            driverIsOnTheWay: false,
            driverLocation: { latitude: 0, longitude: 0 },
            // routeResponse: null,
        }
    }

    onChangeDestination = async (destination) => {

        this.setState({ destination });

        const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${destination}&key=${apiKey}&sessiontoken=1234567890&location=${this.props.latitude},${this.props.longitute}&radius=2`;
        const { data } = await axios.get(apiUrl);

        this.setState({
            predictions: data.predictions
        })
    }

    getDirections = async (placeId, description) => {
        await this.props.getRouteDirection(placeId);
        this.setState({ predictions: [], destination: description });
        this.map.fitToCoordinates(this.props.pointCoords, { edgePadding: { top: 100, right: 20, left: 20, bottom: 100 } });
    }

    requestDriver = async () => {

        this.setState({ lookingForDriver: true });

        const socket = socketIO.connect("http://192.168.0.111:3000");

        socket.on("connect", () => {
            socket.emit("taxiRequest", this.props.routeResponse);
        });

        socket.on("driverLocation", driverLocation => {
            this.setState({ lookingForDriver: false, driverIsOnTheWay: true, driverLocation });
            let pointCoords = [...this.props.pointCoords];
            pointCoords.push(driverLocation);
            this.map.fitToCoordinates(pointCoords, { edgePadding: { top: 100, right: 20, left: 20, bottom: 100 } });
        });
    }

    render() {

        let marker = null;
        let markerDriver = null;
        let driverButton = null;

        if (this.props.pointCoords.length > 0) {
            marker = <Marker coordinate={this.props.pointCoords[this.props.pointCoords.length - 1]} />
            driverButton = <TouchableOpacity onPress={() => this.requestDriver()} style={styles.bottomButton}>
                <Text style={styles.bottomButtonText}>FREQUEST</Text>
                <ActivityIndicator animating={this.state.lookingForDriver} size="large" />
            </TouchableOpacity>;
        }

        if (this.state.driverIsOnTheWay) {
            markerDriver = <Marker coordinate={this.state.driverLocation}  >
                <Image source={require('../car.png')} style={{ width: 40, height: 40 }} />
            </Marker>
        }

        const predictions = this.state.predictions.map(prediction => <TouchableHighlight onPress={() => this.getDirections(prediction.place_id, prediction.structured_formatting.main_text)} key={prediction.id}>
            <View>
                <Text style={styles.suggestions}>{prediction.description}</Text>
            </View>
        </TouchableHighlight>);

        const { width, height } = Dimensions.get('window');

        console.log(this.props.latitude, this.props.longitude);

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
                    {markerDriver}
                </MapView>
                <TextInput style={styles.destinationInput} placeholder="Enter location" value={this.state.destination} onChangeText={this.onChangeDestination} />
                {predictions}
                {driverButton}
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

export default GenericContainer(Passenger);
