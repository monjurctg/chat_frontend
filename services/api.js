import axiosInstance from "./axiosInstance";


// Login
export const login = async (phone, password) => {
  try {
    const response = await axiosInstance.post('/api/auth/login', { phone, password });
    return response.data; // Expect { token, user }
  } catch (error) {
    console.error(`Login error: ${error.response?.status} - ${error.response?.data?.message}`);
    throw error;
  }
};


// Register
export const register = async (name, email,phone, password) => {
  try {
    const response = await axiosInstance.post('/api/auth/register', { name, email,phone, password });
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
export const getSuggestUser = async () => {
  try {
    const response = await axiosInstance.get('/api/user/suggest_user');
   console.log({response})
    return response.data; // Expect the chats list
  } catch (error) {

    console.error(`get Suggestuser error: ${error.response?.status} - ${error.response?.data?.message}`);
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





// Send Friend Request
export const sendFriendRequest = async (senderId, receiverId) => {
  try {
    const response = await axiosInstance.post('/api/user/sendRequest', {receiverId });
    return response.data; // Expect a success message or the updated friendship data
  } catch (error) {
    console.error(`sendFriendRequest error: ${error.response?.status} - ${error.response?.data?.message}`);
    throw error; // Re-throwing the error so it can be caught by the calling function
  }
};

// Cancel Friend Request
export const cancelFriendRequest = async (receiverId) => {
  try {
    const response = await axiosInstance.post('/api/user/removeFriend', { receiverId });
    return response.data; // Expect a success message or the updated friendship data
  } catch (error) {
    console.error(`cancelFriendRequest error: ${error.response?.status} - ${error.response?.data?.message}`);
    throw error; // Re-throwing the error so it can be caught by the calling function
  }
};

// Accept Friend Request
export const acceptFriendRequest = async (receiverId) => {
  try {
    const response = await axiosInstance.post('/api/user/respondRequest', {  receiverId });
    return response.data; // Expect a success message or the updated friendship data
  } catch (error) {
    console.error(`acceptFriendRequest error: ${error.response?.status} - ${error.response?.data?.message}`);
    throw error; // Re-throwing the error so it can be caught by the calling function
  }
};

