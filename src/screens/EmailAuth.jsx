import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
  Animated,
  Text,
  ScrollView,
  TextInput,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import { useAuthStore } from "../../store/authStore";
import Toast from "../components/UI/Toast";
import { useTranslations } from "../utils/translations";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppTheme } from "../../src/theme";

const EmailAuth = ({ navigation }) => {
  const { colors } = useTheme();
  const theme = useAppTheme();
  const t = useTranslations();
  const authStore = useAuthStore();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false); // ← ADD THIS
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    status: "success",
  });

  const shakeAnim = useRef(new Animated.Value(0)).current;

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
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (authStore.error) {
      showToast(authStore.error, "error");
      shake();
      useAuthStore.setState({ error: null });
    }
  }, [authStore.error, showToast]);

  const validateEmail = useCallback((email) => /\S+@\S+\.\S+/.test(email), []);
  const validatePassword = useCallback((pass) => pass.length >= 6, []);

  const shake = useCallback(() => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 6,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -6,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, [shakeAnim]);

  const handleSubmit = useCallback(async () => {
    if (!validateEmail(email)) {
      shake();
      return showToast(t("invalidEmail"), "error");
    }
    if (!validatePassword(password)) {
      shake();
      return showToast(t("invalidPassword"), "error");
    }
    if (!isLogin && password !== rePassword) {
      shake();
      return showToast(t("passwordsMismatch"), "error");
    }

    try {
      const result = isLogin
        ? await authStore.login(email, password)
        : await authStore.register(email, password);

      if (result && result.user) {
        showToast(isLogin ? t("loginSuccess") : t("signupSuccess"), "success");
        setTimeout(() => {
          navigation?.navigate("Home");
        }, 1500);
      }
    } catch (err) {
      const errorMessage =
        err.response?.status === 404
          ? t("userNotFound")
          : err.message || "An unexpected error occurred";
      showToast(errorMessage, "error");
      shake();
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
    validateEmail,
    validatePassword,
    t,
  ]);

  const isFormValid = email && password && (isLogin || password === rePassword);

  return (
    <SafeAreaView
      edges={["left", "right", "top"]}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.inner}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerSection}>
            <TouchableOpacity
              onPress={() => navigation?.goBack()}
              style={styles.backButton}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>

            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: colors.text }]}>
                {isLogin ? t("login") : t("signUp")}
              </Text>
              <Text style={[styles.subtitle, { color: colors.neutral }]}>
                {isLogin ? "Welcome back" : "Create your account"}
              </Text>
            </View>
          </View>

          <Animated.View
            style={[styles.form, { transform: [{ translateX: shakeAnim }] }]}
          >
            <View style={styles.inputWrapper}>
              <Text style={[styles.label, { color: colors.neutral }]}>
                Email
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: colors.primary,
                    borderColor: colors.border || colors.primary,
                  },
                ]}
              >
                <MaterialIcons
                  name="alternate-email"
                  size={20}
                  color={colors.neutral}
                  style={styles.icon}
                />
                <TextInput
                  placeholder="you@example.com"
                  placeholderTextColor={colors.neutral + "80"}
                  value={email}
                  onChangeText={setEmail}
                  style={[styles.input, { color: colors.text }]}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={[styles.label, { color: colors.neutral }]}>
                Password
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: colors.primary,
                    borderColor: colors.border || colors.primary,
                  },
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={colors.neutral}
                  style={styles.icon}
                />
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor={colors.neutral + "80"}
                  value={password}
                  onChangeText={setPassword}
                  style={[styles.input, { color: colors.text }]}
                  secureTextEntry={!showPassword}
                  autoCorrect={false}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={colors.neutral}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {!isLogin && (
              <View style={styles.inputWrapper}>
                <Text style={[styles.label, { color: colors.neutral }]}>
                  Confirm Password
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: colors.primary,
                      borderColor: colors.border || colors.primary,
                    },
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={colors.neutral}
                    style={styles.icon}
                  />
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor={colors.neutral + "80"}
                    value={rePassword}
                    onChangeText={setRePassword}
                    style={[styles.input, { color: colors.text }]}
                    secureTextEntry={!showRePassword}
                    autoCorrect={false}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowRePassword(!showRePassword)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons
                      name={showRePassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={colors.neutral}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.submitButton,
                {
                  backgroundColor: isFormValid ? colors.text : colors.primary,
                  opacity: isFormValid ? 1 : 0.5,
                },
              ]}
              onPress={handleSubmit}
              disabled={authStore.loading || !isFormValid}
            >
              {authStore.loading ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text
                  style={[
                    styles.submitButtonText,
                    {
                      color: isFormValid ? colors.background : colors.text,
                      fontFamily: theme.fonts.semibold,
                    },
                  ]}
                >
                  {isLogin ? t("login") : t("signUp")}
                </Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Footer - hidden when keyboard is visible */}
          {!keyboardVisible && (
            <View style={styles.footer}>
              <TouchableOpacity
                onPress={() => setIsLogin(!isLogin)}
                activeOpacity={0.7}
              >
                <Text style={[styles.switchText, { color: colors.neutral }]}>
                  {isLogin ? t("noAccount") : t("haveAccount")}{" "}
                  <Text
                    style={{
                      color: colors.text,
                      fontFamily: theme.fonts.semibold,
                      fontWeight: "600",
                    }}
                  >
                    {isLogin ? t("signUp") : t("login")}
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
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
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  headerSection: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 24,
  },
  titleContainer: {
    gap: 6,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  form: {
    flex: 1,
    gap: 24,
  },
  inputWrapper: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderWidth: 1,
  },
  icon: {
    opacity: 0.6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    outlineWidth: 0,
  },
  submitButton: {
    marginTop: 8,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: "600",
  },
  footer: {
    paddingVertical: 32,
    alignItems: "center",
  },
  switchText: {
    fontSize: 15,
  },
});

export default EmailAuth;
