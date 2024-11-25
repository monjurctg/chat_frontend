import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import axiosInstance from '../services/axiosInstance';

const FriendRequestCard = ({ item, onSendRequest, onCancelRequest, onAcceptRequest }) => {
  const [friendshipStatus, setFriendshipStatus] = useState(null);

  useEffect(() => {
    // Fetch friendship status when the component mounts or item changes
    const fetchFriendshipStatus = async () => {
      try {
        const response = await axiosInstance.get('/api/user/friend_status', {
          params: { receiverId: item.id },  // Send only receiverId
        });
        console.log({response})
        setFriendshipStatus(response.data.status); // 'pending', 'accepted', 'declined', or 'none'
      } catch (error) {
        console.error('Error fetching friendship status:', error);
      }
    };

    fetchFriendshipStatus();
  }, [item]);

  const handleSendRequest = () => {
    onSendRequest(item.id); // Send request to HomeScreen for handling
  };

  const handleCancelRequest = () => {
    onCancelRequest(item.id); // Send cancel request to HomeScreen for handling
  };

  const handleAcceptRequest = () => {
    onAcceptRequest(item.id); // Accept request via HomeScreen
  };

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: item?.profilePicture || 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png' }}
        style={styles.profileImage}
      />
      <Text style={styles.userName}>{item.name}</Text>

      {/* Handle different states of friendship status */}
      {friendshipStatus === 'pending' ? (
        <>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelRequest}
          >
            <Text style={styles.buttonText}>Cancel Request</Text>
          </TouchableOpacity>
        </>
      ) : friendshipStatus === 'accepted' ? (
        <Text style={styles.statusText}>You are friends</Text>
      ) : (
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendRequest}
        >
          <Text style={styles.buttonText}>Send Request</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  sendButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  statusText: {
    fontSize: 16,
    color: '#28a745',
    fontWeight: 'bold',
  },
});

export default FriendRequestCard;
