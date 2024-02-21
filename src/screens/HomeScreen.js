// HomeScreen.js
import React from 'react';
import { Button, View, Text, ScrollView } from 'react-native';
import LogoutButton from '../components/logout-button';
import PostList from '../components/post-list';
import { supabase } from '../../lib/supabase';

const HomeScreen = ({ navigation, route }) => {
  
  return (
    <ScrollView>
      <Button
        title="Go to a profile"
        onPress={() => navigation.navigate('Profile', { name: 'Jane' })}
      />
      <LogoutButton />
      <PostList />
    </ScrollView>
  );
};


export default HomeScreen;
