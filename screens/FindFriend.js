import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { getChats, getSuggestUser } from '../services/api';

const FindFriend = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const[suggestUser,setSuggestUser]=useState([])

  const fetchSugestUser = async () => {
    const data = await getSuggestUser();
  
    setSuggestUser(data);
  };
  useEffect(() => {
    // Fetch chat list from API
    fetchSugestUser()
    // fetchChats();
  }, []);


 

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        navigation.navigate(item.isGroup ? 'GroupChat' : 'Chat', {
          chatId: item.id,
          name: item.name,
        })
      }
    >
      <Text style={styles.chatName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Home</Text>
      <TouchableOpacity>
        <Text>Find Friend</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text>Friend List</Text>
      </TouchableOpacity>
      {/* <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id.toString()}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chatItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  chatName: {
    fontSize: 18,
  },
});

export default FindFriend;
