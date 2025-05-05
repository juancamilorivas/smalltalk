// Importa AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importa las funciones necesarias de Firebase
import { initializeApp } from "firebase/app";
// import { getFirestore } from "@firebase/firestore";
import { initializeFirestore } from "@firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';


// Configuración de Firebase
const firebaseConfig = {
    // apiKey: "AIzaSyDwAbsi7cmSwII9CaGRYSp-IV8qWcW4gNo",
    // authDomain: "nowbox-9e3df.firebaseapp.com",
    // projectId: "nowbox-9e3df",
    // storageBucket: "nowbox-9e3df.appspot.com",
    // messagingSenderId: "566450108015",
    // appId: "1:566450108015:web:1af831afd7dfeb7816ff9a",
    // measurementId: "G-HQMWVTCJPR"
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };


// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore si lo necesitas
// const db = getFirestore(app);
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
  ignoreUndefinedProperties: true,
});

// Inicializa Firebase initializeAuth con AsyncStorage
const initialAuth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});



export {  db, initialAuth};

