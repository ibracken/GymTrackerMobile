// FullRepsScreen.js
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
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
    <ScrollView contentContainerStyle={styles.repGridContainer}>  
      <View style = {styles.container}>
        {/* Display exercise details */}
        <Text style = {styles.yourTitle}>Exercise Name: {exercise.Exercise}</Text>
        <Text style = {styles.yourTitle}>Full Reps List:</Text>
        <View style = {styles.repGrid}>
          {reps.map((rep, index) => (
            <View key={index} style = {styles.repGridItem}>
              <Text key={index}>
                {rep.Rep === 1 
                  ? `1 rep of ${rep.Weight} lbs at ${new Date(rep.created_at).toLocaleString()}`
                  : `${rep.Rep} reps of ${rep.Weight} lbs at ${new Date(rep.created_at).toLocaleString()}`}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  )
};


const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    elevation: 1,
    marginBottom: 20,
  },
  repGridContainer: {
    flex: 1,
    width: '100%',
    padding: 16,
    backgroundColor: '#fff',
  },
  repGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    padding: 0,
  },
  repGridItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  yourTitle: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
})
export default FullRepsScreen;
