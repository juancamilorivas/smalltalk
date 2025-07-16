import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator,
  Image
} from 'react-native';
import { getUserChats, getOtherParticipant } from '../apiServices';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatsScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const unsubscribeRef = useRef({ unsubscribe: () => {} });

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
      // Limpieza al desmontar el componente
      if (unsubscribeRef.current && unsubscribeRef.current.unsubscribe) {
        unsubscribeRef.current.unsubscribe();
      }
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (!userId) return;

      // Obtener la suscripción
      const subscription = getUserChats(userId, (fetchedChats) => {
        setChats(fetchedChats);
        setLoading(false);
      });

      // Guardar la referencia para poder hacer unsubscribe
      unsubscribeRef.current = subscription;

      return () => {
        // Limpieza al salir de la pantalla
        if (subscription && subscription.unsubscribe) {
          subscription.unsubscribe();
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
            {item.lastMessage?.sentAt?.toDate()?.toLocaleTimeString([], { 
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
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={chats.length === 0 ? styles.emptyListContent : null}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {/* <Image 
              source={require('../assets/logo.png')} // Asegúrate de tener esta imagen
              style={styles.emptyIcon}
            /> */}
            <Text style={styles.emptyTitle}>No tienes chats</Text>
            <Text style={styles.emptySubtitle}>Inicia una conversación con alguien para ver los chats aquí</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    marginBottom: 20,
    tintColor: '#ccc',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    maxWidth: 300,
  },




  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
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
    color: '#333',
  },
  lastMessage: {
    color: '#666',
    marginTop: 3,
    fontSize: 14,
  },
  chatMeta: {
    alignItems: 'flex-end',
    minWidth: 70,
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