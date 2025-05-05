import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/ProfileScreen";



const Stack = createNativeStackNavigator();

const ProfileNavigation = ({ navigation }) => {

  return (
    <Stack.Navigator>

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Opciones",
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

export default ProfileNavigation;
