import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import ScanScreen from '../(tabs)/scan';
import CameraScreen from '../CameraScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ScanScreen">
        <Stack.Screen name="ScanScreen" component={ScanScreen} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}