import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import socket, { joinRoom, sendTyping, stopTyping } from '../services/socket';
import TypingIndicator from '../components/TypingIndicator';
import { getMessages } from '../services/api';

const GroupChatScreen = ({ route }) => {
  const { chatId, name } = route.params;
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [usersTyping, setUsersTyping] = useState([]);

  useEffect(() => {
    // Join group chat room
    joinRoom(chatId);

    // Fetch previous messages
    const fetchMessages = async () => {
      const data = await getMessages('group', chatId);
      setMessages(data);
    };
    fetchMessages();

    // Listen for incoming messages
    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Listen for typing events
    socket.on(`typing_${chatId}`, ({ userId }) => {
      if (!usersTyping.includes(userId)) {
        setUsersTyping((prev) => [...prev, userId]);
      }
    });

    socket.on(`stopTyping_${chatId}`, ({ userId }) => {
      setUsersTyping((prev) => prev.filter((id) => id !== userId));
    });

    return () => {
      socket.off('receiveMessage');
      socket.off(`typing_${chatId}`);
      socket.off(`stopTyping_${chatId}`);
    };
  }, [chatId, usersTyping]);

  const sendMessage = () => {
    socket.emit('groupMessage', {
      content: message,
      senderId: 'YourUserID', // Replace with logged-in user ID
      chatId,
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
      <Text style={styles.header}>{name}</Text>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={styles.message}>
            <Text>{item.senderName}: {item.content}</Text>
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 10,
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

export default GroupChatScreen;
