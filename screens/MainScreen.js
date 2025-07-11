import React from 'react';
import { View, Text, Button } from 'react-native';
import { useTranslation } from 'react-i18next';

const MainScreen = () => {
  const { t, i18n } = useTranslation();

  return (
    <View style={{padding: 20}}>
      <Text style={{fontSize: 20, marginBottom: 10}}>{t('welcome')}</Text>
      <Text style={{marginBottom: 20}}>{t('login')}</Text>
      
      <Button 
        title={t('change_to_english')}
        onPress={() => i18n.changeLanguage('en')}
      />
      
      <View style={{marginTop: 10}}>
        <Button
          title={t('change_to_spanish')}
          onPress={() => i18n.changeLanguage('es')}
        />
      </View>
    </View>
  );
};

export default MainScreen;