// FullRepsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { supabase } from '../../lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/EvilIcons';

// Fetch reps from the database
async function fetchReps(Exercise_id) {
  const { data } = await supabase
    .from("Reps")
    .select("*")
    .eq("Exercise_id", Exercise_id)
    .order("created_at", { ascending: false }); // Order by the creation timestamp in descending order

  return data;
}

// TODO: Implement deleteRep function
async function deleteRep(Rep_id, onSuccess) {
  const {error} = await supabase.from("Reps").delete().eq("id", Rep_id);
  if (error) {
    console.error("Not Deleted");
  } else {
    console.log("Deleted");
    onSuccess(); // Call the onSuccess callback if the deletion was successful
  }
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
    <View style={styles.fullScreenContainer}>
      <LinearGradient
        style={styles.gradientBackground}
        colors={["#02AABD", "#00CDAC"]}
        start={{x: 0, y: 0.5}}
        end={{x: 1, y: 1}}
      >
        <ScrollView contentContainerStyle={styles.repGridContainer} style={styles.scrollViewTransparent}>
          <Text style={styles.exTitle}>Exercise Name: {exercise.Exercise}</Text>
          <Text style={styles.othTitle}>Full Reps List:</Text>
          <View style={styles.repGrid}>
            {reps.length > 0 ? reps.map((rep, index) => (
              <View key={index} style={styles.repGridItem}>
                <View style={styles.repItemRow}>
                  <Text>
                    {rep.Rep === 1
                      ? `1 rep of ${rep.Weight} lbs on ${new Date(rep.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                      : `${rep.Rep} reps of ${rep.Weight} lbs on ${new Date(rep.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                  </Text>
                  <Icon.Button
                    name="trash"
                    size={30}
                    color="#900"
                    backgroundColor="transparent" // Use transparent to avoid background color around the icon
                    iconStyle={{ marginRight: 0 }} // Adjust icon style if needed
                    onPress={() => {
                      deleteRep(rep.id, () => {
                        const updatedReps = reps.filter(r => r.id !== rep.id);
                        setReps(updatedReps);
                      });
                    }}>
                      Delete
                  </Icon.Button>
                </View>
              </View>
            )) : (
              <Text>No Reps Yet!</Text>
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollViewTransparent: {
    backgroundColor: 'transparent',
  },
  repGridContainer: {
    flexGrow: 1,
    alignItems: 'center', // Center content in the scroll view
    padding: 16,
  },
  repItemRow: {
    flexDirection: 'row',
    alignItems: 'center', // Align items vertically in the center
    justifyContent: 'space-between', // Adjust as needed, for example, to 'flex-start' to keep items closer
    backgroundColor: 'white',
    marginBottom: 5,
    padding: 10,
    borderRadius: 50
  },
  exTitle: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    backgroundColor: 'white',
  },
  othTitle: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',    
    backgroundColor: 'white',
  }
})
export default FullRepsScreen;
