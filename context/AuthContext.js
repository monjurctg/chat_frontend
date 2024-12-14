import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);


  const checkAuthStatus = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // Optionally set user data if you want
    }
  };


  useEffect(() => {
    getLoginUser()
  

  }, []);

  const getLoginUser = async () => {
    try {
      const response = await axiosInstance.get('/api/auth/getLoginUser');

      setUser(response.data?.user); // Set user state
      checkAuthStatus();
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          console.error("Unauthorized: Redirecting to login");
          logoutUser()
        }
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
