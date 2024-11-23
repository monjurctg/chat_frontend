import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BASE_URL = 'http://192.168.0.119:5000';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,

});

// Add a request interceptor if needed (e.g., for authentication tokens)
axiosInstance.interceptors.request.use(
  async (config) => {

    // Example: Attach token if available
    const token = await AsyncStorage.getItem('token'); // Adjust according to your auth strategy
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Export the instance
export default axiosInstance;
