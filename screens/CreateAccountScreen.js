








// import React, { useState } from "react";
// import {
//   Text,
//   StyleSheet,
//   View,
//   TouchableOpacity,
//   TextInput,
//   ScrollView,
//   ActivityIndicator,
//   SafeAreaView,
// } from "react-native";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { faX } from "@fortawesome/free-solid-svg-icons/faX";
// import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
// import { initialAuth } from "../firebase";
// import { useDispatch } from "react-redux";
// import { setUser } from "../reducers/user/userSlice";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { db } from "../firebase";
// import { doc, setDoc } from "firebase/firestore";
// import { StatusBar } from "react-native";
// import Toast from 'react-native-toast-message';


// const CreateScreen = ({ navigation }) => {
//   const MAX_RETRIES = 3;
//   let retries = 0;

//   // STATES
//   const [email, setEmail] = useState("");
//   const [nombre, setNombre] = useState("");
//   const [apellidos, setApellidos] = useState("");
//   const [cedula, setCedula] = useState("");
//   const [celular, setCelular] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = React.useState(false);

//   // CONSTS
//   const dispatch = useDispatch();
//   const lowerCaseEmail = email.toLowerCase();

//   // Mostrar toast de error
//   const showErrorToast = (message) => {
//     Toast.show({
//       type: 'error',
//       text1: 'Error',
//       text2: message,
//       position: 'bottom',
//     });
//   };

//   // Mostrar toast de éxito
//   const showSuccessToast = (message) => {
//     Toast.show({
//       type: 'success',
//       text1: 'Éxito',
//       text2: message,
//       position: 'bottom',
//     });
//   };

//   // Función para validar y actualizar cédula (solo números)
//   const handleCedulaChange = (text) => {
//     const cleanedText = text.replace(/[^0-9]/g, "");
//     setCedula(cleanedText);
//   };

//   // Función para validar y actualizar celular (solo números)
//   const handleCelularChange = (text) => {
//     const cleanedText = text.replace(/[^0-9]/g, "");
//     setCelular(cleanedText);
//   };

//   // GUARDAR EN EL STORAGE
//   const storeData = async (id, userData) => {
//     try {
//       await AsyncStorage.setItem("key", id);
//       const jsonData = JSON.stringify(userData);
//       await AsyncStorage.setItem("userData", jsonData);
//     } catch (error) {
//       if (__DEV__) {
//         console.error("Error async storage: ", error);
//       }
//       showErrorToast("Error al guardar los datos locales");
//     }
//   };


//   // CREATE STRIPE CUSTOMER
//   const handleSubmit = async ({ name, email, userCredential }) => {
//     try {
//       const response = await fetch(
//         "https://app-zrcl5qd7da-uc.a.run.app/api/createstripecustomer",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ name, email }),
//         }
//       );

//       if (response.ok) {
//         const customer = await response.json();
//         const userData = {
//           email: userCredential.user.email,
//           createdAt: new Date(),
//           name: nombre,
//           surname: apellidos,
//           country: "Colombia",
//           nit: cedula,
//           cellPhone: celular,
//           stripeCustomerId: customer.id,
//           destinationAddress: "",
//           destinyDaneCode: "",
//           locationName: "",
//           departamento: "",
//           prefix: "+057",
//           nitType: "CC", 
//         };
//         const uid = userCredential.user.uid;
//         await storeData(uid, userData);

//         try {
//           const userDocRef = doc(db, "users", uid);
//           await setDoc(userDocRef, userData);
//           showSuccessToast("Cuenta creada exitosamente");
//           navigation.navigate("TabsNavigation");
//         } catch (error) {
//           if (__DEV__) {
//             console.error("Error guardando user: ", error);
//           }
//           await initialAuth.currentUser?.delete();
//           showErrorToast("Error al crear la cuenta. Intente nuevamente.");
//         }
//       } else {
//         const errorData = await response.json();
//         if (__DEV__) {
//           console.error(errorData.message);
//         }
//         await initialAuth.currentUser?.delete();
//         showErrorToast("Error al crear el cliente de pago");
//       }
//     } catch (error) {
//       if (__DEV__) {
//         console.error("Error con crear user stripe: ", error);
//       }
//       if (initialAuth.currentUser) {
//         await initialAuth.currentUser.delete();
//       }
//       showErrorToast("Error al completar el registro");
//     }
//   };

