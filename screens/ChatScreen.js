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
import TypingIndicator from '../components/TypingIndicator';


const ChatScreen = ({ route }) => {
  const { chatId, userId } = route.params;
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [usersTyping, setUsersTyping] = useState([]);

  useEffect(() => {
    socket.emit('join', chatId); // Join the chat room

    // Receive message from other users
    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Handle typing event
    socket.on(`typing_${chatId}`, ({ userId: typingUserId }) => {
      if (!usersTyping.includes(typingUserId)) {
        setUsersTyping((prev) => [...prev, typingUserId]);
      }
    });

    // Handle stop typing event
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
    if (message.trim()) {
      socket.emit('privateMessage', {
        content: message,
        senderId: userId,
        receiverId: chatId,
      });
      setMessage('');
      stopTyping(chatId); // Stop typing event after sending a message
    }
  };

  const handleTyping = (text) => {
    setMessage(text);
    if (text) sendTyping(chatId); // Send typing event
    else stopTyping(chatId); // Stop typing event when the input is empty
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.senderId === userId
                ? styles.sentMessage
                : styles.receivedMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.content}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        inverted // Inverted to display the latest message at the bottom
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
    backgroundColor: '#f5f5f5',
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  sentMessage: {
    backgroundColor: '#007BFF',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#e6e6e6',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  sendButtonText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

export default ChatScreen;
