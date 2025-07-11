import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/ProfileScreen";
import TutorConfigScreen from "../screens/TutorConfigScreen";
import BecomeTutorScreen from "../screens/BecomeTutorScreen";
import DebitCardTutorScreen from "../screens/DebitCardTutorScreen";



const Stack = createNativeStackNavigator();

const ProfileNavigation = ({ navigation }) => {

  return (
    <Stack.Navigator>

      <Stack.Screen
        name="Option"
        component={ProfileScreen}
        options={{
          title: "Options",
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


        <Stack.Screen
        name="TutorConfig"
        component={TutorConfigScreen}
        options={{
          title: "Tutor Profile",
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



        <Stack.Screen
        name="BecomeTutor"
        component={BecomeTutorScreen}
        options={{
          title: "Become a Tutor",
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


        <Stack.Screen
        name="DebitCardTutor"
        component={DebitCardTutorScreen}
        options={{
          title: "Add a Debit Cards",
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