//   // CREATE ACCOUNT
//   const handleCreateAccount = async () => {
//     try {
//       const userCredential = await createUserWithEmailAndPassword(
//         initialAuth,
//         email,
//         password
//       );

//       dispatch(
//         setUser({
//           authentication: true,
//           email: userCredential.user.email,
//           accessToken: userCredential.user.accessToken,
//           uid: userCredential.user.uid,
//         })
//       );
      
//       await handleSubmit({
//         name: nombre,
//         email: email,
//         userCredential: userCredential,
//       });
//     } catch (error) {
//       setIsLoading(false);
//       if (__DEV__) {
//         console.error("Error creando user: ", error);
//       }
      
//       let errorMessage = "Error al crear la cuenta";
//       switch (error.code) {
//         case 'auth/email-already-in-use':
//           errorMessage = "El correo electrónico ya está en uso";
//           break;
//         case 'auth/invalid-email':
//           errorMessage = "El correo electrónico no es válido";
//           break;
//         case 'auth/weak-password':
//           errorMessage = "La contraseña es demasiado débil";
//           break;
//         default:
//           errorMessage = "Error al crear la cuenta";
//       }
      
//       showErrorToast(errorMessage);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#000000" />

//       <TouchableOpacity onPress={() => navigation.goBack()}>
//         <FontAwesomeIcon icon={faX} size={25} style={styles.iconArrowLeft} />
//       </TouchableOpacity>

//       <ScrollView
//         contentContainerStyle={{
//           width: "100%",
//           alignItems: "center",
//           justifyContent: "start",
//           marginTop: 10,
//         }}
//       >
//         <View style={styles.login}>
//           <View>
//             <TextInput
//               onChangeText={(text) => setNombre(text.trim())}
//               style={styles.input}
//               placeholder="Nombre"
//               placeholderTextColor="#373737"
//             />
//           </View>
//           <View>
//             <TextInput
//               onChangeText={(text) => setApellidos(text.trim())}
//               style={styles.input}
//               placeholder="Apellidos"
//               placeholderTextColor="#373737"
//             />
//           </View>
//           <View>
//             <TextInput
//               onChangeText={handleCedulaChange} 
//               value={cedula}
//               style={styles.input}
//               placeholder="Cédula"
//               placeholderTextColor="#373737"
//               keyboardType="numeric"
//               maxLength={10}
//             />
//           </View>
//           <View>
//             <TextInput
//               style={styles.input}
//               placeholder="+057"
//               value={"+057"}
//               placeholderTextColor="#373737"
//               editable={false}
//             />
//           </View>
//           <View>
//             <TextInput
//               onChangeText={handleCelularChange}
//               value={celular}
//               style={styles.input}
//               placeholder="Número celular"
//               placeholderTextColor="#373737"
//               keyboardType="phone-pad"
//               maxLength={10}
//             />
//           </View>

//           <View>
//             <TextInput
//               onChangeText={(text) => setEmail(text.trim().toLowerCase())}
//               value={email}
//               style={styles.input}
//               placeholder="personal@correo.com"
//               placeholderTextColor="#373737"
//             />
//           </View>
//           <View>
//             <TextInput
//               onChangeText={(text) => setPassword(text)}
//               style={styles.input}
//               placeholder="Contraseña"
//               placeholderTextColor="#373737"
//               secureTextEntry={true}
//             />
//           </View>

