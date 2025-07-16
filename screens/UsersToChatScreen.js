import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  StyleSheet, 
  TouchableOpacity,
  FlatList,
  RefreshControl
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserById, getUsersByLanguage } from '../apiServices';

const UsersToChatScreen = ({ navigation }) => {
  // Estados
  const [currentUser, setCurrentUser] = useState(null);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);

  // Obtener usuario actual y cargar primeros compañeros
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await AsyncStorage.getItem("key");
        if (!userId) {
          navigation.navigate("LoginCreate");
          return;
        }

        const user = await getUserById(userId);
        if (!user) {
          throw new Error("Usuario no encontrado");
        }

        setCurrentUser(user);
        await loadPartners(user.practicingLanguage, true);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message || "Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigation]);

  // Función para cargar compañeros
  const loadPartners = async (language, isRefreshing = false) => {
    try {
      if (!language) return;

      setRefreshing(isRefreshing);
      
      const { users, lastVisible: newLastVisible } = await getUsersByLanguage({
        nativeLanguage: language,
        activeToChat: true,
        limit: 10,
        lastVisibleDoc: isRefreshing ? null : lastVisible
      });

      setHasMore(users.length === 10);
      setLastVisible(newLastVisible);

      if (isRefreshing) {
        setPartners(users);
      } else {
        setPartners(prev => [...prev, ...users]);
      }
    } catch (error) {
      console.error("Error loading partners:", error);
      setError(error.message || "Error al cargar compañeros");
    } finally {
      setRefreshing(false);
    }
  };

  // Handler para refresh
  const handleRefresh = () => {
    if (!currentUser?.practicingLanguage) return;
    loadPartners(currentUser.practicingLanguage, true);
  };

  // Handler para carga infinita
  const handleLoadMore = () => {
    if (!refreshing && hasMore && currentUser?.practicingLanguage) {
      loadPartners(currentUser.practicingLanguage);
    }
  };

  // Renderizar item de usuario
  const renderPartnerItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.partnerCard}
      onPress={() => navigation.navigate('UserProfile', { userId: item._id })}
    >
      <View style={styles.partnerHeader}>
        <Text style={styles.partnerName}>{item.name} {item.surname}</Text>
        <Text style={styles.partnerCountry}>{item.originCountry}</Text>
      </View>
      <Text style={styles.partnerLanguage}>
        Habla: {item.nativeLanguage}
      </Text>
      {item.bio && (
        <Text style={styles.partnerBio} numberOfLines={2}>
          {item.bio}
        </Text>
      )}
    </TouchableOpacity>
  );

  // Renderizar footer para loading
  const renderFooter = () => {
    if (!refreshing && hasMore) {
      return (
        <View style={styles.loadingFooter}>
          <ActivityIndicator size="small" color="#000000" />
        </View>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
        <Text style={styles.loadingText}>Buscando compañeros...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            setError(null);
            const fetchData = async () => {
              const userId = await AsyncStorage.getItem("key");
              if (userId) {
                const user = await getUserById(userId);
                if (user) {
                  setCurrentUser(user);
                  await loadPartners(user.practicingLanguage, true);
                }
              }
            };
            fetchData();
          }}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!currentUser?.practicingLanguage) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No estás aprendiendo ningún idioma actualmente.
        </Text>
        <Text style={styles.emptySubtext}>
          Actualiza tu perfil para encontrar compañeros.
        </Text>
      </View>
    );
  }

  if (partners.length === 0 && !refreshing) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No encontramos compañeros para practicar {currentUser.practicingLanguage}.
        </Text>
        <Text style={styles.emptySubtext}>
          Intenta refrescar más tarde.
        </Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
        >
          <Text style={styles.refreshButtonText}>Refrescar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Hablantes nativos de {currentUser.practicingLanguage}
      </Text>
      
      <FlatList
        data={partners}
        renderItem={renderPartnerItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#000000']}
            tintColor="#000000"
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#222',
    fontFamily: 'System',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  errorText: {
    color: '#000000',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'System',
    fontWeight: '600',
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  emptyText: {
    color: '#000000',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'System',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'System',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'System',
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  listContent: {
    paddingBottom: 16,
  },
  partnerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  partnerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'System',
  },
  partnerCountry: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'System',
  },
  partnerLanguage: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'System',
    marginBottom: 8,
  },
  partnerBio: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'System',
    lineHeight: 20,
  },
  loadingFooter: {
    paddingVertical: 20,
  },
  retryButton: {
    backgroundColor: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
  refreshButton: {
    backgroundColor: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  refreshButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
});

export default UsersToChatScreen;