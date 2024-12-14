import io from 'socket.io-client';
import { BASE_URL } from './axiosInstance';

export let socket;
const SOCKET_URL = BASE_URL; // Replace with your server URL

export const initializeSocket = (userId) => {
  // Establish the socket connection
  socket = io(SOCKET_URL, {
    transports: ['websocket'], // Use WebSocket for better performance
  });


  // Join the socket with the userId
  socket.emit('join', userId);
  socket.emit('userConnected', userId)

  socket.on('userStatus', (data) => {
    console.log(`${data.userId} is ${data.status}`);

  });

  // Listen for private messages
  socket.on('receiveMessage', (message) => {
    console.log('Private message received:', message);
    // Handle the received message (e.g., update the UI or store)
  });

  // Listen for group messages
  socket.on('group_message', (message) => {
    console.log('Group message received:', message);
    // Handle the received group message
  });

  // Listen for typing status
  socket.on('typing', (data) => {
    console.log(`${data.userId} is typing...`);
  });

  // Listen for stop typing status
  socket.on('stopTyping', (data) => {
    console.log(`${data.userId} stopped typing.`);
  });

  // Listen for message read status
  socket.on('messageRead', (messageId) => {
    console.log(`Message ${messageId} marked as read`);
  });
};

export const sendPrivateMessage = (data) => {
  if (socket) {
    socket.emit('privateMessage', data);
  }
};

export const sendGroupMessage = (data) => {
  if (socket) {
    socket.emit('groupMessage', data);
  }
};

export const markMessageAsRead = (messageId) => {
  if (socket) {
    socket.emit('markRead', { messageId });
  }
};

export const typing = (chatId, userId) => {
  if (socket) {
    socket.emit('typing', { chatId, userId });
  }
};

export const stopTyping = (chatId, userId) => {
  if (socket) {
    socket.emit('stopTyping', { chatId, userId });
  }
};

export const disconnectSocket = () => {
  console.log({socket})
  if (socket) {
    socket.disconnect();
    console.log('Socket manually disconnected');
    socket = null;
  }
};

export const getSocket = () => {
  if (!socket) {
    console.error('Socket not initialized!');
  }
  return socket;
};
