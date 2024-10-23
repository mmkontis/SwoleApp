import BottomSheet from '@gorhom/bottom-sheet';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export function SettingsBottomSheet({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { signOut } = useAuth();
  const snapPoints = React.useMemo(() => ['50%'], []);

  return (
    <BottomSheet
      index={isOpen ? 0 : -1}
      snapPoints={snapPoints}
      onChange={(index) => {
        if (index === -1) onClose();
      }}
      enablePanDownToClose
    >
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        
        <Link href="/privacy-policy" asChild>
          <TouchableOpacity style={styles.option}>
            <Text>Privacy Policy</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/terms" asChild>
          <TouchableOpacity style={styles.option}>
            <Text>Terms of Service</Text>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity style={styles.option} onPress={signOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  signOutText: {
    color: 'red',
  },
});
