import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SubscriptionPopup = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subscription Popup</Text>
      <Text style={styles.description}>
        Subscribe to our premium plan to unlock all features and get the best experience.
      </Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Subscribe Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#8A2BE2',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SubscriptionPopup;