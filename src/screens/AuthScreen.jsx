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
        texts={["Hello.", "I'm Merdan.", "I build apps."]}
        typingSpeed={60}
        erasingSpeed={30}
        pauseBeforeErase={1000}
        pauseBeforeType={400}
        loop={true}
        textStyle={{ fontSize: 20, color: "#111" }}
        cursorStyle={{ color: "#ff2d55" }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default AuthScreen;
