import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AuthForm from '../../components/auth-form';

export default function Login() {
    return (
        <View style={styles.container}>
            <AuthForm />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF',
    },
});
