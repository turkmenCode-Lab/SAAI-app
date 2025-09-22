import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

import HomeScreen from "./components/screens/HomeScreen";
import DetailsScreen from "./components/screens/DetailsScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [activeRoute, setActiveRoute] = useState("Home");

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Home">
            {(props) => (
              <HomeScreen {...props} setActiveRoute={setActiveRoute} />
            )}
          </Stack.Screen>
          <Stack.Screen name="Details">
            {(props) => (
              <DetailsScreen {...props} setActiveRoute={setActiveRoute} />
            )}
          </Stack.Screen>
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
