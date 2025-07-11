

import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  View,
  Dimensions,
} from "react-native";
import { Skeleton } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser, faBan, faGear, faLocationDot, faWarehouse, faArrowRightFromBracket, faMoneyCheckDollar } from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "firebase/auth";
import { initialAuth } from "../firebase";
import { StatusBar } from "react-native";
// import { setGoBackScreen } from "../reducers/goBackScreen/goBackScreenSlice";
import { useDispatch } from "react-redux";

const ProfileScreen = ({ navigation }) => {
  // const dispatch = useDispatch();
  const [storedValue, setStoredValue] = useState(null);
  const [loading, setLoading] = useState(true);
  const windowWidth = Dimensions.get("window").width;

  // Tamaños responsive
  const boxWidth = (windowWidth - 60) / 2;
  const iconSize = windowWidth > 400 ? 28 : 25;

  // Función para cerrar sesión
  const handleSignOut = async () => {
    try {
      await signOut(initialAuth);
      await AsyncStorage.clear();
      navigation.navigate("LoginCreate");
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar sesión. Intenta de nuevo.");
    }
  };

  const confirmSignOut = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que quieres salir?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sí, salir", onPress: handleSignOut },
      ]
    );
  };

  // Obtener datos del usuario
  const getMyStringValue = async () => {
    try {
      const value = await AsyncStorage.getItem("key");
      setStoredValue(value);
    } catch (error) {
      navigation.navigate("LoginCreate");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyStringValue();
    // Simular carga
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {loading ? (
        <Skeleton 
          LinearGradientComponent={LinearGradient}
          animation="wave"
          width={200} 
          height={30} 
          style={[styles.skeleton, { alignSelf: 'center', marginVertical: 20 }]} 
        />
      ) : (
        <Text style={styles.mainTitle}>Opciones</Text>
      )}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.gridContainer}>
          {/* Fila 1 */}
          <View style={styles.row}>
            {loading ? (
              <Skeleton 
                LinearGradientComponent={LinearGradient}
                animation="wave"
                width={boxWidth} 
                height={100} 
                style={[styles.skeleton, styles.boxSkeleton]} 
              />
            ) : (
              <TouchableOpacity
                style={[styles.box, { width: boxWidth }]}
              >
                <FontAwesomeIcon icon={faUser} size={iconSize} color="#000000" />
                <Text style={styles.title}>Perfil</Text>
              </TouchableOpacity>
            )}

            {loading ? (
              <Skeleton 
                LinearGradientComponent={LinearGradient}
                animation="wave"
                width={boxWidth} 
                height={100} 
                style={[styles.skeleton, styles.boxSkeleton]} 
              />
            ) : (
              <TouchableOpacity
                style={[styles.box, { width: boxWidth }]}
             
              >
                <FontAwesomeIcon icon={faLocationDot} size={iconSize} color="#000000" />
                <Text style={styles.title}>Dirección</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Fila 2 */}
          <View style={styles.row}>
            {loading ? (
              <Skeleton 
                LinearGradientComponent={LinearGradient}
                animation="wave"
                width={boxWidth} 
                height={100} 
                style={[styles.skeleton, styles.boxSkeleton]} 
              />
            ) : (
              <TouchableOpacity
                style={[styles.box, { width: boxWidth }]}
              >
                <FontAwesomeIcon icon={faBan} size={iconSize} color="#000000" />
                <Text style={styles.title}>Prohibido</Text>
              </TouchableOpacity>
            )}

            {loading ? (
              <Skeleton 
                LinearGradientComponent={LinearGradient}
                animation="wave"
                width={boxWidth} 
                height={100} 
                style={[styles.skeleton, styles.boxSkeleton]} 
              />
            ) : (
              <TouchableOpacity
                style={[styles.box, { width: boxWidth }]}
           
              >
                <FontAwesomeIcon icon={faGear} size={iconSize} color="#000000" />
                <Text style={styles.title}>Cómo importar</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Fila 3 */}
          <View style={styles.row}>
            {loading ? (
              <Skeleton 
                LinearGradientComponent={LinearGradient}
                animation="wave"
                width={boxWidth} 
                height={100} 
                style={[styles.skeleton, styles.boxSkeleton]} 
              />
            ) : (
              <TouchableOpacity
                style={[styles.box, { width: boxWidth }]}
            
              >
                <FontAwesomeIcon icon={faWarehouse} size={iconSize} color="#000000" />
                <Text style={styles.title}>Casillero</Text>
              </TouchableOpacity>
            )}


            {loading ? (
              <Skeleton 
                LinearGradientComponent={LinearGradient}
                animation="wave"
                width={boxWidth} 
                height={100} 
                style={[styles.skeleton, styles.boxSkeleton]} 
              />
            ) : (
              <TouchableOpacity
                style={[styles.box, { width: boxWidth }]}
            
              >
                <FontAwesomeIcon icon={faMoneyCheckDollar} size={iconSize} color="#000000" />
                <Text style={styles.title}>Calcular envio</Text>
              </TouchableOpacity>
            )}

          </View>





          {/* Fila 4 */}
          <View style={styles.row}>
            {loading ? (
              <Skeleton 
                LinearGradientComponent={LinearGradient}
                animation="wave"
                width={boxWidth} 
                height={100} 
                style={[styles.skeleton, styles.boxSkeleton]} 
              />
            ) : (
              <TouchableOpacity
                style={[styles.box, { width: boxWidth }]}
                onPress={confirmSignOut}
              >
                <FontAwesomeIcon icon={faArrowRightFromBracket} size={iconSize} color="#5e17eb" />
                <Text style={styles.title}>Cerrar sesión</Text>
              </TouchableOpacity>
            )}
          </View>




        </View>
      </ScrollView>


    <View style={styles.containerLogo}>
      <Text style={styles.textLogo}>
        small<Text style={styles.letterBLogo}>T</Text>alk
      </Text>
    </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EEF1F2",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  gridContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  box: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    alignItems: "flex-start",
    justifyContent: "space-between",
    shadowColor: "#c4c4c4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    height: 100,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#232323",
    marginTop: 10,
  },
  mainTitle: {
    fontSize: 25,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
  },
  skeleton: {
    backgroundColor: '#ECECEC',
  },
  boxSkeleton: {
    borderRadius: 15,
    shadowColor: "#c4c4c4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  containerLogo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  textLogo: {
    fontSize: 14,
    fontWeight: 'bold', // Negrita aplicada al texto completo
  },
  letterBLogo: {
    color: '#5e17eb',
  },
});

export default ProfileScreen;