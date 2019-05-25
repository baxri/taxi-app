import React, {Component} from 'react';
import {StyleSheet, Text, View, Alert, Image} from 'react-native';
import LoginForm from '../components/LoginForm';
import baseUrl from '../config/baseUrl';
import axios from 'axios';

axios.defaults.baseURL = baseUrl;

class Login extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            email: "giorgi.bibilashvili89@gmail.com",
            password: "gio123456",
            error: ""
        }
    }

    handleChange = (field, value) => {
        this.setState({[field]: value})
    }

    handleSignIn = async () => {
        try {
            const {email, password} = this.state;

            const {data} = await axios.post("/users/login", {email, password});
            Alert.alert(data.token);
        } catch (err) {
            Alert.alert(err.response.data.message);
        }
    }

    handleSignUp = async () => {
        try {
            const {email, password} = this.state;

            await axios.post("/users", {email, password});

            this.handleSignIn();
        } catch (err) {
            Alert.alert(err.response.data.message);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {/*<Text style={styles.headerText}>TaxiApp</Text>*/}
                <Image source={require('../images/taxi.png')} style={styles.logo} />

                <LoginForm email={this.state.email} password={this.state.password} handleChange={this.handleChange}
                           handleSignIn={this.handleSignIn} handleSignUp={this.handleSignUp}/>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#34495e',
    },

    headerText: {
        fontSize: 44,
        color: '#e4f1fe',
        textAlign: 'center',
        marginVertical: 50,
        fontWeight: '200',
    },

    logo: {
        alignSelf: 'center',
        width: 200,
        height: 200,
        marginVertical: 30
    }
});

export default Login;