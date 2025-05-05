import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  deleteDoc,
  query,
  doc,
  orderBy,
  getDocs,
  getDoc,
  limit,
  startAfter,
  onSnapshot,
  where,
  updateDoc,
} from "firebase/firestore";
import {
  Alert
} from "react-native";
import React from "react";


// FETCH POSTS ON SNAPSHOT
export const fetchPostsOnSnapshot = (postsPerLoad, onData, onError, locker) => {
  const q = query(
    collection(db, "shipments"),
    where("show", "==", true),
    where("locker", "==", locker),
    orderBy("createdAt", "desc"),
    limit(postsPerLoad)
  );
  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const posts = [];
      querySnapshot.forEach((doc) => {
        let postData = doc.data();
        postData.postId = doc.id;
        posts.push(postData);
      });

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      onData({ posts, lastVisible });
    },
    onError
  );

  return unsubscribe;
};

// //// FETCH MORE POSTS ON SNAPSHOT
export const fetchMorePostsOnSnapshot = (
  postsPerLoad,
  lastVisible,
  onData,
  onError,
  locker
) => {
  const q = query(
    collection(db, "shipments"),
    where("show", "==", true),
    where("locker", "==", locker),
    orderBy("createdAt", "desc"),
    limit(postsPerLoad),
    startAfter(lastVisible) // Fetch posts after the last visible one
  );

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const posts = [];
      querySnapshot.forEach((doc) => {
        let postData = doc.data();
        postData.postId = doc.id;
        posts.push(postData);
      });

      const newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      onData({ posts, lastVisible: newLastVisible });
    },
    onError
  );

  return unsubscribe;
};

// FETCH FAVORITES ON SNAPSHOT
export const fetchFavoritesOnSnapshot = (
  postsPerLoad,
  onData,
  onError,
  uid
) => {
  const q = query(
    collection(db, `users/${uid}/favoriteAddresses`),
    orderBy("createdAt", "asc"),
    limit(postsPerLoad)
  );

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const posts = [];

      querySnapshot.forEach((doc) => {
        let postData = doc.data();
        postData.postId = doc.id;
        posts.push(postData);
      });

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      onData({ posts, lastVisible });
    },
    onError
  );

  return unsubscribe;
};

//// FETCH MORE FAVORITES ON SNAPSHOT
export const fetchMoreFavoritesOnSnapshot = (
  postsPerLoad,
  lastVisible,
  onData,
  onError,
  uid
) => {
  const q = query(
    collection(db, `users/${uid}/favoriteAddresses`),
    orderBy("createdAt", "asc"),
    limit(postsPerLoad),
    startAfter(lastVisible) // Fetch posts after the last visible one
  );

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const posts = [];
      querySnapshot.forEach((doc) => {
        let postData = doc.data();
        postData.postId = doc.id;
        posts.push(postData);
      });

      const newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      onData({ posts, lastVisible: newLastVisible });
    },
    onError
  );

  return unsubscribe;
};

// FETCH SERVICES ON SNAPSHOT
export const fetchServicesOnSnapshot = (postsPerLoad, onData, onError, uid) => {
  const q = query(
    collection(db, "services"),
    where("uidClient", "==", uid),
    orderBy("createdAt", "desc"),
    limit(postsPerLoad)
  );

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const posts = [];
      querySnapshot.forEach((doc) => {
        let postData = doc.data();
        postData.postId = doc.id;
        posts.push(postData);
      });

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      onData({ posts, lastVisible });
    },
    onError
  );

  return unsubscribe;
};

//// FETCH MORE SERVICES ON SNAPSHOT
export const fetchMoreServicesOnSnapshot = (
  postsPerLoad,
  lastVisible,
  onData,
  onError,
  uid
) => {
  const q = query(
    collection(db, "services"),
    where("uidClient", "==", uid),
    orderBy("createdAt", "desc"),
    limit(postsPerLoad),
    startAfter(lastVisible) // Fetch posts after the last visible one
  );

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const posts = [];
      querySnapshot.forEach((doc) => {
        let postData = doc.data();
        postData.postId = doc.id;
        posts.push(postData);
      });

      const newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      onData({ posts, lastVisible: newLastVisible });
    },
    onError
  );

  return unsubscribe;
};

