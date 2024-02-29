// FullRepsScreen.js
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useState, useEffect } from 'react';

// Fetch reps from the database
async function fetchReps(Exercise_id) {

  const { data } = await supabase
    .from("Reps")
    .select("*")
    .eq("Exercise_id", Exercise_id)
    .order("created_at", { ascending: false }) // Order by the creation timestamp in descending order

  return data;
}

const FullRepsScreen = ({ route }) => {
  const { exercise } = route.params; // Extract the exercise parameter from the navigation route
  const [reps, setReps] = useState([]);
  
  useEffect(() => {
    // Immediately invoked async function within useEffect to fetch reps
    (async () => {
      if (exercise && exercise.id) {
        const fetchedReps = await fetchReps(exercise.id);
        setReps(fetchedReps);
      }
    })();
  }, [exercise]);
  
  return (
    <ScrollView>
      <View>
        {/* Display exercise details */}
        <Text>Exercise Name: {exercise.name}</Text>
        <Text>All Reps:</Text>
        {reps.map((rep, index) => (
          // Might want to double check on the rep values
          <Text key={index}>{rep.Rep} reps of {rep.Weight} weight at {new Date(rep.created_at).toLocaleString()}</Text>
        ))}
      </View>
    </ScrollView>
  )
};

export default FullRepsScreen;
