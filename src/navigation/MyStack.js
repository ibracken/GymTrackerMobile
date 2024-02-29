// MyStack.js
import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import FullRepsScreen from '../screens/FullRepsScreen';
import Login from '../screens/auth/login';

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home Page' }} />
      <Stack.Screen name="FullReps" component={FullRepsScreen} />
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
};

export default MyStack;
