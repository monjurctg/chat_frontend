import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';

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
    getLoginUser()
  }, []);

  const getLoginUser = async () => {
    try {
      const response = await axiosInstance.get('/api/auth/getLoginUser');
      setUser(response.data?.user); // Set user state directly
      console.log(response.data?.user); // Log the user's ID
    } catch (error) {
      if (error.response) {
        // Handle API response errors
        console.error(`Login error: ${error.response.status} - ${error.response.data?.message}`);
      } else {
        // Handle network or unexpected errors
        console.error(`Login error: ${error.message}`);
      }
    }
  };


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
