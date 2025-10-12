import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inner}
      >
        <Text style={[styles.header, { color: colors.text }]}>
          {isLogin ? "Login to your account" : "Create a new account"}
        </Text>

        <View style={styles.form}>
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
            />
          </View>

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
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.75}
            style={[styles.button, { backgroundColor: colors.primary }]}
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
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 30,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  form: {
    width: "80%",
    alignItems: "center",
    gap: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.2,
    borderRadius: 100,
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 10,
    width: "100%",
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    marginTop: 10,
    borderRadius: 100,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default EmailAuth;
