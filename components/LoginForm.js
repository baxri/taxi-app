import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';

class LoginForm extends Component {
    render() {
        return (
            <View>
                <TextInput style={styles.input}
                           keyboardType="email-address"
                           placeholder="Your@email.com"
                           autoCapitalize="none"
                           autoCorrect={false}
                />
                <TextInput style={styles.input}
                           placeholder="Password"
                           secureTextEntry
                           autoCapitalize="none"
                           autoCorrect={false}
                />

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>
                        Sign In
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>
                        Create Account
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        padding: 10,
        backgroundColor: '#e4f1fe',
        color: '#34495e',
        marginBottom: 10,
        marginHorizontal: 20,
    },

    button: {
        backgroundColor: '#f5e51b',
        paddingVertical: 15,
        marginHorizontal: 20,
        marginBottom: 10,
    },

    buttonText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#000',
        fontWeight: '200',
    }
});

export default LoginForm;