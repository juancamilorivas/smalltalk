import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import { getUserChats, getOtherParticipant } from '../apiServices';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatsScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem("key");
        setUserId(userId);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    fetchUserData();
    
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
        }
        
        unsubscribeRef.current = getUserChats(userId, (fetchedChats) => {
          setChats(fetchedChats);
          setLoading(false);
        });
      }
      
      return () => {
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
          unsubscribeRef.current = null;
        }
      };
    }, [userId])
  );

  const renderChatItem = ({ item }) => {
    const otherUserId = getOtherParticipant(item, userId);
    const unreadCount = item.unreadCount?.[userId] || 0;
    
    return (
      <TouchableOpacity 
        style={styles.chatItem}
        onPress={() => navigation.navigate('ChatScreen', { 
          chatId: item.id, 
          otherUserId,
          chatTitle: `Chat con ${otherUserId}`
        })}
      >
        <View style={styles.chatInfo}>
          <Text style={styles.chatName}>Chat con {otherUserId}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage?.text || 'No hay mensajes'}
          </Text>
        </View>
        <View style={styles.chatMeta}>
          <Text style={styles.time}>
            {item.lastMessage?.sentAt?.toDate().toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            }) || ''}
          </Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tienes chats aún</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  chatInfo: {
    flex: 1,
    marginRight: 10,
  },
  chatName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  lastMessage: {
    color: '#666',
    marginTop: 3,
  },
  chatMeta: {
    alignItems: 'flex-end',
  },
  time: {
    color: '#999',
    fontSize: 12,
  },
  unreadBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default ChatsScreen;