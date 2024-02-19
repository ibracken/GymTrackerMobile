import { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { supabase } from "../../lib/supabase";

export default function CreateExercise({ onExerciseCreated }) {
  const [Exercise, setExercise] = useState("");

  async function insertExercise() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!Exercise) {
        console.error("Please choose an exercise to create");
        return;
      }

      const { data, error } = await supabase.from("Exercises").insert({
        user_id: user.id,
        Exercise: Exercise,
      });

      if (error) {
        console.error("Not Inserted");
      } else {
        console.log("Created");
        if (onExerciseCreated) {
          onExerciseCreated();
        }
      }

      setExercise("");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={styles.otherGridItem}>
      <Text>Create Exercises: </Text>
      <TextInput
        style={styles.input}
        placeholder="Exercise"
        value={Exercise}
        onChangeText={setExercise}
      />
      <TouchableOpacity style={styles.touchableOpacity} onPress={insertExercise}>
        <Text style={styles.touchableOpacityText}>Add Exercise</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    fontSize: 18,
    marginTop: 5,
    marginBottom: 20, // Add margin to separate input from button
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
  otherGridItem: {
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
});
