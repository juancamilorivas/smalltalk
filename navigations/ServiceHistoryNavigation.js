import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ServiceHistoryScreen from "../screens/ServiceHistoryScreen";

const Stack = createNativeStackNavigator();

const ServiceHistoryNavigation = ({ navigation }) => {

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ServiceHistory"
        component={ServiceHistoryScreen}
        options={{
          title: "Historial de servicios",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#000000",
          },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerTitleAlign: "center",
        }}
      />



    </Stack.Navigator>
  );
};

export default ServiceHistoryNavigation;
