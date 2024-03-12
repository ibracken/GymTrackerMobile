// FullRepsScreen.js
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/EvilIcons';




// Fetch reps from the database
async function fetchReps(Exercise_id) {

  const { data } = await supabase
    .from("Reps")
    .select("*")
    .eq("Exercise_id", Exercise_id)
    .order("created_at", { ascending: false }) // Order by the creation timestamp in descending order

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
    <ScrollView contentContainerStyle={styles.repGridContainer}>
      <View style={styles.container}>
        <Text style={styles.yourTitle}>Exercise Name: {exercise.Exercise}</Text>
        <Text style={styles.yourTitle}>Full Reps List:</Text>
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
          )): (
            <Text>No Reps Yet!</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
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
    gap: 10,
    padding: 0,
  },
  repGridItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  repItemRow: {
    flexDirection: 'row',
    alignItems: 'center', // Align items vertically in the center
    justifyContent: 'space-between', // Adjust as needed, for example, to 'flex-start' to keep items closer
  },
  yourTitle: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
})
export default FullRepsScreen;
