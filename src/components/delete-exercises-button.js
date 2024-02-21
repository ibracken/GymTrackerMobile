import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
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


export default function DeleteButtonExercise({ onExerciseDeleted }) {
    const [selectedExerciseId, setSelectedExerciseId] = useState("");
    const [Exercises, setExercises] = useState([]);
    const [itemDeleted, setItemDeleted] = useState(false); // State to track if an item has been deleted
    const [showWarning, setShowWarning] = useState(false); // State showing/hiding the warning modal
    
    // Fetch exercises data on component mount
    useEffect(() => {
        fetchExercisesData();
    }, []);

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
        if(selectedExerciseId) {
          setShowWarning(true);
        }
      };
    
      const handleClose = () => {
        setShowWarning(false);
      };

      const handleDelete = async () => {
        try {
          // Check if a exercise is selected
          if (!selectedExerciseId) {
            console.error("Please select an exercise to delete");
            return;
          }

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
      <Text>Select Exercise to Delete: </Text>
      <SelectList 
        setSelected={setSelectedExerciseId} // Correctly bind setSelected to the ID
        data={Exercises} // Pass the correctly formatted exercises data
        boxStyles={styles.selectList} // Style the SelectList box
        placeholder = "Select an Exercise"
        onChangeText={setSelectedExerciseId}
        search={false}
      />
      <TouchableOpacity style={styles.button}  onPress={handleDelete}>
        <Text>Delete Exercise</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  otherGridItem: {
    padding: 16,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 20,
    elevation: 1, // for Android shadow
    backgroundColor: '#777', // Adjusted for React Native
  },
  button: {
    marginTop: 10,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  selectList: { // Optional styling for SelectList
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
});