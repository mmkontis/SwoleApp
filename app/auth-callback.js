import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Platform, Text, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      if (Platform.OS === 'web') {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken && refreshToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('Error setting session:', error);
          } else {
            console.log('Session set successfully');
          }
        } else {
          console.error('Access token or refresh token not found in URL');
        }
      }

      // Redirect to home page regardless of the outcome
      router.replace('/');
    };

    handleAuth();
  }, [router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Logging you in...</Text>
    </View>
  );
}
