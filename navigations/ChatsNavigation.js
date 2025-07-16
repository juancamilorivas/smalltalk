import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatsScreen from "../screens/ChatsScreen";
import ChatScreen from "../screens/ChatScreen";



const Stack = createNativeStackNavigator();

const ChatNavigation = ({ navigation }) => {

  return (
    <Stack.Navigator>

      <Stack.Screen
        name="ChatsScreen"
        component={ChatsScreen}
        options={{
          title: "Chats",
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
        name="Chat"
        component={ChatScreen}
        options={{
          title: "Chat",
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

export default ChatNavigation;
