import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBolt } from "@fortawesome/free-solid-svg-icons/faBolt";
import { faBars } from "@fortawesome/free-solid-svg-icons/faBars";
import { faComment } from "@fortawesome/free-solid-svg-icons/faComment";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons/faUserGroup";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons/faLocationDot";
import { faFire } from "@fortawesome/free-solid-svg-icons/faFire";
import { faRocket } from "@fortawesome/free-solid-svg-icons/faRocket";
import { useSafeAreaInsets } from "react-native-safe-area-context"; 
import OptionsNavigation from "./OptionsNavigation";
import TutorsNavigation from "./TutorsNavigation";
import DiscoverNavigation from "./DiscoverNavigation";
import ServiceHistoryNavigation from "./ServiceHistoryNavigation";
import ChatsNavigation from "./ChatsNavigation";

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
          if (route.name === "Tutors") {
            icon = (
              <FontAwesomeIcon icon={faLocationDot} size={30} color={color} />
            );
          } else if (route.name === "Discover") {
            icon = <FontAwesomeIcon icon={faRocket} size={30} color={color} />;
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
        name="Tutors"
        component={TutorsNavigation}
        options={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
        }}
      />


     <Tab.Screen
        name="Discover"
        component={DiscoverNavigation}
        options={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
        }}
      />



      <Tab.Screen
        name="Chats"
        component={ChatsNavigation}
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
        component={OptionsNavigation}
        options={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
        }}
      />
    </Tab.Navigator>



  );
};

export default TabNavigation;
