import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./src/screens/HomeScreen";
import AuthScreen from "./src/screens/AuthScreen";
import ToastManager from "toastify-react-native";
import { useAppTheme } from "./src/theme";

const Stack = createStackNavigator();

export default function App() {
  const AppTheme = useAppTheme();

  return (
    <NavigationContainer theme={AppTheme}>
      <Stack.Navigator
        screenOptions={{ headerShown: false, animation: "fade" }}
      >
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
      <ToastManager />
    </NavigationContainer>
  );
}