//           <TouchableOpacity
//             style={[styles.button, { backgroundColor: "#EE6B6B" }]}
//             onPress={handleCreateAccount}
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <ActivityIndicator size="large" color="#fff" />
//             ) : (
//               <Text
//                 style={{ fontSize: 17, fontWeight: "400", color: "#ffffff" }}
//               >
//                 Crear cuenta
//               </Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//       <Toast />
//     </SafeAreaView>
//   );
// };

// // STYLES
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     justifyContent: "start",
//     backgroundColor: "#000000",
//   },
//   image: {
//     width: "100%",
//     height: "100%",
//     resizeMode: "cover",
//   },
//   login: {
//     borderColor: "gray",
//     borderRadius: 10,
//     alignItems: "center",
//     marginBottom: 30,
//   },
//   logo: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     borderColor: "#fff",
//     borderWidth: 2,
//     marginVertical: 30,
//   },
//   input: {
//     width: 290,
//     height: 50,
//     borderColor: "gray",
//     borderWidth: 2,
//     borderWidth: 2,
//     borderRadius: 10,
//     padding: 10,
//     marginVertical: 10,
//     backgroundColor: "#000000",
//     marginBottom: 20,
//     color: "white",
//     fontSize: 18,
//   },
//   button: {
//     width: 270,
//     height: 50,
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     marginVertical: 10,
//     borderColor: "#fff",
//     borderWidth: 1,
//   },
//   iconArrowLeft: {
//     color: "#ffffff",
//     marginTop: 30,
//     marginLeft: 30,
//     marginBottom: 10,
//   },
// });

// export default CreateScreen;


















































// import React, { useState, useEffect } from "react";
// import {
//   Text,
//   StyleSheet,
//   View,
//   TouchableOpacity,
//   TextInput,
//   ScrollView,
//   ActivityIndicator,
//   SafeAreaView,
// } from "react-native";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { faX } from "@fortawesome/free-solid-svg-icons/faX";
// import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
// import { initialAuth } from "../firebase";
// import { useDispatch } from "react-redux";
// import { setUser } from "../reducers/user/userSlice";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { db } from "../firebase";
// import { doc, setDoc } from "firebase/firestore";
// import { StatusBar } from "react-native";
// import Toast from 'react-native-toast-message';
// import { Dropdown } from "react-native-element-dropdown";
// import { AntDesign } from '@expo/vector-icons';

// const CreateScreen = ({ navigation }) => {
//   const MAX_RETRIES = 3;
//   let retries = 0;

//   // STATES
//   const [email, setEmail] = useState("");
//   const [nombre, setNombre] = useState("");
//   const [apellidos, setApellidos] = useState("");
//   const [cedula, setCedula] = useState("");
//   const [celular, setCelular] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = React.useState(false);
//   const [countryCodes, setCountryCodes] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState(null);
//   const [isFocus, setIsFocus] = useState(false);

//   // CONSTS
//   const dispatch = useDispatch();
//   const lowerCaseEmail = email.toLowerCase();






//   // Obtener códigos de países al cargar el componente
//   useEffect(() => {
//     const fetchCountryCodes = async () => {
//       try {
//         const response = await fetch('https://restcountries.com/v3.1/all');
//         const data = await response.json();
        
//         const formattedCodes = data
//           .filter(country => country.idd?.root && country.idd?.suffixes)
//           .map(country => ({
//             label: `${country.name.common} (${country.idd.root}${country.idd.suffixes[0]})`,
//             value: `${country.idd.root}${country.idd.suffixes[0]}`,
//             countryName: country.name.common
//           }))
//           .sort((a, b) => a.countryName.localeCompare(b.countryName));

//         setCountryCodes(formattedCodes);
        
//         // Establecer Colombia como valor por defecto
//         const colombia = formattedCodes.find(code => code.countryName === "Colombia");
//         if (colombia) {
//           setSelectedCountry(colombia.value);
//         }
//       } catch (error) {
//         console.error("Error fetching country codes:", error);
//         // Si falla la API, usar datos por defecto
//         setCountryCodes([
//           { label: "Colombia (+57)", value: "+57", countryName: "Colombia" },
//           { label: "México (+52)", value: "+52", countryName: "México" },
//           { label: "Argentina (+54)", value: "+54", countryName: "Argentina" },
//           // Puedes agregar más países aquí como respaldo
//         ]);
//         setSelectedCountry("+57");
//       }
//     };

