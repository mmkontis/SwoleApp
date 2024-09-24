import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
};

export default function ChatScreen() {
  const { topic } = useLocalSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: `Let's talk about ${topic}. How can I help you?`, sender: 'ai' },
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        sender: 'user',
      };
      setMessages([...messages, newMessage]);
      setInputText('');
      // Here you would typically send the message to your AI backend
      // and then add the AI's response to the messages
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container} >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.topicTitle}>{topic}</Text>
        </View>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.messageBubble, item.sender === 'user' ? styles.userMessage : styles.aiMessage]}>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 10,
    
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20, // Added top margin

  },
  backButton: {
    padding: 10,
  },
  topicTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#8A2BE2',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#1A1A1A',
  },
  messageText: {
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    color: 'white',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#8A2BE2',
    borderRadius: 20,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});