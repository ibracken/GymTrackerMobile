// HomeScreen.js
import React from 'react';
import { Button, View, Text } from 'react-native';
import LogoutButton from '../components/logout-button';

const HomeScreen = ({ navigation }) => {
  return (
    <View>
      <Button
        title="Go to a profile"
        onPress={() => navigation.navigate('Profile', { name: 'Jane' })}
      />
      <LogoutButton />
    </View>
  );
};

export default HomeScreen;
