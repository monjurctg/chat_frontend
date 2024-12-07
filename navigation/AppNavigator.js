import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../components/ChatScreen';
import GroupChatScreen from '../screens/GroupChatScreen';
import AuthContext from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { Text } from 'react-native';
import FriendList from '../screens/FriendList';

const Stack = createStackNavigator();

const AppNavigator = () => {
    const { isAuthenticated,user } = useContext(AuthContext);
    console.log(user,isAuthenticated)

if(!user && isAuthenticated) {
  return <Text>Loading...</Text>
}

  return (
    <>

<Stack.Navigator>
      {isAuthenticated ? (
        <>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="GroupChat" component={GroupChatScreen} />
        <Stack.Screen name="FriendList" component={FriendList} />


        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
    </>
  );
};

export default AppNavigator;