// FETCH PERSONAL DATA ON SNAPSHOT
export const fetchPersonalDataOnSnapshot = (uid, callback) => {
  const docRef = doc(db, `users/${uid}`);

  const unsubscribe = onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data()); // Llama al callback con los datos del documento
    } else {
      callback(null); // Maneja el caso donde el documento no existe
    }
  });
  return unsubscribe; // Retorna la función de limpieza de la suscripción
};

// FETCH PERSONAL DATA
export const fetchPersonalData = async (uid) => {
  const docRef = doc(db, `users/${uid}`);
  try {
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      console.warn("No such document!");
      return null;
    }
  } catch (error) {
    if (__DEV__) {
      console.error(error);
    } else {
      Alert.alert(
        "¡Ups!",
        "Hubo un problema al cargar la información. Por favor, inténtalo de nuevo más tarde."
      );
    }
    return null;
  }
};

// FETCH FAVORITES
export const fetchFavoriteData = async (uid) => {
  const collectionRef = collection(db, `users/${uid}/favoriteAddresses`);
  try {
    const querySnapshot = await getDocs(collectionRef);
    const favoriteAddresses = [];
    querySnapshot.forEach((doc) => {
      favoriteAddresses.push(doc.data());
    });
    return favoriteAddresses;
  } catch (error) {
    if (__DEV__) {
      console.error("Error obteniendo el documento: ", error);
    } else {
      Alert.alert(
        "¡Ups!",
        "Hubo un problema al cargar la información. Por favor, inténtalo de nuevo más tarde."
      );
    }
    return null;
  }
};

// SAVE FAVORITE
export async function saveFavoriteAddress(
  uid,
  nombre,
  apellido,
  celular,
  ciudad,
  departamento,
  direccion,
  destinyDaneCode
) {
  const data = {
    name: nombre,
    surname: apellido,
    cellPhone: celular,
    locationName: ciudad,
    departamento: departamento,
    destinyDaneCode: destinyDaneCode,
    destinationAddress: direccion,
    createdAt: new Date(),
  };

  try {
    await addDoc(collection(db, `users/${uid}/favoriteAddresses`), data);
  } catch (error) {
    if (__DEV__) {
      console.error("Error agregando el documento: ", error);
    } else {
      Alert.alert(
        "¡Ups!",
        "Hubo un problema al cargar la información. Por favor, inténtalo de nuevo más tarde."
      );
    }
  }
}

// DELETE FAVORITE
export const deleteFavoriteAddress = async (uid, idDocument) => {
  const userRef = doc(db, `users/${uid}/favoriteAddresses/${idDocument}`);
  try {
    await deleteDoc(userRef);
  } catch (error) {
    if (__DEV__) {
      console.error("Error borrando el documento: ", error);
    } else {
      Alert.alert(
        "¡Ups!",
        "Hubo un problema al cargar la información. Por favor, inténtalo de nuevo más tarde."
      );
    }
  }
};

export const fetchPost = async (shipmentNumber) => {
  const shipmentsRef = collection(db, "shipments");
  const q = query(shipmentsRef, where("shipmentNumber", "==", shipmentNumber));

  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      const documentData = docSnap.data();
      const documentId = docSnap.id;

      return { id: documentId, ...documentData };
    } else {
      return null;
    }
  } catch (error) {
    if (__DEV__) {
      console.error("Error obteniendo el documento: ", error);
    } else {
      Alert.alert(
        "¡Ups!",
        "Hubo un problema al cargar la información. Por favor, inténtalo de nuevo más tarde."
      );
    }
  }
};

