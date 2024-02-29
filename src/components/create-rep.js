import React, { useState, useEffect } from 'react';
import { View, Alert, Text, TouchableOpacity, TextInput, StyleSheet} from "react-native";
import { supabase } from "../../lib/supabase";
import { SelectList } from 'react-native-dropdown-select-list'

// Fetch exercises from the database
async function fetchExercises() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    const { data } = await supabase
      .from("Exercises")
      .select("*")
      .eq("user_id", user.id);
  
    return data;
  }

export default function CreateRep({ onRepCreated, refreshTrigger }) {
    // State variables for the form inputs
  const [Weight, setWeight] = useState("");
  const [Reps, setReps] = useState("");
  const [Exercises, setExercises] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState("");
  const [isFocusedWeight, setIsFocusedWeight] = useState(false);
  const [isFocusedReps, setIsFocusedReps] = useState(false);
    // For the input label animation
  const handleFocusReps = () => setIsFocusedReps(true);
    // For the input label animation
  const handleFocusWeight = () => setIsFocusedWeight(true);
  const handleBlurReps = () => setIsFocusedReps(false);
  const handleBlurWeight = () => setIsFocusedWeight(false);

  
  const isValidWeight = Weight.length > 0;
  // Apply focused styles if input is focused or has a valid value
  const labelStyleWeight = [
    styles.repLabel,
    (isFocusedWeight || isValidWeight) && styles.labelFocused,
  ];

  const isValidReps = Reps.length > 0;
  // Apply focused styles if input is focused or has a valid value
  const labelStyleReps = [
    styles.repLabel,
    (isFocusedReps || isValidReps) && styles.labelFocused,
  ];

      // Fetch exercises data on component mount
    useEffect(() => {
        fetchExercisesData();
    }, [refreshTrigger]);

    async function fetchExercisesData() {
        try {
            const fetchedExercises = await fetchExercises();
            // Map fetched exercises to the format expected by SelectList
            const mappedExercises = fetchedExercises.map((exercise) => ({
            value: exercise.Exercise, //  'Exercise' is the property to display
            key: exercise.id, //  'id' is the unique identifier 
            }));
            setExercises(mappedExercises);
        } catch (error) {
            console.error("Error fetching exercises:", error);
        }
      }
  

  async function insertRep() {
    if (!Weight || !Reps || isNaN(Weight) || isNaN(Reps)) {
      Alert.alert("Please enter a valid weight and number of reps");
      return;
    }

    const { data: user } = await supabase.auth.getUser();

    const { error } = await supabase.from("Reps").insert({
    user_id: user.id,
    Exercise_id: selectedExerciseId,
    Weight: parseInt(Weight, 10),
    Rep: Reps,
    });
    
    if (selectedExerciseId === "") {
        console.log("Please select an exercise");
        Alert.alert("Please select an exercise");
    }
    else {
        console.log("Rep created successfully");
        if (onRepCreated) onRepCreated();

        // Reset the form fields
        setWeight("");
        setReps("");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select exercise to add rep:</Text>
      <SelectList 
        setSelected={setSelectedExerciseId} // Correctly bind setSelected to the ID
        data={Exercises} // Pass the correctly formatted exercises data
        boxStyles={styles.selectList} // Style the SelectList box
        placeholder = "Select an Exercise"
        onChangeText={setSelectedExerciseId}
        search={false}
      />
       <View style={styles.inputGroup}>
        <TextInput
          required
          style={[styles.input, (isFocusedWeight || isValidWeight) && styles.inputFocused]} // Apply focused styles if input is focused or has a valid value
          onChangeText={setWeight}
          value={Weight}
          onBlur={handleBlurWeight}
          onFocus={handleFocusWeight}
          autoCorrect={false}
          keyboardType = 'numeric'
        />
        <Text style={labelStyleWeight}>Weight</Text>
      </View>

      <View style={styles.inputGroup}>
        <TextInput
          required
          style={[styles.input, (isFocusedReps || isValidReps) && styles.inputFocused]} // Apply focused styles if input is focused or has a valid value
          onChangeText={setReps}
          value={Reps}
          onBlur={handleBlurReps}
          onFocus={handleFocusReps}
          autoCorrect={false}
          keyboardType = 'numeric'
        />
        <Text style={labelStyleReps}>Reps</Text>
      </View>

      <TouchableOpacity onPress={insertRep} style={styles.button}>
        <Text style={styles.buttonText}>Add Rep</Text>
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
  },
  inputGroup: {
    position: 'relative',
    marginTop: 15,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#9e9e9e',
    borderRadius: 16,
    padding: 10,
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  inputFocused: {
    borderColor: '#1a73e8',
  },
  repLabel: {
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
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  selectList: { 
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});
