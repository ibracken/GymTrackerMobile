import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Share } from 'react-native';
import { supabase } from "../../lib/supabase";
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import CreateExercise from './create-exercise';
import DeleteButtonExercise from './delete-exercises-button';
import CreateRep from './create-rep';
import LogoutButton from '../components/logout-button';


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

  async function shareButton(){
    const shareOptions = {
      // TODO add a link to the app when ready
      message: 'This is a message',
    }

    try {
      const result = await Share.share(shareOptions);
      if (result.action === Share.sharedAction) {
        console.log('Share was successful');
      } else if (result.action === Share.dismissedAction) {
        console.log('Share was dismissed');
      }
    } catch(error) {
      console.log('Error =>', error);
    }
  };
  

  // Fetch reps from the database
  async function fetchReps(Exercise_id) {
  
    const { data } = await supabase
      .from("Reps")
      .select("*")
      .eq("Exercise_id", Exercise_id)
      .order("created_at", { ascending: false }) // Order by the creation timestamp in descending order
      .limit(3); // Limit the result to the three most recent reps
  
    return data;
  }
  

  // Fetch the personal record (PR) from the database
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
    const navigation = useNavigation();

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
    
    // Fetch reps and PRs for each exercise after exercises are fetched
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
          setError("Error fetching reps or PRs");
        }
      }
    
      if (Exercises.length > 0) {
        fetchRepsAndPRs();
      }
    }, [Exercises]);



    
    // Callback functions to trigger refreshes
    const handleExerciseCreated = () => {
      setRefreshTrigger((prev) => prev + 1); // Increment trigger to refresh exercise list
    };

    if(error) {
      console.error("Problem Creating Exercises(on callback)")
    }
    
    const handleRepCreated = () => {
      setRefreshTrigger((prev) => prev + 1); // Increment trigger to refresh exercise list
    };

    if(error) {
      console.error("Problem Creating Rep(on callback)")
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
        <View style={styles.topContainer}>
          <LogoutButton style = {styles.logoutButton}/>
          <TouchableOpacity style={styles.shareButton} onPress={shareButton}>
          <Text style = {styles.buttonText}>Share</Text>
        </TouchableOpacity>
        </View>
        <CreateExercise onExerciseCreated={handleExerciseCreated} />
        <CreateRep onRepCreated={handleRepCreated} refreshTrigger={refreshTrigger} />
        <DeleteButtonExercise onExerciseDeleted={handleDataDeletion} refreshTrigger={refreshTrigger} />
        <Text style={styles.yourTitle}>Your Exercises:</Text>
        {Exercises?.map((exercise, exerciseIndex) => (
          <View style = {styles.container} key = {exercise.id}>
            <Text style={styles.yourTitle}>Recent {exercise.Exercise} Reps:</Text>
            <View style = {styles.accountGrid}>
              {reps[exerciseIndex]?.length > 0 ? (
                reps[exerciseIndex].map((rep) => (
                  <View key={rep.id} style={styles.accountGridItem}>
                    <Text>Reps: {rep.Rep}, Weight: {rep.Weight}lbs</Text>
                  </View>
                ))
              ) : (
                <Text>No Reps Yet!</Text>
              )}
            </View>
            {PRs[exerciseIndex]?.map((rep) => (
              <View key={rep.id} style={styles.prGridItem}>
                <Text>Personal Record: {rep.Weight}lbs</Text>
              </View>
            ))}
            <TouchableOpacity
              style={styles.fullRepsButton}
              onPress={() => navigation.navigate('FullReps', {exercise})}
            >
              <Text style = {styles.buttonText}>Full {exercise.Exercise} Reps</Text>
            </TouchableOpacity>
          </View>
        ))}
        <View style={styles.padding}>
        </View>
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
      padding: 16,
      borderRadius: 8,
      marginBottom: 20,
    },
    
    container: {
      padding: 16,
      borderRadius: 8,
      elevation: 1,
      marginBottom: 20,
    },
    fullRepsButton: {
      marginTop: 10,
      backgroundColor: '#007bff',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
    },
    link: {
      padding: 16,
      marginTop: 16,
    },
    shareButton: {
      marginTop: 10,
      backgroundColor: '#007bff',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    padding: {
      padding: 75,
    }, 
    prGridItem: {
      padding: 16,
      borderRadius: 8,
      boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
      alignItems: 'center',
    },
    ul: {
      marginBottom: 20,
    },
    topContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between', // This ensures the buttons are pushed to each side
      padding: 20,
    },
    yourTitle: {
      fontSize: 24,
      marginBottom: 16,
      textAlign: 'center',
    },
  });
