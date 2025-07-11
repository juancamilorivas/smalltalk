import React, { useState } from "react";
import {
  Image,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";

import { signInWithEmailAndPassword } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUser } from "../reducers/user/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchPersonalData } from "../apiServices";
import logo from "../assets/logo.png";
import { StatusBar } from "react-native";

const LoginScreen = ({ navigation }) => {
  //STATES
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  //CONSTS
  const dispatch = useDispatch();

  //VERIFY EMAIL
  const isValidEmail = (email) => {
    const emailRegex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return emailRegex.test(String(email).toLowerCase());
  };

  //GUARDAR EN EL STORAGE
  const storeData = async (id, userData) => {
    try {
      await AsyncStorage.setItem("key", id);
      const jsonData = JSON.stringify(userData);
      await AsyncStorage.setItem("userData", jsonData);
    } catch (error){
      if (__DEV__) {
        console.error("Error async storage: ", error);
      }
    }
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    if (email === "") {
      Alert.alert(
        "¡Ups!",
        "Escribe un correo electrónico"
      );
      setIsLoading(false);
      return;
    }
    if (password === "") {
      Alert.alert(
        "¡Ups!",
        "Escribe una contraseña"
      );
      setIsLoading(false);
      return;
    }
    if (!isValidEmail) {
      Alert.alert(
        "¡Ups!",
        "El correo electrónico proporcionado no es válido."
      );
      setIsLoading(false);
      return;
    }

    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      dispatch(
        setUser({
          authentication: true,
          email: userCredential.user.email,
          accessToken: userCredential.user.accessToken,
          uid: userCredential.user.uid,
        })
      );

      const value = userCredential.user.uid;
      if (value) {
        const userData = await fetchPersonalData(value);
        if (userData) {
          storeData(value, userData);
        }
      }

      navigation.navigate("TabsNavigation");
    } catch (error) {
      if (__DEV__) {
        console.error("El correo no existe en la base de datos o es inválido.: ", error);
      } 
        Alert.alert(
          "¡Ups!",
          "El correo no existe en la base de datos o es inválido."
        );
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.loginContainer}>
   
          <Text style={styles.title}>SmallTalk</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              onChangeText={(text) => setEmail(text.trim().toLowerCase())}
              style={styles.input}
              value={email}
              placeholder="personal@mail.com"
              placeholderTextColor="#999"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              onChangeText={(text) => setPassword(text)}
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#999"
              secureTextEntry={true}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                Iniciar sesión
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("CreateAccountScreen")}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>
              Crear cuenta nueva
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

//STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  loginContainer: {
    width: "85%",
    maxWidth: 400,
    alignSelf: "center",
    paddingVertical: 40,
  },
  title: {
    fontSize: 34,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 30,
    textAlign: "center",
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000000",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "#ffffff",
    color: "#000000",
    fontSize: 16,
  },
  button: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#000000",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  secondaryButton: {
    marginTop: 25,
    alignSelf: "center",
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#000000",
    textDecorationLine: "underline",
  },
});

export default LoginScreen;