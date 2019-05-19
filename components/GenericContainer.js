import React, { Component } from "react";

function GenericContainer(WrappedComponent) {
    return class extends Component {

        constructor(props) {
            super(props)

            this.state = {
                latitude: 0,
                longitute: 0,
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

        render() {
            return <WrappedComponent latitude={this.state.latitude} longitude={this.state.longitute} />;
        }
    }
}

export default GenericContainer;