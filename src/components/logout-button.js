'use client'
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';

export default function LogoutButton() {
    const widthAnim = new Animated.Value(45); // Initial width of the button

    // Function to animate the button on press
    const onPressIn = () => {
        Animated.spring(widthAnim, {
        toValue: 125,
        friction: 5,
        useNativeDriver: false,
        }).start();
    };
    
    async function signOut() {
         // Function to reset the button width when the press is released
        const onPressOut = () => {
            Animated.spring(widthAnim, {
            toValue: 45,
            friction: 5,
            useNativeDriver: false,
            }).start();
        };
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error);
        } else {
            console.log('Successfully signed out');
            // Shouldn't need to handle navigation or state reset here bc of App.js state changes
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.container}> 
                <Text style = {styles.title}>Logout</Text>
            </View>
            <Animated.View style={[styles.btn, { width: widthAnim }]}>
                <TouchableOpacity onPressIn={onPressIn} onPressOut={signOut} style={styles.touchable}>
                    <View style={styles.sign}>
                    <Svg viewBox="0 0 512 512" width="28" height="17">
                        <Path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" fill="#FFF"/>
                    </Svg>
                    </View>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    btn: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: 45,
        borderRadius: 50,
        overflow: 'hidden',
        backgroundColor: 'rgb(255, 65, 65)',
        flexDirection: 'row',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 2, // for Android shadow
      },
      touchable: {
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
        paddingLeft: 10,
      },
      sign: {
        alignItems: 'center',
        justifyContent: 'center',
      },
    buttonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 10,
    },
    title: {
        fontSize: 14,
        marginBottom: 5,
    },
});