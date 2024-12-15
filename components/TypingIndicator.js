import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TypingIndicator = ({ usersTyping }) => {

  if (usersTyping.length === 0) return null;


  const typingText =
    usersTyping.length === 1
      ? `${usersTyping[0]} is typing...`
      : `${usersTyping.join(', ')} are typing...`;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{typingText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f3f3f3',
  },
  text: {
    color: '#555',
    fontStyle: 'italic',
  },
});

export default TypingIndicator;
