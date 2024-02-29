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
    styles.exerciseLabel,
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
      <Text style={styles.title}>Add an exercise:</Text>
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
      <TouchableOpacity style={styles.button} onPress={insertExercise}>
        <Text style={styles.touchableOpacityText}>Add Exercise</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 20,
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
  exerciseLabel: {
    position: 'absolute',
    left: 15,
    color: 'lightslategrey',
    backgroundColor: 'transparent',
    top: 15, // Adjust based on your input size and padding
  },
  labelFocused: {
    transform: [{ translateY: -22 }, { scale: 0.8 }], // Adjust based on your needs
    backgroundColor: 'white',
    color: '#2196f3',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  touchableOpacityText: {
    color: 'white',
  },
});
