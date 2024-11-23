import { io } from 'socket.io-client';

const socket = io('http://<YOUR_BACKEND_URL>');

export const joinRoom = (roomId) => {
  socket.emit('join', roomId);
};

export const sendTyping = (chatId) => {
  socket.emit('typing', { chatId });
};

export const stopTyping = (chatId) => {
  socket.emit('stopTyping', { chatId });
};

export default socket;