export async function getTrm() {
  // Referencia al documento específico
  const trmDocRef = doc(db, "trm", "trmactual");

  try {
    // Obtiene el documento
    const trmDoc = await getDoc(trmDocRef);

    // Verifica si el documento existe
    if (trmDoc.exists()) {
      // Obtiene el campo 'trm' del documento
      const trmValue = trmDoc.data().trm;
      return trmValue;
    } else {
      return null;
    }
  } catch (error) {
    if (__DEV__) {
      console.error("Error obteniendo el documento: ", error);
    } else {
      Alert.alert(
        "¡Ups!",
        "Hubo un problema al cargar la información. Por favor, inténtalo de nuevo más tarde."
      );
    }
  }
}

export const fetchPartidaArancelariaPorcentajes = async (
  partidaArancelaria
) => {
  const partidasArancelariasRef = collection(db, "partidas-arancelarias");
  const q = query(
    partidasArancelariasRef,
    // where("partida-arancelaria", "==", partidaArancelaria)
    where("partidaArancelaria", "==", partidaArancelaria)
  );

  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const documentData = querySnapshot.docs[0].data(); // Asumiendo que solo hay un documento que coincide
      return documentData;
    } else {
      throw new Error(
        "No document found with the specified 'partida-arancelaria'"
      );
    }
  } catch (error) {
    if (__DEV__) {
      console.error("Error obteniendo el documento: ", error);
    } else {
      Alert.alert(
        "¡Ups!",
        "Hubo un problema al cargar la información. Por favor, inténtalo de nuevo más tarde."
      );
    }
  }
};

export async function savePayment(
  totalValue,
  uid,
  declaredValue,
  airCostValue,
  envioNacionaldollars,
  trm,
  iva,
  arancel,
  locker,
  shipmentNumber,
  name,
  surname,
  declaredValueDian,
  destinyDaneCode,
  recogeEnBodega,
  locationName,
  departamento,
  destinationAddress,
  cellPhone,
  paymentState,
  partidaArancelaria,
  docIdShipmentNumber,
  whr,
  whrs = [] // Valor por defecto si whrs es undefined
) {
  const data = {
    createdAt: new Date(),
    currentState: "Pagado",
    paymentState: paymentState,
    serviceName: "Importacion",
    totalPaid: totalValue,
    uidClient: uid,
    Insurance: declaredValue,
    airCost: airCostValue,
    valorTransportadoraNacionalPesos: envioNacionaldollars,
    trm: trm,
    iva: iva,
    arancel: arancel,
    declaredValueDian: declaredValueDian,
    locker: locker,
    shipmentNumber: shipmentNumber,
    receiverName: name,
    receiverSurname: surname,
    destinyDaneCode: destinyDaneCode,
    recogeEnBodega: recogeEnBodega,
    country: "Colombia",
    locationName: locationName,
    departamento: departamento,
    destinationAddress: destinationAddress,
    cellPhone: cellPhone,
    partidaArancelaria: partidaArancelaria,
    show: true,
    reajuste: false,
    cModality: false,
    stopped: false,
    docIdShipmentNumber: docIdShipmentNumber,
    whr: whr,
    whrs: whrs || [] // Doble seguridad por si whrs es null o undefined
  };

  try {
    await addDoc(collection(db, `services`), data);
  } catch (error) {
    if (__DEV__) {
      console.error("Error agregar el documento: ", error);
    } else {
      Alert.alert(
        "¡Ups!",
        "Hubo un problema al cargar la información. Por favor, inténtalo de nuevo más tarde."
      );
    }
  }
}

export async function changeShipmentStatus(shipmentNumber) {
  // Query to find the document with the specific shipmentNumber
  const shipmentsRef = collection(db, "shipments");
  const q = query(shipmentsRef, where("shipmentNumber", "==", shipmentNumber));
  const querySnapshot = await getDocs(q);

  // If a document with the specified shipmentNumber is found
  if (!querySnapshot.empty) {
    querySnapshot.forEach(async (document) => {
      const docRef = doc(db, "shipments", document.id);

      // Retrieve the current data of the document
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const currentData = docSnap.data();

        // Check if the field you want to update is true, then update it to false
        if (currentData.show === true) {
          await updateDoc(docRef, {
            show: false,
          });
        } else {
          return null;
        }
      } else {
        return null;
      }
    });
  } else {
    return null;
  }
}

