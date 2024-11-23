import React from 'react';
// import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/AuthContext';
import AppNavigator from './navigation/AppNavigator';

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        {/* <StatusBar style="auto" /> */}
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
