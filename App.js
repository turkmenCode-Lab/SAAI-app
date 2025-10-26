import React, { useEffect, useState } from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, ActivityIndicator, View } from "react-native";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import HomeScreen from "./src/screens/HomeScreen";
import AuthScreen from "./src/screens/AuthScreen";
import EmailAuth from "./src/screens/EmailAuth";
import SettingScreen from "./src/screens/SettingScreen";

import { useAppTheme } from "./src/theme";
import { useAuthStore } from "./store/authStore";
import { useThemeStore } from "./store/themeStore";
import { useLangStore } from "./store/langStore";

const Stack = createStackNavigator();

SplashScreen.preventAutoHideAsync();

export default function App() {
  const AppTheme = useAppTheme();
  const token = useAuthStore((s) => s.token);
  const getStoredSettings = useThemeStore((s) => s.getStoredSettings);
  const hydrateLang = useLangStore.persist?.rehydrate;

  const [resourcesReady, setResourcesReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Promise.all([
          Font.loadAsync({
            InterRegular: require("./assets/fonts/Inter-Regular.ttf"),
            InterBold: require("./assets/fonts/Inter-Bold.ttf"),
            InterSemiBold: require("./assets/fonts/Inter-SemiBold.ttf"),
            InterMedium: require("./assets/fonts/Inter-Medium.ttf"),
          }),

          getStoredSettings(),

          hydrateLang?.(),
        ]);
      } catch (e) {
        console.warn("Resource load error:", e);
      } finally {
        setResourcesReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, [getStoredSettings, hydrateLang]);

  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = [
    { fontFamily: "InterRegular" },
    ...(Text.defaultProps.style || []),
  ];

  if (!resourcesReady) {
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

  const initialRoute = token ? "Home" : "Auth";

  return (
    <NavigationContainer theme={AppTheme}>
      <Stack.Navigator
        initialRouteName={initialRoute}
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
