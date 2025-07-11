import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBolt } from "@fortawesome/free-solid-svg-icons/faBolt";
import { faBars } from "@fortawesome/free-solid-svg-icons/faBars";
import { faComment } from "@fortawesome/free-solid-svg-icons/faComment";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";

import { useSafeAreaInsets } from "react-native-safe-area-context"; 
import ProfileNavigation from "./ProfileNavigation";
import ServicesNavigation from "./ServicesNavigation";
import ServiceHistoryNavigation from "./ServiceHistoryNavigation";
import ChatNavigation from "./ChatNavigation";

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  const insets = useSafeAreaInsets(); // Obtén los insets del área segura

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: "black",
          height: 60 + insets.bottom, // Ajusta la altura según el área segura
          paddingBottom: insets.bottom, // Asegura que el contenido no se superponga con la "safe area"
          borderTopWidth: 0,  // Esto elimina la línea blanca
          elevation: 0,       // Para Android (elimina la sombra)
        },
        tabBarIcon: ({ focused, color }) => {
          let icon;
          if (route.name === "Search") {
            icon = (
              <FontAwesomeIcon icon={faUser} size={30} color={color} />
            );
          } else if (route.name === "Services") {
            icon = <FontAwesomeIcon icon={faBolt} size={30} color={color} />;
          } else if (route.name === "Options") {
            icon = <FontAwesomeIcon icon={faBars} size={30} color={color} />;
          } else if (route.name === "Chats") {
            icon = <FontAwesomeIcon icon={faComment} size={30} color={color} />;
          }

          return icon;
        },
        tabBarActiveTintColor: "#5e17eb",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Search"
        component={ServicesNavigation}
        options={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
        }}
      />


<Tab.Screen
        name="Chats"
        component={ChatNavigation}
        options={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
        }}
      />


      <Tab.Screen
        name="Services"
        component={ServiceHistoryNavigation}
        options={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
        }}
      />

      <Tab.Screen
        name="Options"
        component={ProfileNavigation}
        options={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
        }}
      />
    </Tab.Navigator>



  );
};

export default TabNavigation;
