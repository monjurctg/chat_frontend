import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../context/AuthContext';
import { TouchableOpacity } from 'react-native';
import { getFriendList } from '../services/api';
import { FlatList } from 'react-native';
import { Image } from 'react-native';

const FriendList = ({navigation}) => {
    const [activeTab, setActiveTab] = useState('friendList');
    const [friends,setFriends]=useState([])

    const { user } = useContext(AuthContext)
    let userId = user?.id

    const fetchFriendList = async () => {
        try {
          const data = await getFriendList();
        //   setSuggestUsers(users);
        setFriends(data?.friends)
        // console.log({users})
        } catch (error) {
          console.error('Error fetching suggested users:', error);
          Alert.alert('Error', 'Failed to fetch suggested users. Please try again later.');
        }
      };

      useEffect(()=>{
        fetchFriendList()

      },[])


  const renderItem = ({ item }) => {

  return <>
    <View style={styles.card}>
      <Image
        source={{ uri: 'https://via.placeholder.com/100' }} // Replace with your logo image URL
        style={styles.logo}
      />
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item?.receiver?.name}</Text>
        <TouchableOpacity style={styles.chatButton} onPress={() => navigation?.navigate("Chat",{chatId:item?.receiverId,userId:userId})}>
          <Text style={styles.chatButtonText}>Chat</Text>
        </TouchableOpacity>
      </View>
    </View>

   </>
};


  return (
    <View>
       <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'findFriends' && styles.activeTabButton,
          ]}
          onPress={() => navigation.navigate("Home")}
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

      <FlatList
          data={friends}
          columnWrapperStyle={{ justifyContent: 'space-around' }}
          renderItem={renderItem}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No suggested friends found.</Text>
          }
        />

    </View>
  )
}

export default FriendList

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
        marginTop:10
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
      card: {
        width: 180,
        padding: 20,
        marginEnd:10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5, // For Android shadow
        alignItems: 'center',
      },
      logo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
      },
      cardContent: {
        alignItems: 'center',
      },
      name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      chatButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
      },
      chatButtonText: {
        color: '#fff',
        fontSize: 16,
      },


})