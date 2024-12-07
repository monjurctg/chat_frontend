import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { sendFriendRequest, cancelFriendRequest, acceptFriendRequest, getSuggestUser } from '../services/api'; // Importing the refactored functions
import FriendRequestCard from '../components/FriendRequestCard';
import AuthContext from '../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const [suggestUsers, setSuggestUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('findFriends');
  const { user } = useContext(AuthContext)
  let userId = user?.id

  // Fetch suggested users from the API
  const fetchSuggestUsers = async () => {
    try {
      const users = await getSuggestUser();
      setSuggestUsers(users);
    } catch (error) {
      console.error('Error fetching suggested users:', error);
      Alert.alert('Error', 'Failed to fetch suggested users. Please try again later.');
    }
  };

  // Handle sending friend request
  const handleSendFriendRequest = async (receiverId) => {
    try {
      const data = await sendFriendRequest(userId, receiverId);
      Alert.alert('Success', 'Friend Request Sent');

    } catch (error) {
      Alert.alert('Error', 'Failed to send friend request');
    }
  };

  // Handle canceling friend request
  const handleCancelFriendRequest = async (receiverId) => {
    try {
      const data = await cancelFriendRequest(receiverId);
      Alert.alert('Success', 'Friend Request Canceled');

    } catch (error) {
      Alert.alert('Error', 'Failed to cancel friend request');
    }
  };

  // Handle accepting friend request
  const handleAcceptFriendRequest = async (receiverId) => {

    try {
      const data = await acceptFriendRequest(receiverId);
      Alert.alert('Success', 'Friend Request Accepted');
      console.log(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to accept friend request');
    }
  };

  useEffect(() => {
    fetchSuggestUsers();
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

  const renderContent = () => {
    if (activeTab === 'findFriends') {
      return (
        <FlatList
          data={suggestUsers}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No suggested friends found.</Text>
          }
        />
      );
    } else {

      navigation.navigate('FriendList');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'findFriends' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('findFriends')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'findFriends' && styles.activeTabText,
            ]}
          >
            Find Friends
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'friendList' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('friendList')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'friendList' && styles.activeTabText,
            ]}
          >
            Friend List
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.header}>
        {activeTab === 'findFriends' ? 'Suggested Friends' : 'Your Friends'}
      </Text>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
   container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: '#007bff',
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  activeTabText: {
    color: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
});

export default HomeScreen;
