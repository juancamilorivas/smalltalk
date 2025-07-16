import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OptionsScreen from "../screens/OptionsScreen";
import TutorConfigScreen from "../screens/TutorConfigScreen";
import BecomeTutorScreen from "../screens/BecomeTutorScreen";
import DebitCardTutorScreen from "../screens/DebitCardTutorScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons/faChevronLeft";



const Stack = createNativeStackNavigator();

const ProfileNavigation = ({ navigation }) => {

  return (
    <Stack.Navigator>

      <Stack.Screen
        name="Option"
        component={OptionsScreen}
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

          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Option");
              }}
            >
              <FontAwesomeIcon icon={faChevronLeft} size={25} color="#ffffff" />
            </TouchableOpacity>
          ),
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




        <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#000000",
          },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerTitleAlign: "center",

          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Option");
              }}
            >
              <FontAwesomeIcon icon={faChevronLeft} size={25} color="#ffffff" />
            </TouchableOpacity>
          ),
        }}
      />





    </Stack.Navigator>
  );
};

export default ProfileNavigation;
