import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { supabase } from "../../lib/supabase";
import { useState, useEffect } from 'react';
import CreateExercise from './create-exercise';
import DeleteButtonExercise from './delete-button';

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
  
  async function fetchReps(Exercise_id) {
  
    const { data } = await supabase
      .from("Reps")
      .select("*")
      .eq("Exercise_id", Exercise_id)
      .order("created_at", { ascending: false }) // Order by the creation timestamp in descending order
      .limit(3); // Limit the result to the three most recent reps
  
    return data;
  }
  
  async function fetchPR(Exercise_id) {
  
    const { data } = await supabase
      .from("Reps")
      .select("*")
      .eq("Exercise_id", Exercise_id)
      .order("Weight", { ascending: false }) // Order by "Weight" so largest is at the top
      .limit(1); // Limit the result to one row
  
    return data;
  }
  
  
  export default function PostList() {
    const [Exercises, setExercises] = useState([]);
    const [reps, setReps] = useState([]);
    const [PRs, setPRs] = useState([]);
    const [error, setError] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Fetch exercises on mount and whenever refreshTrigger changes
    useEffect(() => {
      async function fetchExercisesData() {
        try {
          const fetchedExercises = await fetchExercises();
          setExercises(fetchedExercises);
        } catch (error) {
          console.error("Error fetching exercises:", error);
          setError("Error fetching exercises");
        }
      }

      fetchExercisesData();
    }, [refreshTrigger]);
    // The useEffect occurs when the object change in the Array changes
    
    useEffect(() => {
      async function fetchRepsAndPRs() {
        try {
          const repsPromises = Exercises.map((exercise) => fetchReps(exercise.id));
          const repsResults = await Promise.all(repsPromises);
          setReps(repsResults);
    
          const PRPromises = Exercises.map((exercise) => fetchPR(exercise.id));
          const PRResults = await Promise.all(PRPromises);
          setPRs(PRResults);
        } catch (error) {
          console.error("Error fetching reps or PRs:", error);
          setError("Error fetching reps or PRs");
        }
      }
    
      if (Exercises.length > 0) {
        fetchRepsAndPRs();
      }
    }, [Exercises]);

    // Callback function to trigger a refresh from CreateExercise
    const handleExerciseCreated = () => {
      setRefreshTrigger((prev) => prev + 1); // Increment trigger to refresh exercise list
    };

    if(error) {
      console.error("Problem Creating Exercises(on callback)")
    }

    // Callback function to trigger a refresh from Delete Exercises
    const handleDataDeletion = () => {
      setRefreshTrigger((prev) => prev + 1); // Increment trigger to refresh exercise list
    };

    if(error) {
      console.error("Problem Deleting Exercises(on callback)")
    }

    return (
      <ScrollView contentContainerStyle={styles.accountGridContainer}>
        <CreateExercise onExerciseCreated={handleExerciseCreated} />
        <DeleteButtonExercise onExerciseDeleted={handleDataDeletion} />
        {Exercises?.map((exercise, exerciseIndex) => (
          <View key = {exercise.id}>
            <Text style={styles.accountGridTitle}>Recent {exercise.Exercise} Reps:</Text>
            <View style = {styles.accountGrid}>
              {reps[exerciseIndex]?.length > 0 ? (
                reps[exerciseIndex].map((rep) => (
                  <View key={rep.id} style={styles.accountGridItem}>
                    <Text>Reps: {rep.Rep}, Weight: {rep.Weight}lbs</Text>
                  </View>
                ))
              ) : (
                <Text>None</Text>
              )}
            </View>
            {PRs[exerciseIndex]?.map((rep) => (
              <View key={rep.id} style={styles.prGridItem}>
                <Text>Personal Record: {rep.Weight}lbs</Text>
              </View>
            ))}
            {/* Add Full Reps Page when ready */}



          </View>
        ))}
      </ScrollView>

    );
  }



  const styles = StyleSheet.create({
    accountGridContainer: {
      flex: 1,
      justifyContent: 'center',
      width: '100%',
    },
    accountGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 16,
      padding: 0,
    },
    accountGridItem: {
      backgroundColor: '#777', // Simplified for React Native
      padding: 16,
      borderRadius: 8,
      marginBottom: 20,
    },
    prGridItem: {
      backgroundColor: '#777', // Simplified for React Native
      padding: 16,
      borderRadius: 8,
      boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
    },
    accountGridTitle: {
      fontSize: 24,
      marginBottom: 16,
      textAlign: 'center',
      backgroundColor: '#777', // Simplified for React Native
      padding: 8,
      borderRadius: 8,
    },
    link: {
      padding: 16,
      marginTop: 16,
    },
    ul: {
      marginBottom: 20,
    },
  });
