import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import AuthContext from '../context/AuthContext';
import { TouchableOpacity } from 'react-native';

const FriendList = ({navigation}) => {
    const [activeTab, setActiveTab] = useState('friendList');
    const { user } = useContext(AuthContext)
    let userId = user?.id
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
        // marginBottom: 20,
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
})