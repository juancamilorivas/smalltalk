import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

const TutorsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Encuentra compañeros</Text>
        <Text style={styles.headerSubtitle}>Practica idiomas con personas alrededor del mundo</Text>
      </View>

      <View style={styles.buttonsContainer}>
        {/* Botón para Meet */}
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('MeetUsers')}
        >
          <View style={styles.buttonIconContainer}>
            <Ionicons name="videocam" size={24} color="white" />
          </View>
          <View style={styles.buttonTextContainer}>
            <Text style={styles.buttonTitle}>Encuentra para Meet</Text>
            <Text style={styles.buttonSubtitle}>Video llamadas para practicar</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="black" />
        </TouchableOpacity>

        {/* Botón para Chat */}
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('UsersToChat')}
        >
          <View style={styles.buttonIconContainer}>
            <Ionicons name="chatbubbles" size={24} color="white" />
          </View>
          <View style={styles.buttonTextContainer}>
            <Text style={styles.buttonTitle}>Encuentra para Chat</Text>
            <Text style={styles.buttonSubtitle}>Conversaciones por mensajes</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },
  header: {
    marginTop: 24,
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'black',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  buttonsContainer: {
    marginTop: 16,
  },
  actionButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  buttonIconContainer: {
    backgroundColor: 'black',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
    marginBottom: 4,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
})

export default TutorsScreen