export async function getServiceData(docId) {
  try {
    const docRef = doc(db, "services", docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    if (__DEV__) {
      console.error("Error obteniendo el documento: ", error);
    } else {
      Alert.alert(
        "¡Ups!",
        "Hubo un problema al cargar la información. Por favor, inténtalo de nuevo más tarde."
      );
    }
  }
}

export async function fetchShipmentDetail(shipmentNumber) {
  try {
    const shipmentRef = collection(db, "shipments");
    const q = query(shipmentRef, where("shipmentNumber", "==", shipmentNumber));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // Si no se encontraron documentos
      throw new Error(
        `No shipment detail found for uidClient: ${shipmentNumber}`
      );
    }

    // Obtenemos el primer documento encontrado
    const doc = querySnapshot.docs[0];
    const shipmentDetail = { id: doc.id, ...doc.data() };

    return shipmentDetail;
  } catch (error) {
    if (__DEV__) {
      console.error("Error obteniendo el documento: ", error);
    } else {
      Alert.alert(
        "¡Ups!",
        "Hubo un problema al cargar la información. Por favor, inténtalo de nuevo más tarde."
      );
    }
  }
}

export const fetchPartidaArancelariaComputadores = async () => {
  const partidasArancelariasRef = collection(db, "partidas-arancelarias");
  const q = query(
    partidasArancelariasRef,
    where("descripcion", "==", "Computadores/Tablets")
  );

  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const documentData = querySnapshot.docs[0].data(); // Asumiendo que solo hay un documento que coincide
      return documentData;
    } else {
      throw new Error(
        "No document found with the specified 'partida-arancelaria'"
      );
    }
  } catch (error) {
    if (__DEV__) {
      console.error("Error obteniendo el documento: ", error);
    } else {
      Alert.alert(
        "¡Ups!",
        "Hubo un problema al cargar la información. Por favor, inténtalo de nuevo más tarde."
      );
    }
  }
};

export const fetchPartidaArancelariaCelulares = async () => {
  const partidasArancelariasRef = collection(db, "partidas-arancelarias");
  const q = query(
    partidasArancelariasRef,
    where("descripcion", "==", "Celulares")
  );

  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const documentData = querySnapshot.docs[0].data(); // Asumiendo que solo hay un documento que coincide
      return documentData;
    } else {
      throw new Error(
        "No document found with the specified 'partida-arancelaria'"
      );
    }
  } catch (error) {
    if (__DEV__) {
      console.error("Error obteniendo el documento: ", error);
    } else {
      Alert.alert(
        "¡Ups!",
        "Hubo un problema al cargar la información. Por favor, inténtalo de nuevo más tarde."
      );
    }
  }
};

export async function savePaymentConsolidated(
  totalValue,
  uid,
  newShipmentNumber,
  paymentState,
  shipmentNumbers,
  whr
) {
  const data = {
    totalPaid: totalValue,
    uidClient: uid,
    shipmentNumber: newShipmentNumber,
    paymentState: paymentState,
    shipmentNumbers: shipmentNumbers,
    createdAt: new Date(),
    currentState: "Pagado",
    serviceName: "Consolidacion",
    show: true,
    whrs: whr,
  };

  try {
    await addDoc(collection(db, `services`), data);
  } catch (error) {
    if (__DEV__) {
      console.error("Error obteniendo el documento: ", error);
    } else {
      Alert.alert(
        "¡Ups!",
        "Hubo un problema al cargar la información. Por favor, inténtalo de nuevo más tarde."
      );
    }
  }
}

export async function changeShipmentdateConsolidated(
  shipment,
  newShipmentNumber
) {
  // Query to find the document with the specific shipmentNumber
  const shipmentsRef = collection(db, "shipments");
  const q = query(shipmentsRef, where("shipmentNumber", "==", shipment));
  const querySnapshot = await getDocs(q);

  // If a document with the specified shipmentNumber is found
  if (!querySnapshot.empty) {
    querySnapshot.forEach(async (document) => {
      const docRef = doc(db, "shipments", document.id);

      // Retrieve the current data of the document
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const currentData = docSnap.data();

        // Update the fields "show" and "consolidatedAt"
        if (currentData.show === true) {
          await updateDoc(docRef, {
            show: false,
            consolidatedAt: newShipmentNumber,
          });
        } else {
          await updateDoc(docRef, {
            consolidatedAt: newShipmentNumber,
          });
          return null;
        }
      } else {
        return null;
      }
    });
  } else {
    return null;
  }
}

