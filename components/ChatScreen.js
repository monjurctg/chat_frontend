import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import socket, { sendTyping, stopTyping } from '../services/socket';
import TypingIndicator from './TypingIndicator';

const ChatScreen = ({ route }) => {
  const { chatId, userId } = route.params;
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [usersTyping, setUsersTyping] = useState([]);

  useEffect(() => {
    socket.emit('join', chatId);

    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socket.on(`typing_${chatId}`, ({ userId: typingUserId }) => {
      if (!usersTyping.includes(typingUserId)) {
        setUsersTyping((prev) => [...prev, typingUserId]);
      }
    });

    socket.on(`stopTyping_${chatId}`, ({ userId: typingUserId }) => {
      setUsersTyping((prev) => prev.filter((id) => id !== typingUserId));
    });

    return () => {
      socket.off('receiveMessage');
      socket.off(`typing_${chatId}`);
      socket.off(`stopTyping_${chatId}`);
    };
  }, [chatId, usersTyping]);

  const sendMessage = () => {
    socket.emit('privateMessage', {
      content: message,
      senderId: userId,
      receiverId: chatId, // Replace with actual receiver/group ID
    });
    setMessage('');
    stopTyping(chatId);
  };

  const handleTyping = (text) => {
    setMessage(text);
    if (text) sendTyping(chatId);
    else stopTyping(chatId);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={styles.message}>
            <Text>{item.content}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <TypingIndicator usersTyping={usersTyping} />
      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={handleTyping}
          placeholder="Type a message..."
          style={styles.input}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 20,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  sendButtonText: {
    color: '#007BFF',
  },
});

export default ChatScreen;
