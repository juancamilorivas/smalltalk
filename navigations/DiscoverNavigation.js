import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DiscoverUsersScreen from "../screens/DiscoverUsersScreen";
import UserProfileScreen from "../screens/UserProfileScreen";

const Stack = createNativeStackNavigator();

const ServicesNavigation = ({ navigation }) => {

  return (
    <Stack.Navigator>
  

  <Stack.Screen
        name="DiscoverUsers"
        component={DiscoverUsersScreen}
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