//FETCH PARTIDA ARANCELARIA GENERAL
export async function fetchPartidaArancelariaGeneral() {
  // Referencia al documento específico
  const partidaDocRef = doc(
    db,
    "partidas-arancelarias",
    "ttL9uCwJxURuyoRd1pcZ"
  );

  try {
    // Obtiene el documento
    const partidaDoc = await getDoc(partidaDocRef);

    // Verifica si el documento existe
    if (partidaDoc.exists()) {
      // Obtiene el campo 'trm' del documento
      const trmValue = partidaDoc.data().partidaArancelaria;
      return trmValue;
    } else {
      return null;
    }
  } catch (error){
    if (__DEV__) {
      console.error("Error obteniendo el documento: ", error);
    } else {
      Alert.alert(
        "¡Ups!",
        "Hubo un problema al cargar la información. Por favor, inténtalo de nuevo más tarde."
      );
    }
    return null;
  }
}

export async function savePaymentDivided(
  totalValue,
  uid,
  shipmentNumber,
  paymentState,
  divideNumber,
  divideInstructions,
  locker,
  whr = "" 
) {
  const data = {
    totalPaid: totalValue,
    uidClient: uid,
    shipmentNumber: shipmentNumber,
    paymentState: paymentState,
    divideIn: divideNumber,
    instructions: divideInstructions,
    createdAt: new Date(),
    currentState: "Pagado",
    serviceName: "Division",
    show: true,
    shipmentNumbers: [],
    locker: locker,
    whr: whr,
  };

  console.log(data)

  try {
    await addDoc(collection(db, `services`), data);
  } catch (error) {
    if (__DEV__) {
      console.error("Error obteniendo el documento: ", error);
    } else {
      Alert.alert(
        "¡Ups!",
        "Hubo un problema al cargar la información. Por favor, inténtalo de nuevo más tarde."
      );
    }
  }
}



export const addShipmentStatus = async (docIdShipmentNumber, newState) => {
  try {
    // Referencia a la subcolección 'status' dentro del shipment específico
    const statusRef = collection(db, "shipments", docIdShipmentNumber, "status");

    // Agregar un nuevo estado con un timestamp automático
    await addDoc(statusRef, {
      state: newState,
      timestamp: new Date(),
    });

  } catch (error) {
    console.error("Error al agregar el estado:", error);
  }
};




















export async function getShipmentStatus(docId) {
  try {
    // Referencia al documento específico en la colección 'shipments'
    const shipmentDocRef = doc(db, 'shipments', docId);

    // Referencia a la subcolección 'status' dentro del documento
    const statusCollectionRef = collection(shipmentDocRef, 'status');

    // Obtener todos los documentos de la subcolección 'status'
    const querySnapshot = await getDocs(statusCollectionRef);

    // Mapear los documentos a un array de objetos con los datos de cada documento
    const statusDocuments = querySnapshot.docs.map(doc => ({
      id: doc.id, // ID del documento en la subcolección
      ...doc.data() // Todos los campos del documento
    }));

    return statusDocuments;
  } catch (error) {
    console.error("Error obteniendo los estados del envío: ", error);
    Alert.alert("Error", "No se pudo obtener la información del estado del envío.");
    throw error; // Re-lanzar el error para que pueda ser manejado por el llamador
  }
}












export const checkUserPolicyAcceptance = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data().acceptedPolicies || false;
    }
    return false;
  } catch (error) {
    console.error("Error checking policy acceptance:", error);
    return false;
  }
};

export const updateUserPolicyAcceptance = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      acceptedPolicies: true,
      policyAcceptanceDate: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Error updating policy acceptance:", error);
    return false;
  }
};