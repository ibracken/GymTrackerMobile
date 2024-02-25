import { Modal, StyleSheet, View, Text, TouchableOpacity } from 'react-native'

export default function WarningPopup({ show, handleClose, handleDelete}){
  return (
    <Modal
    visible={show}
    animationType="slide"
    transparent={true}
    onRequestClose={handleClose}
    > 
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.warningMessage}>Are you sure you want to delete this exercise?</Text>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
    modalOverlay: {
      // Overlay styling
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalContent: {
      // Modal content styling
      position: 'absolute', // React Native does not support 'fixed', but 'absolute' works similarly within a modal
      top: 50,
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 20,
      maxWidth: 400,
      width: '100%',
      alignSelf: 'center',
      textAlign: 'center',
      zIndex: 2,
    },
    warningMessage: {
      // Warning message styling
      color: '#050000',
      fontSize: 18,
      marginBottom: 20,
    },
    deleteButton: {
      // Delete button styling
      backgroundColor: 'rgb(187, 15, 15)',
      color: '#fff',
      paddingVertical: 10,
      paddingHorizontal: 20,
      margin: 5,
      borderRadius: 4,
    },
    cancelButton: {
      // Cancel button styling
      backgroundColor: '#ccc',
      paddingVertical: 10,
      paddingHorizontal: 20,
      margin: 5,
      borderRadius: 4,
    },
  });