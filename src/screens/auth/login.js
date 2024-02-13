import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AuthForm from '../../components/auth-form';

export default function Login() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login Page</Text>
            <AuthForm />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});
