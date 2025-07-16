import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TutorsScreen from "../screens/TutorsScreen";
import UsersToChatScreen from "../screens/UsersToChatScreen";
import UserProfileScreen from "../screens/UserProfileScreen";

const Stack = createNativeStackNavigator();

const ServicesNavigation = ({ navigation }) => {

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TutorsScreen"
        component={TutorsScreen}
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


   



       <Stack.Screen
        name="UserProfile"
        component={UserProfileScreen}
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
