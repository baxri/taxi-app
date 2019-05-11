import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Dimensions, TouchableHighlight, TouchableOpacity, Keyboard } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import apiKey from '../apiKey';
import axios from 'axios';
import _ from 'lodash';
import PolyLine from '@mapbox/polyline';

export default class Passenger extends Component {

    constructor(props) {
        super(props)

        this.state = {
            latitude: 0,
            longitute: 0,
            error: "",
            destination: "",
            predictions: [],
            pointCoords: [],
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

        this.setState({ destination });

        const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${destination}&key=${apiKey}&sessiontoken=1234567890&location=${this.state.latitude},${this.state.longitute}&radius=2`;
        const { data } = await axios.get(apiUrl);

        this.setState({
            predictions: data.predictions
        })
    }

    getRouteDirection = async (placeId, description) => {
        try {
            const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${this.state.latitude},${this.state.longitute}&destination=place_id:${placeId}&key=${apiKey}`;
            const { data } = await axios.get(apiUrl);
            const points = PolyLine.decode(data.routes[0].overview_polyline.points);
            const pointCoords = points.map(point => { return { latitude: point[0], longitude: point[1] } });
            this.setState({ pointCoords, predictions: [], destination: description });
            Keyboard.dismiss();

            this.map.fitToCoordinates(pointCoords, { edgePadding: { top: 50, right: 30, left: 30 } });
        } catch (err) {
            alert(err.message)
        }
    }

    render() {

        let marker = null;
        let driverButton = null;

        if (this.state.pointCoords.length > 0) {
            marker = <Marker coordinate={this.state.pointCoords[this.state.pointCoords.length - 1]} />
            driverButton = <TouchableOpacity style={styles.bottomButton}>
                <Text style={styles.bottomButtonText}>FIND DRIVER</Text>
            </TouchableOpacity>;
        }

        const predictions = this.state.predictions.map(prediction => <TouchableHighlight onPress={() => this.getRouteDirection(prediction.place_id, prediction.structured_formatting.main_text)} key={prediction.id}>
            <View>
                <Text style={styles.suggestions}>{prediction.description}</Text>
            </View>
        </TouchableHighlight>);


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
                    {marker && marker}
                </MapView>
                {/* <TextInput style={styles.destinationInput} placeholder="Enter location" value={this.state.destination} onChangeText={_.debounce(this.onChangeDestination, 1000)} /> */}
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
