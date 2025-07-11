import * as Location from 'expo-location';
import { Alert } from 'react-native';

async function requestLocationAndUpdate(userId) {
  try {
    // 1. Pedir permisos
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        "Ubicación requerida",
        "Por favor, activa los permisos en ajustes para usar todas las funciones.",
        [{ text: "OK" }]
      );
      return null;
    }

    // 2. Obtener ubicación
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High, // Alta precisión
    });

    const { latitude, longitude } = location.coords;

    // 3. Guardar en Firestore (con geohash)
    await updateUserLocation(userId, latitude, longitude); // Usa la función del ejemplo anterior

    return { latitude, longitude };
  } catch (error) {
    console.error("Error al obtener ubicación:", error);
    Alert.alert("Error", "No pudimos obtener tu ubicación. Intenta más tarde.");
    return null;
  }
}

// Uso en un componente:
const OnboardingLocationScreen = ({ navigation }) => {
  const handleActivateLocation = async () => {
    const coords = await requestLocationAndUpdate(currentUser.uid);
    if (coords) {
      navigation.navigate("Home");
    }
  };

  return (
    <View>
      <Text>¡Activa tu ubicación para encontrar matches cercanos!</Text>
      <Button title="Activar ubicación" onPress={handleActivateLocation} />
      <Button title="Saltar por ahora" onPress={() => navigation.navigate("Home")} />
    </View>
  );
};