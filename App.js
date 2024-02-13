import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Auth from './src/components/auth-form'
import { View, Text } from 'react-native'
import MyStack from './src/navigation/MyStack'
import { NavigationContainer } from '@react-navigation/native'

export default function App() {
  // Successfully logs in
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <NavigationContainer>
      {/* Conditional Rendering of Stack */}
      {/* condition ? (expressionIfTrue) : (expressionIfFalse); */}
      {session && session.user ? (
        <MyStack />
      ) : (
        <View style={{ flex: 1 }}>
          <Auth />
        </View>
      )}
    </NavigationContainer>
  );
}