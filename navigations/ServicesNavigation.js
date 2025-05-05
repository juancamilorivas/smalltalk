import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainScreen from "../screens/MainScreen";

const Stack = createNativeStackNavigator();

const ServicesNavigation = ({ navigation }) => {

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{
          title: "Bodega",
          headerShown: false,
          headerStyle: {
            backgroundColor: "#000000",
          },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

    </Stack.Navigator>
  );
};

export default ServicesNavigation;