//     fetchCountryCodes();
//   }, []);







//   // Mostrar toast de error
//   const showErrorToast = (message) => {
//     Toast.show({
//       type: 'error',
//       text1: 'Error',
//       text2: message,
//       position: 'bottom',
//     });
//   };

//   // Mostrar toast de éxito
//   const showSuccessToast = (message) => {
//     Toast.show({
//       type: 'success',
//       text1: 'Éxito',
//       text2: message,
//       position: 'bottom',
//     });
//   };

//   // Función para validar y actualizar cédula (solo números)
//   const handleCedulaChange = (text) => {
//     const cleanedText = text.replace(/[^0-9]/g, "");
//     setCedula(cleanedText);
//   };

//   // Función para validar y actualizar celular (solo números)
//   const handleCelularChange = (text) => {
//     const cleanedText = text.replace(/[^0-9]/g, "");
//     setCelular(cleanedText);
//   };

//   // GUARDAR EN EL STORAGE
//   const storeData = async (id, userData) => {
//     try {
//       await AsyncStorage.setItem("key", id);
//       const jsonData = JSON.stringify(userData);
//       await AsyncStorage.setItem("userData", jsonData);
//     } catch (error) {
//       if (__DEV__) {
//         console.error("Error async storage: ", error);
//       }
//       showErrorToast("Error al guardar los datos locales");
//     }
//   };

//   // CREATE STRIPE CUSTOMER
//   const handleSubmit = async ({ name, email, userCredential }) => {
//     try {
//       const response = await fetch(
//         "https://app-zrcl5qd7da-uc.a.run.app/api/createstripecustomer",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ name, email }),
//         }
//       );

//       if (response.ok) {
//         const customer = await response.json();
//         const userData = {
//           email: userCredential.user.email,
//           createdAt: new Date(),
//           name: nombre,
//           surname: apellidos,
//           country: "Colombia",
//           nit: cedula,
//           cellPhone: celular,
//           stripeCustomerId: customer.id,
//           destinationAddress: "",
//           destinyDaneCode: "",
//           locationName: "",
//           departamento: "",
//           prefix: selectedCountry || "+57", // Usar el código seleccionado o +57 por defecto
//           nitType: "CC", 
//         };
//         const uid = userCredential.user.uid;
//         await storeData(uid, userData);

//         try {
//           const userDocRef = doc(db, "users", uid);
//           await setDoc(userDocRef, userData);
//           showSuccessToast("Cuenta creada exitosamente");
//           navigation.navigate("TabsNavigation");
//         } catch (error) {
//           if (__DEV__) {
//             console.error("Error guardando user: ", error);
//           }
//           await initialAuth.currentUser?.delete();
//           showErrorToast("Error al crear la cuenta. Intente nuevamente.");
//         }
//       } else {
//         const errorData = await response.json();
//         if (__DEV__) {
//           console.error(errorData.message);
//         }
//         await initialAuth.currentUser?.delete();
//         showErrorToast("Error al crear el cliente de pago");
//       }
//     } catch (error) {
//       if (__DEV__) {
//         console.error("Error con crear user stripe: ", error);
//       }
//       if (initialAuth.currentUser) {
//         await initialAuth.currentUser.delete();
//       }
//       showErrorToast("Error al completar el registro");
//     }
//   };

//   // CREATE ACCOUNT
//   const handleCreateAccount = async () => {
//     try {
//       const userCredential = await createUserWithEmailAndPassword(
//         initialAuth,
//         email,
//         password
//       );

//       dispatch(
//         setUser({
//           authentication: true,
//           email: userCredential.user.email,
//           accessToken: userCredential.user.accessToken,
//           uid: userCredential.user.uid,
//         })
//       );
      
