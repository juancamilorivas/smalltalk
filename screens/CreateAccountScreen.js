import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { faX } from "@fortawesome/free-solid-svg-icons/faX";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { initialAuth } from "../firebase";
import { useDispatch } from "react-redux";
import { setUser } from "../reducers/user/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { StatusBar } from "react-native";
import Toast from 'react-native-toast-message';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';

const CreateScreen = ({ navigation }) => {
 
  // STATES
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [celular, setCelular] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const [isFocus1, setIsFocus1] = useState(false);
  const [isFocus2, setIsFocus2] = useState(false);
  const [isFocus3, setIsFocus3] = useState(false);
  const [isFocus4, setIsFocus4] = useState(false);

  const [countryCodes, setCountryCodes] = useState([]);
  // Nuevos estados para los campos adicionales
  const [idiomaNativo, setIdiomaNativo] = useState("");
  const [paisOrigen, setPaisOrigen] = useState("");
  const [idiomaPracticando, setIdiomaPracticando] = useState("");

  // CONSTS
  const dispatch = useDispatch();

  React.useEffect(() => {
    const fetchCountryCodes = async () => {
      try {
        // Campos específicos: name (common), idd (root + suffixes), languages
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,idd,languages');
        const countries = await response.json();
        
        const formattedCountries = countries
          // Filtra países con idd.root y al menos un suffix
          .filter(country => country.idd?.root && country.idd?.suffixes?.length > 0)
          .map(country => ({
            label: `${country.name.common} (${country.idd.root}${country.idd.suffixes[0]})`,
            value: `${country.idd.root}${country.idd.suffixes[0]}`,
            countryName: country.name.common,
            languages: country.languages ? Object.values(country.languages) : []
          }))
          .sort((a, b) => a.countryName.localeCompare(b.countryName));
        
        setCountryCodes(formattedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
        // Datos de respaldo
        setCountryCodes([
          { label: "Colombia (+57)", value: "+57", countryName: "Colombia", languages: ["Spanish"] },
          { label: "Estados Unidos (+1)", value: "+1", countryName: "United States", languages: ["English"] },
          { label: "México (+52)", value: "+52", countryName: "Mexico", languages: ["Spanish"] },
        ]);
      }
    };
  
    fetchCountryCodes();
  }, []);

  // Mostrar toast de error
  const showErrorToast = (message) => {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: message,
      position: 'bottom',
    });
  };

  // Mostrar toast de éxito
  const showSuccessToast = (message) => {
    Toast.show({
      type: 'success',
      text1: 'Éxito',
      text2: message,
      position: 'bottom',
    });
  };


  // Función para validar y actualizar celular (solo números)
  const handleCelularChange = (text) => {
    const cleanedText = text.replace(/[^0-9]/g, "");
    setCelular(cleanedText);
  };

  // GUARDAR EN EL STORAGE
  const storeData = async (id, userData) => {
    try {
      await AsyncStorage.setItem("key", id);
      const jsonData = JSON.stringify(userData);
      await AsyncStorage.setItem("userData", jsonData);
    } catch (error) {
      if (__DEV__) {
        console.error("Error async storage: ", error);
      }
      showErrorToast("Error al guardar los datos locales");
    }
  };

  // CREATE STRIPE CUSTOMER
  const handleSubmit = async ({ name, email, userCredential }) => {
    try {
      // Validar que los nuevos campos no estén vacíos
      if (!idiomaNativo || !paisOrigen || !idiomaPracticando) {
        showErrorToast("Todos los campos de idiomas y país de origen son obligatorios");
        setIsLoading(false);
        await initialAuth.currentUser?.delete();
        return;
      }

      const response = await fetch(
        "https://app-zrcl5qd7da-uc.a.run.app/api/createstripecustomer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email }),
        }
      );

      if (response.ok) {
        const customer = await response.json();
        const selectedCountryData = countryCodes.find(country => country.value === selectedCountry);
        const userData = {
          email: userCredential.user.email,
          createdAt: new Date(),
          name: nombre,
          surname: apellidos,
          country: selectedCountryData?.countryName,
          cellPhone: celular,
          stripeCustomerId: customer.id,
          prefix: selectedCountry,
          nativeLanguage: idiomaNativo,
          isTutor: false,
          rating: 0,
          totalSessions: 0,
          originCountry: paisOrigen,
          activeToChat: false,
          activeToMeet: false,
          practicingLanguage: idiomaPracticando,
        };
        const uid = userCredential.user.uid;
        await storeData(uid, userData);

        try {
          const userDocRef = doc(db, "users", uid);
          await setDoc(userDocRef, userData);
          showSuccessToast("Cuenta creada exitosamente");
          navigation.navigate("TabsNavigation");
        } catch (error) {
          if (__DEV__) {
            console.error("Error guardando user: ", error);
          }
          await initialAuth.currentUser?.delete();
          showErrorToast("Error al crear la cuenta. Intente nuevamente.");
        }
      } else {
        const errorData = await response.json();
        if (__DEV__) {
          console.error(errorData.message);
        }
        await initialAuth.currentUser?.delete();
        showErrorToast("Error al crear el cliente de pago");
      }
    } catch (error) {
      if (__DEV__) {
        console.error("Error con crear user stripe: ", error);
      }
      if (initialAuth.currentUser) {
        await initialAuth.currentUser.delete();
      }
      showErrorToast("Error al completar el registro");
    }
  };

  // CREATE ACCOUNT
  const handleCreateAccount = async () => {
    // Validación de campos obligatorios
    if (!idiomaNativo || !paisOrigen || !idiomaPracticando) {
      showErrorToast("Todos los campos de idiomas y país de origen son obligatorios");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        initialAuth,
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
      
      await handleSubmit({
        name: nombre,
        email: email,
        userCredential: userCredential,
      });
    } catch (error) {
      setIsLoading(false);
      if (__DEV__) {
        console.error("Error creando user: ", error);
      }
      
      let errorMessage = "Error al crear la cuenta";
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "El correo electrónico ya está en uso";
          break;
        case 'auth/invalid-email':
          errorMessage = "El correo electrónico no es válido";
          break;
        case 'auth/weak-password':
          errorMessage = "La contraseña es demasiado débil";
          break;
        default:
          errorMessage = "Error al crear la cuenta";
      }
      
      showErrorToast(errorMessage);
    }
  };

  // Obtener lista de idiomas únicos de todos los países
  const getAllLanguages = () => {
    const languages = new Set();
    countryCodes.forEach(country => {
      if (country.languages && country.languages.length > 0) {
        country.languages.forEach(lang => languages.add(lang));
      }
    });
    return Array.from(languages).sort().map(lang => ({ label: lang, value: lang }));
  };

  // Obtener lista de países para el selector de país de origen
  const getCountriesList = () => {
    return countryCodes.map(country => ({
      label: country.countryName,
      value: country.countryName
    }));
  };

  const languagesList = getAllLanguages();
  const countriesList = getCountriesList();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <TouchableOpacity 
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <FontAwesomeIcon icon={faX} size={20} style={styles.iconArrowLeft} />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Crear cuenta</Text>



          {/* Nuevos campos agregados */}
          <View style={styles.dropdownContainer}>
            <Dropdown
              style={[styles.dropdown, isFocus2 && { borderColor: "#000" }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={languagesList}
              search
              maxHeight={250}
              labelField="label"
              valueField="value"
              placeholder="Idioma nativo"
              searchPlaceholder="Buscar idioma..."
              value={idiomaNativo}
              onFocus={() => setIsFocus2(true)}
              onBlur={() => setIsFocus2(false)}
              onChange={(item) => {
                setIdiomaNativo(item.value);
                setIsFocus2(false);
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color={isFocus2 ? "#000" : "#999"}
                  name="message1"
                  size={20}
                />
              )}
            />
          </View>



          <View style={styles.dropdownContainer}>
            <Dropdown
              style={[styles.dropdown, isFocus4 && { borderColor: "#000" }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={languagesList}
              search
              maxHeight={250}
              labelField="label"
              valueField="value"
              placeholder="Idioma que practica"
              searchPlaceholder="Buscar idioma..."
              value={idiomaPracticando}
              onFocus={() => setIsFocus4(true)}
              onBlur={() => setIsFocus4(false)}
              onChange={(item) => {
                setIdiomaPracticando(item.value);
                setIsFocus4(false);
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color={isFocus4 ? "#000" : "#999"}
                  name="message1"
                  size={20}
                />
              )}
            />
          </View>
          
          <TextInput
            onChangeText={(text) => setNombre(text.trim())}
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor="#999"
          />









          
          
          <TextInput
            onChangeText={(text) => setApellidos(text.trim())}
            style={styles.input}
            placeholder="Apellidos"
            placeholderTextColor="#999"
          />







               <View style={styles.dropdownContainer}>
            <Dropdown
              style={[styles.dropdown, isFocus1 && { borderColor: "#000" }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={countryCodes}
              search
              maxHeight={250}
              labelField="label"
              valueField="value"
              placeholder="Selecciona tu código"
              searchPlaceholder="Buscar país..."
              value={selectedCountry}
              onFocus={() => setIsFocus1(true)}
              onBlur={() => setIsFocus1(false)}
              onChange={(item) => {
                setSelectedCountry(item.value);
                setIsFocus1(false);
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color={isFocus1 ? "#000" : "#999"}
                  name="earth"
                  size={20}
                />
              )}
            />
          </View>
          
          <TextInput
            onChangeText={handleCelularChange}
            value={celular}
            style={styles.input}
            placeholder="Número celular"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            maxLength={15}
          />
          
          {/* <TextInput
            onChangeText={handleCedulaChange} 
            value={cedula}
            style={styles.input}
            placeholder="Cédula"
            placeholderTextColor="#999"
            keyboardType="numeric"
            maxLength={10}
          /> */}

          <View style={styles.dropdownContainer}>
            <Dropdown
              style={[styles.dropdown, isFocus3 && { borderColor: "#000" }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={countriesList}
              search
              maxHeight={250}
              labelField="label"
              valueField="value"
              placeholder="País de origen"
              searchPlaceholder="Buscar país..."
              value={paisOrigen}
              onFocus={() => setIsFocus3(true)}
              onBlur={() => setIsFocus3(false)}
              onChange={(item) => {
                setPaisOrigen(item.value);
                setIsFocus3(false);
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color={isFocus3 ? "#000" : "#999"}
                  name="enviromento"
                  size={20}
                />
              )}
            />
          </View>
          
     

          <TextInput
            onChangeText={(text) => setEmail(text.trim().toLowerCase())}
            value={email}
            style={styles.input}
            placeholder="personal@correo.com"
            placeholderTextColor="#999"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          
          <TextInput
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#999"
            secureTextEntry={true}
          />

     

       

       

          <TouchableOpacity
            style={styles.button}
            onPress={handleCreateAccount}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                Crear cuenta
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
};

// STYLES (se mantienen igual)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  iconArrowLeft: {
    color: "#000000",
  },
  formContainer: {
    width: "85%",
    maxWidth: 400,
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
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
  // Dropdown styles
  dropdownContainer: {
    width: "100%",
    marginBottom: 15,
  },
  dropdown: {
    height: 50,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "#ffffff",
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#999',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#000000",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    backgroundColor: "#ffffff",
    color: "#000000",
    borderBottomColor: "#e0e0e0",
    borderBottomWidth: 1,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});

export default CreateScreen;