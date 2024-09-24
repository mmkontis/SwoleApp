import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const OnboardingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Onboarding Screen</Text>
      <Text style={styles.description}>
        This is where you can introduce new users to the app and guide them through the initial setup.
      </Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Get Started</Text>
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

export default OnboardingScreen;