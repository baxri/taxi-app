import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';

import Login from "./screens/Login";
import Driver from "./screens/Driver";
import Passenger from "./screens/Passenger";

export default class App extends Component {

    constructor(props) {
        super(props)

        this.state = {
            isDriver: false,
            isPassenger: false,
            token: 'dssdfsd',
        }
    }

    handleTokenChange = (token) => {
        this.setState({token});
    }

    render() {

        const {isPassenger, isDriver, token} = this.state;

        if (!token) {
            return <Login handleTokenChange={this.handleTokenChange}/>
        }

        if (isPassenger) {
            return <Passenger/>
        }

        if (isDriver) {
            return <Driver/>
        }

        return (
            <View style={styles.container}>

                <TouchableOpacity style={[styles.choiseContainer, {borderBottomWidth: 0.5}]}
                      onPress={() => this.setState({isPassenger: true})}>
                    <Text style={styles.selectionText}>I'm a driver</Text>
                    <Image source={require('./images/taxi.png')} style={styles.selectionImage}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.choiseContainer} onPress={() => this.setState({isDriver: true})}>
                    <Text style={styles.selectionText}>I'm a passenger</Text>
                    <Image source={require('./images/taxi.png')} style={styles.selectionImage}/>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#34495e',
    },

    choiseContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: '#fff',
    },

    selectionImage: {
        width: 200,
        height: 200,
    },

    selectionText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '200',
    }
});
