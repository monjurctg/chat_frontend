import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, StyleSheet } from 'react-native';
// Assuming this is the path to your FriendRequestCard component
import { sendFriendRequest, cancelFriendRequest, acceptFriendRequest ,getSuggestUser} from '../services/api'; // Importing the refactored functions
import FriendRequestCard from '../components/FriendRequestCard';


const HomeScreen = ({ navigation }) => {
  const [suggestUsers, setSuggestUsers] = useState([]);
  const [userId, setUserId] = useState(1); // Replace with actual user's ID from auth context or state

  // Fetch suggested users from the API
  const fetchSuggestUsers = async () => {
    try {
      const users = await getSuggestUser(); // Assume getSuggestUser is still here
      setSuggestUsers(users);  // Update state with fetched users
    } catch (error) {
      console.error('Error fetching suggested users:', error);
      Alert.alert('Error', 'Failed to fetch suggested users. Please try again later.');
    }
  };

  // Handle sending friend request
  const handleSendFriendRequest = async (receiverId) => {
    try {
      const data = await sendFriendRequest(userId, receiverId); // Call the sendFriendRequest function
      Alert.alert('Success', 'Friend Request Sent');
      console.log(data); // Optional: log the response from the backend
    } catch (error) {
      Alert.alert('Error', 'Failed to send friend request');
    }
  };

  // Handle canceling friend request
  const handleCancelFriendRequest = async (receiverId) => {
    try {
      const data = await cancelFriendRequest(userId, receiverId); // Call the cancelFriendRequest function
      Alert.alert('Success', 'Friend Request Canceled');
      console.log(data); // Optional: log the response from the backend
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel friend request');
    }
  };

  // Handle accepting friend request
  const handleAcceptFriendRequest = async (senderId) => {
    try {
      const data = await acceptFriendRequest(senderId, userId); // Call the acceptFriendRequest function
      Alert.alert('Success', 'Friend Request Accepted');
      console.log(data); // Optional: log the response from the backend
    } catch (error) {
      Alert.alert('Error', 'Failed to accept friend request');
    }
  };

  useEffect(() => {
    fetchSuggestUsers(); // Fetch suggested users on mount
  }, []);

  const renderItem = ({ item }) => (
    <FriendRequestCard
      userId={userId}
      item={item}
      onSendRequest={handleSendFriendRequest}
      onCancelRequest={handleCancelFriendRequest}
      onAcceptRequest={handleAcceptFriendRequest}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Suggested Friends</Text>
      <FlatList
        data={suggestUsers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
});

export default HomeScreen;
