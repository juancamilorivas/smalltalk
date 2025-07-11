import React from "react";
import { store } from "./store";
import { Provider } from "react-redux";
import LoginScreen from "./screens/LoginScreen";
import CreateAccountScreen from "./screens/CreateAccountScreen";
import VerifyUserScreen from "./screens/VerifyUserScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigation from "./navigations/TabNavigation";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler"; 
import './i18n'; // Importa la configuración

const Stack = createNativeStackNavigator();

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
      
        <NavigationContainer>
          <Stack.Navigator>

            <Stack.Screen
              name="verify"
              component={VerifyUserScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="LoginCreate"
              component={LoginScreen}
              options={{ headerShown: false, tabBarHideOnKeyboard: true }}
            />

            <Stack.Screen
              name="TabsNavigation"
              component={TabNavigation}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CreateAccountScreen"
              component={CreateAccountScreen}
              options={{ headerShown: false }}
            />
            
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
