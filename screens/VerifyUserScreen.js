
import React from "react";
import { StyleSheet, SafeAreaView, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const VerifyUserScreen = ({ navigation }) => {
  
  useFocusEffect(
    React.useCallback(() => {
      const getMyStringValue = async () => {
        try {
          const value = await AsyncStorage.getItem('key');
          if (value) {
            navigation.navigate("TabsNavigation");
          } else {
            navigation.navigate("LoginCreate");
          }
        } catch (error){
          if (__DEV__) {
            console.error("Error async storage: ", error);
          }
          navigation.navigate("LoginCreate");
    
        }
      };

      getMyStringValue();
    }, [navigation])
  );

  return (
    <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', 
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default VerifyUserScreen;