//       await handleSubmit({
//         name: nombre,
//         email: email,
//         userCredential: userCredential,
//       });
//     } catch (error) {
//       setIsLoading(false);
//       if (__DEV__) {
//         console.error("Error creando user: ", error);
//       }
      
//       let errorMessage = "Error al crear la cuenta";
//       switch (error.code) {
//         case 'auth/email-already-in-use':
//           errorMessage = "El correo electrónico ya está en uso";
//           break;
//         case 'auth/invalid-email':
//           errorMessage = "El correo electrónico no es válido";
//           break;
//         case 'auth/weak-password':
//           errorMessage = "La contraseña es demasiado débil";
//           break;
//         default:
//           errorMessage = "Error al crear la cuenta";
//       }
      
//       showErrorToast(errorMessage);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#000000" />

//       <TouchableOpacity onPress={() => navigation.goBack()}>
//         <FontAwesomeIcon icon={faX} size={25} style={styles.iconArrowLeft} />
//       </TouchableOpacity>

//       <ScrollView
//         contentContainerStyle={{
//           width: "100%",
//           alignItems: "center",
//           justifyContent: "start",
//           marginTop: 10,
//         }}
//       >
//         <View style={styles.login}>
//           <View>
//             <TextInput
//               onChangeText={(text) => setNombre(text.trim())}
//               style={styles.input}
//               placeholder="Nombre"
//               placeholderTextColor="#373737"
//             />
//           </View>
//           <View>
//             <TextInput
//               onChangeText={(text) => setApellidos(text.trim())}
//               style={styles.input}
//               placeholder="Apellidos"
//               placeholderTextColor="#373737"
//             />
//           </View>
//           <View>
//             <TextInput
//               onChangeText={handleCedulaChange}
//               value={cedula}
//               style={styles.input}
//               placeholder="Cédula"
//               placeholderTextColor="#373737"
//               keyboardType="numeric"
//               maxLength={10}
//             />
//           </View>
          
//           {/* Dropdown para seleccionar código de país */}
//           <View>
//             <View style={styles.containerDropDown}>
//               <Dropdown
//                 style={[styles.dropdown, isFocus && { borderColor: "gray" }]}
//                 placeholderStyle={styles.placeholderStyle}
//                 selectedTextStyle={styles.selectedTextStyle}
//                 inputSearchStyle={styles.inputSearchStyle}
//                 iconStyle={styles.iconStyle}
//                 data={countryCodes}
//                 search
//                 maxHeight={250}
//                 labelField="label"
//                 valueField="value"
//                 placeholder={!isFocus ? "Selecciona tu país" : "..."}
//                 searchPlaceholder="Buscar país..."
//                 value={selectedCountry}
//                 onFocus={() => setIsFocus(true)}
//                 onBlur={() => setIsFocus(false)}
//                 onChange={(item) => {
//                   setSelectedCountry(item.value);
//                   setIsFocus(false);
//                 }}
//                 renderLeftIcon={() => (
//                   <AntDesign
//                     style={styles.icon}
//                     color={isFocus ? "gray" : "white"}
//                     name="earth"
//                     size={20}
//                   />
//                 )}
//               />
//             </View>
//           </View>

//           <View>
//             <TextInput
//               onChangeText={handleCelularChange}
//               value={celular}
//               style={styles.input}
//               placeholder="Número celular"
//               placeholderTextColor="#373737"
//               keyboardType="phone-pad"
//               maxLength={15}
//             />
//           </View>

//           <View>
//             <TextInput
//               onChangeText={(text) => setEmail(text.trim().toLowerCase())}
//               value={email}
//               style={styles.input}
//               placeholder="personal@correo.com"
//               placeholderTextColor="#373737"
//             />
//           </View>
//           <View>
//             <TextInput
//               onChangeText={(text) => setPassword(text)}
//               style={styles.input}
//               placeholder="Contraseña"
//               placeholderTextColor="#373737"
//               secureTextEntry={true}
//             />
//           </View>

