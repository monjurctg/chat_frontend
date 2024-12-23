import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { socket } from '../services/socket'; // Import socket instance
import TypingIndicator from '../components/TypingIndicator';
import AuthContext from '../context/AuthContext';

const ChatScreen = ({ route }) => {
  const { chatUser } = route.params;

  const { user } = useContext(AuthContext)
  let userId = user?.id

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [usersTyping, setUsersTyping] = useState([]);
  const chatId = chatUser?.id

  useEffect(() => {
    socket.emit('chatjoin', { chatId });

    // Receive new messages
    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });


    socket.on('typing', ({ userId:typingUserId }) => {

      const name = typingUserId==user?.id? user?.name:chatUser?.name
      setUsersTyping((prev) => {
        if (!prev.includes(name)) {
          return [...prev, name];
        }
        return prev;
      });
    });

    socket.on(`stopTyping`, ({ userId:typingUserId }) => {
      const name = typingUserId==user?.id? user?.name:chatUser?.name
      setUsersTyping((prev) => prev.filter((username) => username !== name));
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('typing');
      socket.off(`stopTyping`);
    };
  }, [chatId, usersTyping]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage =  {
        content: message,
        senderId: userId,
        chatId,
      }

      setMessage('');
      setMessages([...messages,newMessage])
      socket.emit('privateMessage',newMessage);
      socket.emit('stopTyping', { chatId, userId });
    }
  };



  const handleTyping = (text) => {
    setMessage(text);
    if (text) {
      socket.emit('typing', { chatId, userId });
    } else {
      socket.emit('stopTyping', { chatId, userId })
    }
  };





  return (
    <View style={styles.container}>
      <FlatList
      showsVerticalScrollIndicator={false}
        data={[...messages]?.reverse()}
        renderItem={({ item }) => {

          return  <View
          style={[
            styles.messageContainer,
            item?.senderId == userId
              ? styles.sentMessage
              : styles.receivedMessage,
          ]}
        >
          <Text style={styles.messageText}>{item.content}</Text>
        </View>
        }}
        keyExtractor={(item, index) => index.toString()}
        inverted // Display latest messages at the bottom
      />
      <TypingIndicator  usersTyping={usersTyping} />
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
   margin:10,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  sentMessage: {
    backgroundColor: '#007BFF',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#0005',
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
