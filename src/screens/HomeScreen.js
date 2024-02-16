// HomeScreen.js
import React from 'react';
import { Button, View, Text, ScrollView } from 'react-native';
import LogoutButton from '../components/logout-button';
import PostList from '../components/post-list';
import CreateExercise from '../components/create-exercise';

const HomeScreen = ({ navigation, route }) => {
  
  return (
    <ScrollView>
      <Button
        title="Go to a profile"
        onPress={() => navigation.navigate('Profile', { name: 'Jane' })}
      />
      <LogoutButton />
      <CreateExercise />
      <PostList />
    </ScrollView>
  );
};

export default HomeScreen;
