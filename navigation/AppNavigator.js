import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
// import ChatScreen from '../components/ChatScreen';
import GroupChatScreen from '../screens/GroupChatScreen';
import AuthContext from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { Text,AppState } from 'react-native';
import FriendList from '../screens/FriendList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatScreen from '../screens/ChatScreen';
import { disconnectSocket, initializeSocket, socket } from '../services/socket';

const Stack = createStackNavigator();


const AppNavigator = () => {
    const { isAuthenticated,user } = useContext(AuthContext);

    useEffect(() => {
      if (!user?.id) return;
      initializeSocket(user.id);
      const handleAppStateChange = (nextAppState) => {
        console.log({nextAppState})
        if (nextAppState === 'background' || nextAppState === 'inactive') {
          console.log('App moved to background or inactive state');
          disconnectSocket();
        }
        else if (nextAppState === 'active') {
          console.log('App moved to foreground');
          initializeSocket(user.id);
        }
      };

      const subscription = AppState.addEventListener('change', handleAppStateChange);

      return () => {
        subscription.remove();
        disconnectSocket();
      };
    }, [user?.id]);


if(!user && isAuthenticated) {

  setTimeout(async() => {
    const token = await AsyncStorage.getItem("token")
    if(!user && token){
      // await logoutUser()

    }

  }, 1000);

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

