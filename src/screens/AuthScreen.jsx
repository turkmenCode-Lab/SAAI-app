import { useTheme } from "@react-navigation/native";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TypingErase from "../components/UI/TypingErase";

const AuthScreen = () => {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      edges={["left", "right", "top"]}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text>Auth Screen</Text>
      <TypingErase
        texts={[
          "Start developing with AI",
          "Hi I'm here, how can I help?",
          "I build apps.",
        ]}
        typingSpeed={45}
        erasingSpeed={30}
        pauseBeforeErase={1000}
        pauseBeforeType={400}
        loop={true}
        textStyle={{ fontSize: 38, color: colors.vitally, fontWeight: "700" }}
        cursorStyle={{ color: colors.text, fontSize: 44, fontWeight: "700" }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default AuthScreen;
