import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, ActivityIndicator, View } from "react-native";
import HomeScreen from "./src/screens/HomeScreen";
import AuthScreen from "./src/screens/AuthScreen";
import EmailAuth from "./src/screens/EmailAuth";
import SettingScreen from "./src/screens/SettingScreen";
import { useAppTheme } from "./src/theme";
import * as Font from "expo-font";
import { useAuthStore } from "./store/authStore";
import { useThemeStore } from "./store/themeStore";
import * as Localization from "expo-localization";

const Stack = createStackNavigator();

export default function App() {
  const AppTheme = useAppTheme();
  const token = useAuthStore((state) => state.token);
  const getStoredSettings = useThemeStore((state) => state.getStoredSettings);

  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function initApp() {
      await Font.loadAsync({
        InterRegular: require("./assets/fonts/Inter-Regular.ttf"),
        InterBold: require("./assets/fonts/Inter-Bold.ttf"),
        InterSemiBold: require("./assets/fonts/Inter-SemiBold.ttf"),
        InterMedium: require("./assets/fonts/Inter-Medium.ttf"),
      });

      await getStoredSettings();

      setAppReady(true);
    }
    initApp();
  }, [getStoredSettings]);

  if (!appReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = [
    { fontFamily: "InterRegular" },
    ...(Text.defaultProps.style || []),
  ];

  const initialRouteName = token ? "Home" : "Auth";

  return (
    <NavigationContainer theme={AppTheme}>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Settings" component={SettingScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="EmailAuth" component={EmailAuth} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
