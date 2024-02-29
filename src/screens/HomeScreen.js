// HomeScreen.js
import React from 'react';
import { ScrollView } from 'react-native';
import PostList from '../components/post-list';
import { supabase } from '../../lib/supabase';

const HomeScreen = ({ navigation, route }) => {
  
  return (
    <ScrollView>
      <PostList />
    </ScrollView>
  );
};


export default HomeScreen;
