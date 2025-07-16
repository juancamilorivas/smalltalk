import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  TextInput 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserById, updateUser } from '../apiServices';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';

const UserProfile = ({ navigation }) => {
  // Estados
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    nativeLanguage: '',
    practicingLanguage: '',
    phone: '',
    countryCode: '',
    originCountry: '',
  });
  const [languages, setLanguages] = useState([]);
  const [countryCodes, setCountryCodes] = useState([]);
  const [isFocusLang, setIsFocusLang] = useState(false);
  const [isFocusNativeLang, setIsFocusNativeLang] = useState(false);
  const [isFocusCountry, setIsFocusCountry] = useState(false);
  const [isFocusOriginCountry, setIsFocusOriginCountry] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Obtener datos del usuario y cargar idiomas y códigos de país al iniciar
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

        setUserData(user);
        setFormData({
          name: user.name || '',
          surname: user.surname || '',
          email: user.email || '',
          nativeLanguage: user.nativeLanguage || '',
          practicingLanguage: user.practicingLanguage || '',
          phone: user.cellPhone || '',
          countryCode: user.prefix || '',
          originCountry: user.originCountry || '',
        });

        await Promise.all([loadLanguages(), loadCountryCodes()]);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message || "Error al cargar datos");
        navigation.navigate("LoginCreate");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigation]);

  // Cargar idiomas desde restcountries
  const loadLanguages = async () => {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all?fields=languages');
      const countries = await response.json();
      
      const languagesSet = new Set();
      countries.forEach(country => {
        if (country.languages) {
          Object.values(country.languages).forEach(lang => languagesSet.add(lang));
        }
      });
      
      const sortedLanguages = Array.from(languagesSet)
        .sort()
        .map(lang => ({ label: lang, value: lang }));
      
      setLanguages(sortedLanguages);
    } catch (error) {
      console.error("Error fetching languages:", error);
      setLanguages([
        { label: "Spanish", value: "Spanish" },
        { label: "English", value: "English" },
        { label: "French", value: "French" },
      ]);
    }
  };

  // Cargar códigos de país desde restcountries
  const loadCountryCodes = async () => {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all?fields=name,idd,languages');
      const countries = await response.json();
      
      const formattedCountries = countries
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
      setCountryCodes([
        { label: "Colombia (+57)", value: "+57", countryName: "Colombia", languages: ["Spanish"] },
        { label: "United States (+1)", value: "+1", countryName: "United States", languages: ["English"] },
        { label: "Mexico (+52)", value: "+52", countryName: "Mexico", languages: ["Spanish"] },
      ]);
    }
  };

  // Obtener lista de países para el selector de país de origen
  const getCountriesList = () => {
    return countryCodes.map(country => ({
      label: country.countryName,
      value: country.countryName
    }));
  };

  // Handler para actualizar cambios locales
  const handleFieldChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      // Verificar si hay cambios
      if (userData) {
        const changesExist = Object.keys(newData).some(
          key => newData[key] !== userData[key] && 
                 (userData[key] !== undefined || newData[key] !== '')
        );
        setHasChanges(changesExist);
      }
      return newData;
    });
  };

  // Handler para guardar todos los cambios
  const handleSaveChanges = async () => {
    try {
      if (!hasChanges) {
        Alert.alert("Información", "No hay cambios para guardar");
        return;
      }

      setIsSaving(true);
      const userId = await AsyncStorage.getItem("key");
      
      // Crear objeto con solo los campos modificados
      const changes = {};
      Object.keys(formData).forEach(key => {
        if (formData[key] !== userData[key] && 
            (userData[key] !== undefined || formData[key] !== '')) {
          changes[key] = formData[key];
        }
      });

      if (Object.keys(changes).length > 0) {
        await updateUser(userId, changes);
        
        // Actualizar estado local con los nuevos datos
        setUserData(prev => ({ ...prev, ...changes }));
        setHasChanges(false);
        Alert.alert("Éxito", "Cambios guardados correctamente");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      Alert.alert("Error", "No se pudieron guardar los cambios");
    } finally {
      setIsSaving(false);
    }
  };

  // Renderizar dropdown de idioma nativo
  const renderNativeLanguageDropdown = () => (
    <View style={styles.dropdownContainer}>
      <Dropdown
        style={[styles.dropdown, isFocusNativeLang && { borderColor: "#000" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={languages}
        search
        maxHeight={250}
        labelField="label"
        valueField="value"
        placeholder="Idioma nativo"
        searchPlaceholder="Buscar idioma..."
        value={formData.nativeLanguage}
        onFocus={() => setIsFocusNativeLang(true)}
        onBlur={() => setIsFocusNativeLang(false)}
        onChange={(item) => {
          handleFieldChange('nativeLanguage', item.value);
          setIsFocusNativeLang(false);
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocusNativeLang ? "#000" : "#999"}
            name="message1"
            size={20}
          />
        )}
      />
    </View>
  );

  // Renderizar dropdown de idioma que practica
  const renderPracticingLanguageDropdown = () => (
    <View style={styles.dropdownContainer}>
      <Dropdown
        style={[styles.dropdown, isFocusLang && { borderColor: "#000" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={languages}
        search
        maxHeight={250}
        labelField="label"
        valueField="value"
        placeholder="Idioma que practica"
        searchPlaceholder="Buscar idioma..."
        value={formData.practicingLanguage}
        onFocus={() => setIsFocusLang(true)}
        onBlur={() => setIsFocusLang(false)}
        onChange={(item) => {
          handleFieldChange('practicingLanguage', item.value);
          setIsFocusLang(false);
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocusLang ? "#000" : "#999"}
            name="message1"
            size={20}
          />
        )}
      />
    </View>
  );

  // Renderizar dropdown de códigos de país
  const renderCountryCodeDropdown = () => (
    <View style={styles.dropdownContainer}>
      <Dropdown
        style={[styles.dropdown, isFocusCountry && { borderColor: "#000" }]}
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
        value={formData.countryCode}
        onFocus={() => setIsFocusCountry(true)}
        onBlur={() => setIsFocusCountry(false)}
        onChange={(item) => {
          handleFieldChange('countryCode', item.value);
          setIsFocusCountry(false);
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocusCountry ? "#000" : "#999"}
            name="earth"
            size={20}
          />
        )}
      />
    </View>
  );

  // Renderizar dropdown de país de origen
  const renderOriginCountryDropdown = () => (
    <View style={styles.dropdownContainer}>
      <Dropdown
        style={[styles.dropdown, isFocusOriginCountry && { borderColor: "#000" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={getCountriesList()}
        search
        maxHeight={250}
        labelField="label"
        valueField="value"
        placeholder="País de origen"
        searchPlaceholder="Buscar país..."
        value={formData.originCountry}
        onFocus={() => setIsFocusOriginCountry(true)}
        onBlur={() => setIsFocusOriginCountry(false)}
        onChange={(item) => {
          handleFieldChange('originCountry', item.value);
          setIsFocusOriginCountry(false);
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocusOriginCountry ? "#000" : "#999"}
            name="enviromento"
            size={20}
          />
        )}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Mi perfil</Text>
          </View>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Datos Personales</Text>
            
            <Text style={styles.inputLabel}>Nombre</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => handleFieldChange('name', text)}
              placeholder="Ingresa tu nombre"
              placeholderTextColor="#999"
            />
            
            <Text style={styles.inputLabel}>Apellidos</Text>
            <TextInput
              style={styles.input}
              value={formData.surname}
              onChangeText={(text) => handleFieldChange('surname', text)}
              placeholder="Ingresa tus apellidos"
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabel}>Correo electrónico</Text>
            <TextInput
            onChangeText={(text) => handleFieldChange('email', text.trim().toLowerCase())}
            value={formData.email}
            style={[styles.input, styles.disabledInput]} // Agregar estilo para campos no editables
            placeholder="personal@correo.com"
            placeholderTextColor="#999"
            autoCapitalize="none"
            keyboardType="email-address"
            editable={false}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Información de Contacto</Text>
            
            <Text style={styles.inputLabel}>Código de país</Text>
            {renderCountryCodeDropdown()}
            
            <Text style={styles.inputLabel}>Número de teléfono</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => handleFieldChange('phone', text.replace(/[^0-9]/g, ''))}
              placeholder="Ingresa tu número"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
            
            <Text style={styles.inputLabel}>País de origen</Text>
            {renderOriginCountryDropdown()}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Preferencias de Idioma</Text>
            
            <Text style={styles.inputLabel}>Idioma nativo</Text>
            {renderNativeLanguageDropdown()}
            
            <Text style={styles.inputLabel}>Idioma que practica</Text>
            {renderPracticingLanguageDropdown()}
          </View>
        </View>
      </ScrollView>

      {/* Botón de guardar fijo en la parte inferior */}
      {hasChanges && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            onPress={handleSaveChanges}
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// Estilos actualizados al estilo Uber
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
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
    color: '#000',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 20,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    height: 50,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  dropdownContainer: {
    width: "100%",
    marginBottom: 16,
  },
  dropdown: {
    height: 50,
    backgroundColor: '#f9f9f9',
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  icon: {
    marginRight: 8,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#000000",
    fontWeight: '500',
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
  buttonContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
  },
  saveButton: {
    backgroundColor: '#000000',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#333',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#888',
  },
});

export default UserProfile;