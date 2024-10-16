import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebaseConfig';
export default function GoogleLoginScreen() {
  const [isSigninInProgress, setIsSigninInProgress] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '1091064359251-aqjjvvjqjjqjjqjjqjjqjjqjjqjjqjjq.apps.googleusercontent.com', // Replace with your web client ID
    });
  }, []);

  const signIn = async () => {
    try {
          // Start of Selection
          setIsSigninInProgress(true);
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          const tokens = await GoogleSignin.getTokens();
          const credential = GoogleAuthProvider.credential(tokens.idToken);
          await signInWithCredential(auth, credential);
          router.replace('/(tabs)'); // Navigate to home screen after successful login
      console.error('Google Sign-In Error:', Error);
    } finally {
      setIsSigninInProgress(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <TouchableOpacity
        style={styles.googleButton}
        onPress={signIn}
        disabled={isSigninInProgress}
      >
        <Text style={styles.googleButtonText}>
          {isSigninInProgress ? 'Signing In...' : 'Sign in with Google'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
  },
  googleButton: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  googleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
