import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAppTheme } from "../../src/theme";

const EmailAuth = ({ navigation }) => {
  const { colors } = useTheme();
  const theme = useAppTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const shakeEmail = useRef(new Animated.Value(0)).current;
  const shakePassword = useRef(new Animated.Value(0)).current;
  const shakeRePassword = useRef(new Animated.Value(0)).current;

  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = [
    { fontFamily: theme.fonts.regular, color: theme.colors.text },
    ...(Text.defaultProps.style || []),
  ];

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (pass) => pass.length >= 6;

  const shake = (animatedValue) => {
    animatedValue.setValue(0);
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 6,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: -6,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSubmit = () => {
    if (!validateEmail(email)) {
      shake(shakeEmail);
      return;
    }
    if (!validatePassword(password)) {
      shake(shakePassword);
      return;
    }
    if (!isLogin && password !== rePassword) {
      shake(shakeRePassword);
      return;
    }
    Alert.alert(isLogin ? "Login Success" : "Signup Success");
  };

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
                style={[styles.input, { color: colors.text }]}
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
                style={[styles.input, { color: colors.text }]}
                secureTextEntry
                autoCorrect={false}
              />
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
                  style={[styles.input, { color: colors.text }]}
                  secureTextEntry
                  autoCorrect={false}
                />
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
              !email || !password || (!isLogin && password !== rePassword)
            }
          >
            <Text style={[styles.buttonText, { color: colors.text }]}>
              {isLogin ? "Login" : "Sign Up"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation?.goBack()}>
            <Text style={{ color: colors.neutral, marginTop: 20 }}>
              ← Go Back
            </Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, alignItems: "center", justifyContent: "center", gap: 30 },
  header: { fontSize: 28, fontWeight: "700", textAlign: "center" },
  form: { width: "90%", alignItems: "center", gap: 20 },
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
  input: { flex: 1, fontSize: 16 },
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
