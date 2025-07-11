import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Importa tus traducciones
import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';

// Idiomas soportados en tu app
const supportedLanguages = ['en', 'es'];

// Detecta el mejor idioma disponible
const deviceLanguage = Localization.locale.split('-')[0];
const bestMatchLanguage = supportedLanguages.includes(deviceLanguage) 
  ? deviceLanguage 
  : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      es: { translation: esTranslations },
    },
    lng: bestMatchLanguage, // Usa el idioma del dispositivo o inglés por defecto
    fallbackLng: 'en', // Si falta una traducción, usa inglés
    compatibilityJSON: 'v3', // Importante para React Native
    interpolation: {
      escapeValue: false, // No escapar HTML
    },
    react: {
      useSuspense: false, // Recomendado para React Native
    }
  });

export default i18n;
