import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useTheme } from "@react-navigation/native";
import PropTypes from "prop-types";
import Prompt from "../components/Prompt";
import Header from "../components/Header";

const HomeScreen = ({ navigation }) => {
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { colors } = useTheme();

  const handleSubmit = async (text) => {
    if (!text.trim()) {
      Alert.alert("Error", "Please enter some text before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Submitted:", text);
      setInput("");
    } catch (error) {
      Alert.alert("Error", "Submission failed. Please try again.");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsSubmitting(false);
    console.log("Submission cancelled");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Header />
      <View style={styles.main}>
        <Text
          style={[styles.greeting, { color: colors.text }]}
          accessibilityLabel="Greeting message"
        >
          How can I help you today?
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoiding}
      >
        <View style={styles.content}>
          <Prompt onSubmit={handleSubmit} input={input} setInput={setInput} />
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.submit, { backgroundColor: colors.mostly }]}
            onPress={() =>
              isSubmitting ? handleCancel() : handleSubmit(input)
            }
            accessibilityLabel={
              isSubmitting ? "Cancel submission" : "Submit input"
            }
            accessibilityRole="button"
          >
            {isSubmitting ? (
              <FontAwesome6 name="stop" size={28} color={colors.background} />
            ) : (
              <Feather name="arrow-up" size={28} color={colors.background} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

HomeScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardAvoiding: {
    flex: 1,
    justifyContent: "flex-end",
    paddingVertical: 10,
  },
  content: {
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  submit: {
    borderRadius: 22.5,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    width: 52,
    height: 52,
  },
  greeting: { alignSelf: "center", fontSize: 24, fontWeight: "600" },
  main: { width: "100%", alignItems: "center", justifyContent: "center" },
});

export default HomeScreen;
