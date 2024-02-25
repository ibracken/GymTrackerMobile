import { useState } from "react";
import { View, Text, TouchableOpacity, Alert, TextInput, StyleSheet } from "react-native";
import { supabase } from "../../lib/supabase";

export default function CreateExercise({ onExerciseCreated }) {
  const [Exercise, setExercise] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  // For the input label animation
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  // Check if the input is focused or has a valid value
  const isValid = Exercise.length > 0;
  // Apply focused styles if input is focused or has a valid value
  const labelStyle = [
    styles.userLabel,
    (isFocused || isValid) && styles.labelFocused,
  ];

  async function insertExercise() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!Exercise) {
        Alert.alert("Please choose an exercise to create");
        return;
      }

      const { error } = await supabase.from("Exercises").insert({
        user_id: user.id,
        Exercise: Exercise,
      });

      if (error) {
        console.error("Not Inserted");
      } else {
        console.log("Created");
        // If a callback function is passed, call it after the exercise is created
        if (onExerciseCreated) {
          onExerciseCreated();
        }
      }
      // Make the input field empty after the exercise is created
      setExercise("");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={styles.container}>
       <View style={styles.inputGroup}>
        <TextInput
          required
          style={[styles.input, (isFocused || isValid) && styles.inputFocused]} // Apply focused styles if input is focused or has a valid value
          onChangeText={setExercise}
          value={Exercise}
          onBlur={handleBlur}
          onFocus={handleFocus}
          autoCorrect={false}
        />
        <Text style={labelStyle}>Exercise</Text>
      </View>
      <TouchableOpacity style={styles.touchableOpacity} onPress={insertExercise}>
        <Text style={styles.touchableOpacityText}>Add Exercise</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  inputGroup: {
    position: 'relative',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#9e9e9e',
    borderRadius: 16,
    padding: 10,
    fontSize: 16,
    color: 'black',
    backgroundColor: 'transparent',
  },
  inputFocused: {
    borderColor: '#1a73e8',
  },
  userLabel: {
    position: 'absolute',
    left: 15,
    color: '#e8e8e8',
    backgroundColor: 'transparent',
    top: 15, // Adjust based on your input size and padding
  },
  labelFocused: {
    transform: [{ translateY: -22 }, { scale: 0.8 }], // Adjust based on your needs
    backgroundColor: 'white',
    color: '#2196f3',
  },
  touchableOpacity: {
    height: 50,
    backgroundColor: '#007bff',
    borderRadius: 10,
    justifyContent: 'center', // Center the text vertically
    alignItems: 'center', // Center the text horizontally
  },
  touchableOpacityText: {
    color: '#fff', // Text color
    fontSize: 16, // Text size
  },
});
