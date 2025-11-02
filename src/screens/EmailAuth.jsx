import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppTheme } from "../../src/theme";
import { useAuthStore } from "../../store/authStore";
import Toast from "../components/UI/Toast";

const EmailAuth = ({ navigation }) => {
  const { colors } = useTheme();
  const theme = useAppTheme();
  const authStore = useAuthStore();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    status: "success",
  });

  const shakeEmail = useRef(new Animated.Value(0)).current;
  const shakePassword = useRef(new Animated.Value(0)).current;
  const shakeRePassword = useRef(new Animated.Value(0)).current;

  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = [
    { fontFamily: theme.fonts.regular, color: theme.colors.text },
    ...(Text.defaultProps.style || []),
  ];

  const showToast = useCallback((message, status = "success") => {
    setToast({ visible: true, message, status });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  useEffect(() => {
    if (authStore.error) {
      showToast(authStore.error, "error");
      useAuthStore.setState({ error: null });
    }
  }, [authStore.error, showToast]);

  const validateEmail = useCallback((email) => /\S+@\S+\.\S+/.test(email), []);
  const validatePassword = useCallback((pass) => pass.length >= 6, []);

  const shake = useCallback((animatedValue) => {
    animatedValue.setValue(0);
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 10,
        duration: 50,
        useNativeDriver: false,
      }),
      Animated.timing(animatedValue, {
        toValue: -10,
        duration: 50,
        useNativeDriver: false,
      }),
      Animated.timing(animatedValue, {
        toValue: 6,
        duration: 50,
        useNativeDriver: false,
      }),
      Animated.timing(animatedValue, {
        toValue: -6,
        duration: 50,
        useNativeDriver: false,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 50,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validateEmail(email))
      return shake(shakeEmail) && showToast("Invalid email", "error");
    if (!validatePassword(password))
      return (
        shake(shakePassword) &&
        showToast("Password must be at least 6 characters", "error")
      );
    if (!isLogin && password !== rePassword)
      return (
        shake(shakeRePassword) && showToast("Passwords do not match", "error")
      );

    try {
      const result = isLogin
        ? await authStore.login(email, password)
        : await authStore.register(email, password);

      if (result && result.user) {
        showToast(
          isLogin ? "Login Successful" : "Signup Successful",
          "success"
        );
        setTimeout(() => {
          navigation?.navigate("Home");
        }, 2000);
      }
    } catch (err) {
      const errorMessage =
        err.response?.status === 404
          ? "User not found or resource unavailable"
          : err.message || "An unexpected error occurred";
      showToast(errorMessage, "error");
    }
  }, [
    email,
    password,
    rePassword,
    isLogin,
    authStore,
    navigation,
    showToast,
    shake,
    shakeEmail,
    shakePassword,
    shakeRePassword,
    validateEmail,
    validatePassword,
  ]);

  return (
    <SafeAreaView
      edges={["left", "right", "top"]}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inner}
      >
        <Text style={[styles.header, { color: colors.text }]}>
          {isLogin ? "Login to your account" : "Create a new account"}
        </Text>

        <View style={styles.form}>
          <Animated.View style={{ transform: [{ translateX: shakeEmail }] }}>
            <View
              style={[styles.inputContainer, { borderColor: colors.primary }]}
            >
              <MaterialIcons
                name="alternate-email"
                size={22}
                color={colors.neutral}
              />
              <TextInput
                placeholder="Email"
                placeholderTextColor={colors.neutral}
                value={email}
                onChangeText={setEmail}
                style={[
                  styles.input,
                  { backgroundColor: colors.background, color: colors.text },
                ]}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </Animated.View>

          <Animated.View style={{ transform: [{ translateX: shakePassword }] }}>
            <View
              style={[styles.inputContainer, { borderColor: colors.primary }]}
            >
              <AntDesign name="lock" size={22} color={colors.neutral} />
              <TextInput
                placeholder="Password"
                placeholderTextColor={colors.neutral}
                value={password}
                onChangeText={setPassword}
                style={[
                  styles.input,
                  { backgroundColor: colors.background, color: colors.text },
                ]}
                secureTextEntry={!showPassword}
                autoCorrect={false}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeStyle}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color={colors.neutral}
                />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {!isLogin && (
            <Animated.View
              style={{ transform: [{ translateX: shakeRePassword }] }}
            >
              <View
                style={[styles.inputContainer, { borderColor: colors.primary }]}
              >
                <AntDesign name="lock" size={22} color={colors.neutral} />
                <TextInput
                  placeholder="Re-enter Password"
                  placeholderTextColor={colors.neutral}
                  value={rePassword}
                  onChangeText={setRePassword}
                  style={[
                    styles.input,
                    { backgroundColor: colors.background, color: colors.text },
                  ]}
                  secureTextEntry={!showRePassword}
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowRePassword(!showRePassword)}
                  style={styles.eyeStyle}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name={showRePassword ? "eye-off" : "eye"}
                    size={20}
                    color={colors.neutral}
                  />
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          <TouchableOpacity
            activeOpacity={0.75}
            style={[
              styles.button,
              {
                backgroundColor:
                  email && password && (isLogin || password === rePassword)
                    ? colors.primary
                    : colors.primary + "80",
              },
            ]}
            onPress={handleSubmit}
            disabled={
              authStore.loading ||
              !email ||
              !password ||
              (!isLogin && password !== rePassword)
            }
          >
            {authStore.loading ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <Text style={[styles.buttonText, { color: colors.text }]}>
                {isLogin ? "Login" : "Sign Up"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            onPress={() => navigation?.goBack()}
          >
            <Ionicons
              name="arrow-back-outline"
              size={16}
              color={colors.neutral}
            />
            <Text style={{ color: colors.neutral, fontSize: 16 }}>Go Back</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => setIsLogin(!isLogin)}
          style={{ marginTop: 40 }}
        >
          <Text style={{ color: colors.neutral }}>
            {isLogin ? "Haven't got an account? " : "Already have an account? "}
            <Text style={{ fontWeight: "700", color: colors.text }}>
              {isLogin ? "Sign Up" : "Login"}
            </Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      <Toast
        message={toast.message}
        visible={toast.visible}
        status={toast.status}
        onHide={hideToast}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  eyeStyle: { position: "absolute", right: 21.5 },
  inner: { flex: 1, alignItems: "center", justifyContent: "center", gap: 30 },
  header: { fontSize: 32, fontWeight: "700", textAlign: "center" },
  form: { width: "80%", alignItems: "center", gap: 20 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.2,
    borderRadius: 100,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 15,
    width: "100%",
  },
  input: { flex: 1, fontSize: 16, minWidth: 250, outlineWidth: 0 },
  button: {
    marginTop: 10,
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  buttonText: { fontSize: 16, fontWeight: "600" },
});

export default EmailAuth;
