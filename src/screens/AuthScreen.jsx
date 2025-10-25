import { useTheme } from "@react-navigation/native";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TypingErase from "../components/UI/TypingErase";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAppTheme } from "../../src/theme";
import { useLangStore } from "../../store/langStore";
import { useAuthStore } from "../../store/authStore";
import { useNavigation } from "@react-navigation/native";
import * as Google from "expo-auth-session/providers/google";
import { useEffect, useState } from "react";
import { createAPI } from "../utils/api";
import { EXPO_OAUTH_CLIENT_ID } from "../../config";

const AuthScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { t } = useLangStore();
  const { setToken, setUser } = useAuthStore();
  const theme = useAppTheme();

  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: EXPO_OAUTH_CLIENT_ID,
    iosClientId: EXPO_OAUTH_CLIENT_ID,
    androidClientId: EXPO_OAUTH_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      if (id_token) {
        handleGoogleSignIn(id_token);
      }
    } else if (response?.type === "error") {
      Alert.alert(t("signInError"), t("googleAuthFailed"));
    }
  }, [response]);

  const handleGoogleSignIn = async (idToken) => {
    setLoading(true);
    try {
      const api = createAPI();
      const res = await api.post("/auth/google", { idToken });

      if (res.data?.token && res.data?.user) {
        setToken(res.data.token);
        setUser(res.data.user);
        navigation.replace("Home");
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      console.error("Google login error:", error);
      Alert.alert(t("signInError"), t("googleAuthFailed"));
    } finally {
      setLoading(false);
    }
  };

  // Default font
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = [
    { fontFamily: theme.fonts.regular, color: theme.colors.text },
    ...(Text.defaultProps.style || []),
  ];

  return (
    <SafeAreaView
      edges={["left", "right", "top"]}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>SA-AI</Text>
      </View>

      {/* Subtitle */}
      <Text style={styles.subtitle}>{t("authSubtitle")}</Text>

      {/* Typing Animation */}
      <TypingErase
        texts={[t("startDeveloping"), t("hiImHere"), t("mayHelpSolve")]}
        typingSpeed={45}
        erasingSpeed={30}
        pauseBeforeErase={1000}
        pauseBeforeType={400}
        loop={true}
        textStyle={styles.typingText}
        cursorStyle={styles.typingCursor}
      />

      {/* SSO Buttons */}
      <View style={styles.sso}>
        {/* Email */}
        <TouchableOpacity
          onPress={() => navigation.navigate("EmailAuth")}
          activeOpacity={0.75}
          style={[styles.button, { backgroundColor: colors.primary }]}
        >
          <MaterialIcons name="alternate-email" size={24} color={colors.text} />
          <Text style={[styles.buttonText, { color: colors.text }]}>
            {t("signInWithEmail")}
          </Text>
        </TouchableOpacity>

        {/* Google */}
        <TouchableOpacity
          activeOpacity={0.75}
          style={[
            styles.button,
            {
              backgroundColor: colors.primary,
              opacity: request && !loading ? 1 : 0.6,
            },
          ]}
          onPress={() => promptAsync({ showInRecents: true })}
          disabled={!request || loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <AntDesign name="google" size={24} color={colors.text} />
          )}
          <Text style={[styles.buttonText, { color: colors.text }]}>
            {loading ? t("signingIn") : t("signInWithGoogle")}
          </Text>
        </TouchableOpacity>

        {/* Github (Placeholder) */}
        <TouchableOpacity
          activeOpacity={0.75}
          style={[styles.button, { backgroundColor: colors.primary }]}
          disabled
        >
          <AntDesign name="github" size={24} color={colors.text} />
          <Text style={[styles.buttonText, { color: colors.text }]}>
            {t("signInWithGithub")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Terms */}
      <Text style={styles.terms}>
        {t("byContinuing")}{" "}
        <Text
          style={styles.link}
          onPress={() => Linking.openURL("https://example.com/terms")}
        >
          {t("terms")}
        </Text>{" "}
        {t("and")}{" "}
        <Text
          style={styles.link}
          onPress={() => Linking.openURL("https://example.com/privacy")}
        >
          {t("privacyPolicy")}
        </Text>
      </Text>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 50,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderColor: "#ccc",
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 2,
  },
  logoText: {
    fontSize: 48,
    fontFamily: "InterSemiBold",
    fontWeight: "bold",
    color: "#888",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "InterMedium",
    color: "#888",
    textAlign: "center",
    maxWidth: "80%",
  },
  typingText: {
    fontWeight: "700",
    fontSize: 18,
  },
  typingCursor: {
    fontSize: 44,
    fontWeight: "700",
  },
  sso: {
    alignItems: "center",
    justifyContent: "space-evenly",
    gap: 15,
    width: "100%",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 100,
    width: 300,
    gap: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  terms: {
    color: "#888",
    maxWidth: "70%",
    textAlign: "center",
    fontSize: 13,
  },
  link: {
    fontWeight: "bold",
  },
});

export default AuthScreen;
