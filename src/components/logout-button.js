'use client'
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';

export default function LogoutButton() {
    async function signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error);
        } else {
            console.log('Successfully signed out');
            // Shouldn't need to handle navigation or state reset here bc of App.js state changes
        }
    }

    return (
        <TouchableOpacity 
            onPress={signOut}
            style={styles.button}
        >
            <Text>Logout</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        position: 'absolute', // Use absolute for positioning in React Native
        top: 10,              // 10px from the top
        right: 10,            // 10px from the right
        padding: 10,          // Add some padding
        // Add more styling as needed
    },
});