//           <TouchableOpacity
//             style={[styles.button, { backgroundColor: "#EE6B6B" }]}
//             onPress={handleCreateAccount}
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <ActivityIndicator size="large" color="#fff" />
//             ) : (
//               <Text
//                 style={{ fontSize: 17, fontWeight: "400", color: "#ffffff" }}
//               >
//                 Crear cuenta
//               </Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//       <Toast />
//     </SafeAreaView>
//   );
// };

// // STYLES
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     justifyContent: "start",
//     backgroundColor: "#000000",
//   },
//   image: {
//     width: "100%",
//     height: "100%",
//     resizeMode: "cover",
//   },
//   login: {
//     borderColor: "gray",
//     borderRadius: 10,
//     alignItems: "center",
//     marginBottom: 30,
//   },
//   logo: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     borderColor: "#fff",
//     borderWidth: 2,
//     marginVertical: 30,
//   },
//   input: {
//     width: 290,
//     height: 50,
//     borderColor: "gray",
//     borderWidth: 2,
//     borderWidth: 2,
//     borderRadius: 10,
//     padding: 10,
//     marginVertical: 10,
//     backgroundColor: "#000000",
//     marginBottom: 20,
//     color: "white",
//     fontSize: 18,
//   },
//   button: {
//     width: 270,
//     height: 50,
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     marginVertical: 10,
//     borderColor: "#fff",
//     borderWidth: 1,
//   },
//   iconArrowLeft: {
//     color: "#ffffff",
//     marginTop: 30,
//     marginLeft: 30,
//     marginBottom: 10,
//   },



//   // Estilos para el dropdown
//   containerDropDown: {
//     backgroundColor: "transparent",
//     paddingBottom: 10,
//     width: 290,
//   },
//   dropdown: {
//     height: 50,
//     borderColor: "gray",
//     borderWidth: 2,
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     backgroundColor: "#000000",
//     marginBottom: 20,
//   },
//   iconStyle: {
//     width: 20,
//     height: 20,
//     tintColor: "white",
//   },
//   inputSearchStyle: {
//     height: 40,
//     fontSize: 16,
//     backgroundColor: "#ffffff",
//     color: "#000000",
//     borderBottomColor: "gray",
//     borderBottomWidth: 1,
//   },
//   placeholderStyle: {
//     fontSize: 18,
//     color: '#373737',
//   },
//   selectedTextStyle: {
//     fontSize: 18,
//     color: "white",
//   },
//   icon: {
//     marginRight: 5,
//   },
// });

