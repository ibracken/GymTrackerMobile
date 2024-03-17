// HomeScreen.js
import React from 'react';
import { ScrollView } from 'react-native';
import PostList from '../components/post-list';

const HomeScreen = ({ navigation, route }) => {
  

  return (
    <ScrollView style = {{backgroundColor: '#fff'}}>
      <PostList />
    </ScrollView>
  );
};


export default HomeScreen;
