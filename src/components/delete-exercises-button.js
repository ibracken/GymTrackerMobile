import { useState, useEffect } from "react";
import { Alert, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { supabase } from "../../lib/supabase";
import { SelectList } from 'react-native-dropdown-select-list'
import WarningPopup from './warning-popup';

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


export default function DeleteButtonExercise({ onExerciseDeleted, refreshTrigger }) {
    const [selectedExerciseId, setSelectedExerciseId] = useState("");
    const [Exercises, setExercises] = useState([]);
    const [itemDeleted, setItemDeleted] = useState(false); // State to track if an item has been deleted
    const [showWarning, setShowWarning] = useState(false); // State showing/hiding the warning modal
    
    // Fetch exercises data on component mount
    useEffect(() => {
        fetchExercisesData();
    }, [refreshTrigger]);

    // Update the SelectList when the exercises data changes
    useEffect(() => {
      if (itemDeleted) {
          // Item has been deleted, reset the selectedExerciseId to clear the SelectList
          setSelectedExerciseId("");
          setItemDeleted(false); // Reset itemDeleted state to allow for future deletions
          fetchExercisesData(); // Fetch exercises data to refresh the SelectList
      }
    }, [itemDeleted]);


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

    const handleShow = () => {
      if (!selectedExerciseId) {
          // If no exercise is selected, show an alert instead of the modal
          Alert.alert("Please select an exercise to delete");
      } else {
          // If an exercise is selected, show the warning modal
          setShowWarning(true);
      }
  };
  
    
      const handleClose = () => {
        setShowWarning(false);
      };

      const handleDelete = async () => {
        try {
          // Delete Reps associated with the selected exercise from Supabase
          await supabase.from("Reps").delete().eq("Exercise_id", selectedExerciseId);

        
          // Delete the selected exercise from Supabase
          const {error} = await supabase.from("Exercises").delete().eq("id", selectedExerciseId);

          if (error) {
            console.error("Not Deleted");
          } else {
            console.log("Deleted");
            // If a callback function is provided, call it after the exercise is deleted
            if (onExerciseDeleted) {
              onExerciseDeleted();
            }
            setItemDeleted(true); // Indicate that an item has been deleted
          }
          // Clear the selected exercise after deletion
          setSelectedExerciseId("");
          // Close the warning modal(when ready to implement the modal)
          handleClose();

        } catch (error) {
          console.error("Error deleting exercise:", error);
        }
  };

  // Render Function
  return (
    <View style={styles.otherGridItem}>
      <Text style={styles.title}>Select Exercise to Delete: </Text>
      <SelectList 
        setSelected={setSelectedExerciseId} // Correctly bind setSelected to the ID
        data={Exercises} // Pass the correctly formatted exercises data
        boxStyles={styles.selectList} // Style the SelectList box
        placeholder = "Select an Exercise"
        onChangeText={setSelectedExerciseId}
        search={false}
      />
      <TouchableOpacity style={styles.button}  onPress={handleShow}>
        <Text style={styles.buttonText}>Delete Exercise</Text>
      </TouchableOpacity>
      <WarningPopup
        show={showWarning}
        handleClose={handleClose}
        handleDelete={handleDelete}
      />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  otherGridItem: {
    padding: 16,
    marginBottom: 20,
    elevation: 1, // for Android shadow
  },
  button: {
    marginTop: 10,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
  selectList: { // Optional styling for SelectList
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
});