// export default CreateScreen;






























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
  const [cedula, setCedula] = useState("");
  const [celular, setCelular] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [countryCodes, setCountryCodes] = useState([]);

  // CONSTS
  const dispatch = useDispatch();
  const lowerCaseEmail = email.toLowerCase();

  // Cargar códigos de países al montar el componente
  React.useEffect(() => {
    const fetchCountryCodes = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const countries = await response.json();
        
        const formattedCountries = countries
          .filter(country => country.idd?.root && country.idd?.suffixes)
          .map(country => ({
            label: `${country.name.common} (${country.idd.root}${country.idd.suffixes[0]})`,
            value: `${country.idd.root}${country.idd.suffixes[0]}`,
            countryName: country.name.common
          }))
          .sort((a, b) => a.countryName.localeCompare(b.countryName));
        
        setCountryCodes(formattedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
        // Datos de respaldo en caso de fallo en la API
        setCountryCodes([
          { label: "Colombia (+57)", value: "+57", countryName: "Colombia" },
          { label: "Estados Unidos (+1)", value: "+1", countryName: "United States" },
          { label: "México (+52)", value: "+52", countryName: "Mexico" },
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

  // Función para validar y actualizar cédula (solo números)
  const handleCedulaChange = (text) => {
    const cleanedText = text.replace(/[^0-9]/g, "");
    setCedula(cleanedText);
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
          country: selectedCountryData?.countryName || "Colombia",
          nit: cedula,
          cellPhone: celular,
          stripeCustomerId: customer.id,
          destinationAddress: "",
          destinyDaneCode: "",
          locationName: "",
          departamento: "",
          prefix: selectedCountry || "+057",
          nitType: "CC", 
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <FontAwesomeIcon icon={faX} size={25} style={styles.iconArrowLeft} />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={{
          width: "100%",
          alignItems: "center",
          justifyContent: "start",
          marginTop: 10,
        }}
      >
        <View style={styles.login}>
          <View>
            <TextInput
              onChangeText={(text) => setNombre(text.trim())}
              style={styles.input}
              placeholder="Nombre"
              placeholderTextColor="#373737"
            />
          </View>
          <View>
            <TextInput
              onChangeText={(text) => setApellidos(text.trim())}
              style={styles.input}
              placeholder="Apellidos"
              placeholderTextColor="#373737"
            />
          </View>
          <View>
            <TextInput
              onChangeText={handleCedulaChange} 
              value={cedula}
              style={styles.input}
              placeholder="Cédula"
              placeholderTextColor="#373737"
              keyboardType="numeric"
              maxLength={10}
            />
          </View>
          
          <View>
            <View style={styles.containerDropDown}>
              <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: "gray" }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={countryCodes}
                search
                maxHeight={250}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? "Selecciona tu codigo" : "..."}
                searchPlaceholder="Buscar país..."
                value={selectedCountry}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                  setSelectedCountry(item.value);
                  setIsFocus(false);
                }}
                renderLeftIcon={() => (
                  <AntDesign
                    style={styles.icon}
                    color={isFocus ? "gray" : "white"}
                    name="earth"
                    size={20}
                  />
                )}
              />
            </View>
          </View>
          
          <View>
            <TextInput
              onChangeText={handleCelularChange}
              value={celular}
              style={styles.input}
              placeholder="Número celular"
              placeholderTextColor="#373737"
              keyboardType="phone-pad"
              maxLength={15}
            />
          </View>

          <View>
            <TextInput
              onChangeText={(text) => setEmail(text.trim().toLowerCase())}
              value={email}
              style={styles.input}
              placeholder="personal@correo.com"
              placeholderTextColor="#373737"
            />
          </View>
          <View>
            <TextInput
              onChangeText={(text) => setPassword(text)}
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#373737"
              secureTextEntry={true}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#EE6B6B" }]}
            onPress={handleCreateAccount}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <Text
                style={{ fontSize: 17, fontWeight: "400", color: "#ffffff" }}
              >
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

// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "start",
    backgroundColor: "#000000",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  login: {
    borderColor: "gray",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: "#fff",
    borderWidth: 2,
    marginVertical: 30,
  },
  input: {
    width: 290,
    height: 50,
    borderColor: "gray",
    borderWidth: 2,
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#000000",
    marginBottom: 20,
    color: "white",
    fontSize: 18,
  },
  button: {
    width: 270,
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    borderColor: "#fff",
    borderWidth: 1,
  },
  iconArrowLeft: {
    color: "#ffffff",
    marginTop: 30,
    marginLeft: 30,
    marginBottom: 10,
  },
  // Estilos para el dropdown
  containerDropDown: {
    backgroundColor: "transparent",
    paddingBottom: 10,
    width: 290,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#000000",
    marginBottom: 20,
  },
  iconStyle: {
    width: 20,
    height: 20,
    tintColor: "white",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    backgroundColor: "#ffffff",
    color: "#000000",
    borderBottomColor: "gray",
    borderBottomWidth: 1,
  },
  placeholderStyle: {
    fontSize: 18,
    color: '#373737',
  },
  selectedTextStyle: {
    fontSize: 18,
    color: "white",
  },
  icon: {
    marginRight: 5,
  },
});

export default CreateScreen;