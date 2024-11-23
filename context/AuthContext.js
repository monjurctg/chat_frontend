import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);


  useEffect(() => {
    // Check if user is already logged in (using AsyncStorage for persistence)
    const checkAuthStatus = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
        // Optionally set user data if you want
      }
    };
    checkAuthStatus();
  }, []);

  const loginUser = async (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    await AsyncStorage.setItem('token', userData.token);
  };

  const logoutUser = async () => {
    setIsAuthenticated(false);
    setUser(null);
    await AsyncStorage.removeItem('token');
  };



  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
