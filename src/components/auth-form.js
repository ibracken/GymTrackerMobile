import React, { useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { supabase } from '../../lib/supabase'
import { Button, Input } from 'react-native-elements'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced]}>
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
          // Styling
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.input}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
          // Styling
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.input}
        />
      </View>
      <View style={[styles.verticallySpaced]}>
        <Button 
          title="Sign in" 
          disabled={loading} 
          onPress={() => signInWithEmail()} 
          // Styling
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button 
          title="Sign up" 
          disabled={loading} 
          onPress={() => signUpWithEmail()}
          // Styling
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  inputContainer: {
    paddingHorizontal: 10, // Increase padding inside the input container for larger touch area
    borderRadius: 10, // Optional: add some border radius for aesthetic purposes
  },
  input: {
    fontSize: 18, // Increase font size for better readability
  },
  button: {
    height: 50, // Increase button height for a larger touch area
    backgroundColor: '#007bff', // Example button color, adjust as needed
    borderRadius: 10, // Match the input border radius
  },
  buttonTitle: {
    fontSize: 18, // Increase button title font size for better readability
  },
})