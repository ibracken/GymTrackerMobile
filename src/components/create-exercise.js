"use client";
// Used in account page
import { useState } from "react";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";
import { supabase } from "../../lib/supabase";

export default function CreateExercise({onExerciseCreated}) {
  const [Exercise, setExercise] = useState("");

  async function insertExercise() {
    // Accesses authenticated user from supabase
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!Exercise) {
        console.error("Please select an exercise to create");
        return;
      }

      const {data, error} = await supabase.from("Exercises").insert({
        // Inserts these items into supabase, rest of exercise is randomly generated or null
        user_id: user.id,
        Exercise: Exercise,
      });
      
      if(error) {
        console.error("Not Inserted")
      } else {
        console.log("created")
        onExerciseCreated();
      }

      setExercise("");
    } catch (error) {
      console.error(error);
    }
  }

  // Renders function
  return (
    <View style={styles.otherGridItem}>
      <Text>Create Exercises: </Text>
      {/* Input field */}
      <TextInput
        style={styles.input}
        placeholder="Exercise"
        value={Exercise}
        onChangeText={setExercise} // Directly pass setExercise as onChangeText handles the new value automatically
      />
      {/* Button that triggers the function */}
      <Button title = "add exercise" style={styles.button} onPress={insertExercise}>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
    input: {
        fontSize: 18, // Increase font size for better readability
    },
    button: {
        height: 50, // Increase button height for a larger touch area
        backgroundColor: '#007bff', // Example button color, adjust as needed
        borderRadius: 10, // Match the input border radius
      },
      otherGridItem: {
        padding: 16,
        borderRadius: 8,
        // React Native does not support CSS box-shadow directly, but you can achieve similar effects with elevation (Android) and shadow properties (iOS)
        elevation: 1, // This is for Android
        shadowColor: '#000', // These shadow properties are for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        marginBottom: 20,
        backgroundColor: '#fff', // You might need to set a background color for shadows to appear on iOS
      },
});