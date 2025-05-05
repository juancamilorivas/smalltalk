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
                  <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <ScrollView
        contentContainerStyle={{
          flex: 1,
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={styles.login}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <View>
            <Text style={{ fontSize: 17, fontWeight: "400", color: "#ffffff" }}>
              E-mail
            </Text>
            <TextInput
              onChangeText={(text) => setEmail(text.trim().toLowerCase())}
              style={styles.input}
              value={email}
              placeholder="personal@mail.com"
              placeholderTextColor="#373737"
            />
          </View>
          <View>
            <Text style={{ fontSize: 17, fontWeight: "400", color: "white" }}>
              Password
            </Text>
            <TextInput
              onChangeText={(text) => setPassword(text)}
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#373737"
              secureTextEntry={true}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#8c52ff" }]}
            // style={[styles.button, { backgroundColor: "#3A48F2" }]}
            onPress={handleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <Text style={{ fontSize: 17, fontWeight: "400", color: "white" }}>
                Iniciar sesion
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("CreateAccountScreen")}
          >
            <Text
              style={{
                fontSize: 17,
                fontWeight: "400",
                color: "white",
                paddingTop: 30,
              }}
            >
              Crear cuenta
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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  login: {
    width: 350,
    height: 500,
    borderColor: "#fff",
    borderRadius: 10,
    paddingh: 10,
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
  input: {
    width: 250,
    height: 40,
    borderColor: "#fff",
    borderWidth: 2,
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#ffffff90",
    marginBottom: 20,
  },
  button: {
    width: 250,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    borderColor: "#fff",
    borderWidth: 1,
  },
});

export default LoginScreen;
