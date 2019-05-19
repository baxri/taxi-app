import React, { Component } from "react";
import { Keyboard } from 'react-native';
import PolyLine from '@mapbox/polyline';
import apiKey from '../apiKey';
import axios from 'axios';

function GenericContainer(WrappedComponent) {
    return class extends Component {

        constructor(props) {
            super(props)

            this.state = {
                latitude: 0,
                longitute: 0,
                pointCoords: [],
                routeResponse: {}
            }
        }

        componentDidMount() {
            // navigator.geolocation.getCurrentPosition(
            this.watchID = navigator.geolocation.watchPosition(
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

        componentWillUnmount() {
            navigator.geolocation.clearWatch(this.watchID);
        }

        getRouteDirection = async (placeId) => {
            try {
                const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${this.state.latitude},${this.state.longitute}&destination=place_id:${placeId}&key=${apiKey}`;
                const { data } = await axios.get(apiUrl);
                const points = PolyLine.decode(data.routes[0].overview_polyline.points);
                const pointCoords = points.map(point => { return { latitude: point[0], longitude: point[1] } });

                this.setState({
                    pointCoords,
                    routeResponse: data
                });
                Keyboard.dismiss();
            } catch (err) {
                alert(err.message)
            }
        }

        render() {
            return <WrappedComponent
                getRouteDirection={this.getRouteDirection}
                latitude={this.state.latitude}
                longitude={this.state.longitute}
                pointCoords={this.state.pointCoords}
                routeResponse={this.state.routeResponse}
            />
        }
    }
}

export default GenericContainer;