    // Start of Selection
    import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from './firebaseConfig';
    
    export default function GoogleLoginScreen() {
      const [isSigninInProgress, setIsSigninInProgress] = useState(false);
    
      useEffect(() => {
        GoogleSignin.configure({
          webClientId: '1091064359251-aqjjvvjqjjqjjqjjqjjqjjqjjqjjqjjq.apps.googleusercontent.com',
        });
      }, []);
    
      const signIn = async () => {
        try {
          setIsSigninInProgress(true);
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          const tokens = await GoogleSignin.getTokens();
          const idToken = tokens.idToken;
          if (!idToken) {
            throw new Error('No idToken returned from Google Sign-In');
          }
          const credential = GoogleAuthProvider.credential(idToken);
          await signInWithCredential(auth, credential);
          router.replace('/(tabs)');
        } catch (error) {
          console.error('Google Sign-In Error:', error);
        } finally {
          setIsSigninInProgress(false);
        }
      };
    
      return (
        <View style={styles.container}>
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
