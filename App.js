import React, { useEffect } from 'react';
// import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/AuthContext';
import AppNavigator from './navigation/AppNavigator';
import io from 'socket.io-client';
import { BASE_URL } from './services/axiosInstance';
const SOCKET_SERVER_URL = BASE_URL;
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
