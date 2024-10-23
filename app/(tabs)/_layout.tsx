import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../../contexts/AuthContext';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Tabs 
          initialRouteName="scan"
          screenOptions={{
            headerShown: false,
            tabBarStyle: styles.tabBar,
            tabBarActiveTintColor: '#fff',
            tabBarInactiveTintColor: '#666',
            tabBarShowLabel: true,
            tabBarLabelStyle: styles.tabBarLabel,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Tab One',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="checkmark-circle-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="daily"
            options={{
              title: 'Daily',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="checkmark-circle-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="scan"
            options={{
              title: 'Scan',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="crop-free" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="coach"
            options={{
              title: 'coach',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />
              ),
            }}
          />
        </Tabs>
      </SafeAreaProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#000',
    borderTopWidth: 0,
    height: 60,
    paddingBottom: 5,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '400',
  },
});
