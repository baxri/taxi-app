import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

class LoginForm extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.headerText}>TaxiApp</Text>

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

    }
});

export default Login;