import axiosInstance from "./axiosInstance";


// Login
export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post('/api/auth/login', { email, password });
    return response.data; // Expect { token, user }
  } catch (error) {
    console.error(`Login error: ${error.response?.status} - ${error.response?.data?.message}`);
    throw error;
  }
};

// Register
export const register = async (name, email, password) => {
  try {
    const response = await axiosInstance.post('/api/auth/register', { name, email, password });
    return response.data; // Expect { token, user }
  } catch (error) {
    console.log(error)
    console.error(`Register error: ${error.response?.status} - ${error.response?.data?.message}`);
    throw error;
  }
};

// Get Messages
export const getMessages = async (chatType, id) => {
  try {
    const response = await axiosInstance.get(`/api/chat/${chatType}/${id}`);
    return response.data; // Expect the messages data
  } catch (error) {
    console.error(`GetMessages error: ${error.response?.status} - ${error.response?.data?.message}`);
    throw error;
  }
};

// Get Chats
export const getChats = async () => {
  try {
    const response = await axiosInstance.get('/api/chat/list');
    console.log(response)
    return response.data; // Expect the chats list
  } catch (error) {
    console.log(error)
    console.error(`GetChats error: ${error.response?.status} - ${error.response?.data?.message}`);
    throw error;
  }
};



export const handleUpdateFace = async (userId, faceDescriptor) => {
  try {
    const response = await axiosInstance.post('/updateFace', {
      userId,
      faceDescriptor,
    });

    console.log(response.data.message); // Success message
  } catch (error) {
    console.error('Error updating face:', error);
  }
};
