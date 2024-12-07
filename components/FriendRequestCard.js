import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

import axiosInstance from '../services/axiosInstance';


const FriendRequestCard = ({ item, userId, onSendRequest, onCancelRequest, onAcceptRequest }) => {
  const [friendshipStatus, setFriendshipStatus] = useState(null);

  const [isSender, setIsSender] = useState(false);

  useEffect(() => {
    // Fetch friendship status when the component mounts or item changes
    const fetchFriendshipStatus = async () => {
      try {
        const response = await axiosInstance.get('/api/user/friend_status', {
          params: { receiverId: item.id },
        });

        setFriendshipStatus(response.data.status);

        setIsSender(response.data.senderId == userId);
      } catch (error) {
        console.error('Error fetching friendship status:', error);
      }
    };

    fetchFriendshipStatus();
  }, [item, isSender,userId]);

  const handleSendRequest = async () => {
    try {
      await onSendRequest(item.id);
      setFriendshipStatus('pending');
      setIsSender(true);
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const handleCancelRequest = async () => {
    try {
      await onCancelRequest(item.id);
      setFriendshipStatus('none');
    } catch (error) {
      console.error('Error canceling friend request:', error);
    }
  };

  const handleAcceptRequest = async () => {

    try {
      await onAcceptRequest(item.id); // Call accept request API
      setFriendshipStatus('accepted');
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleDeclineRequest = async () => {
    try {
      await onCancelRequest(item.id); // Use cancel request API for decline
      setFriendshipStatus('none');
    } catch (error) {
      console.error('Error declining friend request:', error);
    }
  };


  return (
    <View style={styles.card}>
      <Image
        source={{ uri: item?.profilePicture || 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png' }}
        style={styles.profileImage}
      />
      <Text style={styles.userName}>{item.name}</Text>

      {/* Conditional UI based on friendship status */}
      {friendshipStatus == 'pending' ? (
        isSender ? (
          <>
            <Text style={styles.statusText}>Friend Request Sent</Text>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelRequest}>
              <Text style={styles.buttonText}>Cancel Request</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptRequest}>
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.declineButton} onPress={handleDeclineRequest}>
              <Text style={styles.buttonText}>Decline</Text>
            </TouchableOpacity>
          </>
        )
      ) : friendshipStatus === 'accepted' ? (
        <Text style={styles.statusText}>You are friends</Text>
      ) : (
        <TouchableOpacity style={styles.sendButton} onPress={handleSendRequest}>
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
  acceptButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
  },
  declineButton: {
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
