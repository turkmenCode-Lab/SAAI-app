import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, ActivityIndicator } from "react-native";
import HomeScreen from "./src/screens/HomeScreen";
import AuthScreen from "./src/screens/AuthScreen";
import ToastManager from "toastify-react-native";
import { useAppTheme } from "./src/theme";
import { useFonts } from "expo-font";

const Stack = createStackNavigator();

export default function App() {
  const AppTheme = useAppTheme();

  const [fontsLoaded] = useFonts({
    InterRegular: require("./assets/fonts/Inter-Regular.ttf"),
    InterBold: require("./assets/fonts/Inter-Bold.ttf"),
    InterSemiBold: require("./assets/fonts/Inter-SemiBold.ttf"),
    InterMedium: require("./assets/fonts/Inter-Medium.ttf"),
  });

  if (fontsLoaded) {
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.style = [
      { fontFamily: "InterRegular" },
      ...(Text.defaultProps.style || []),
    ];
  }

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
