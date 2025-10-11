import { useTheme } from "@react-navigation/native";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TypingErase from "../components/UI/TypingErase";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const AuthScreen = () => {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      edges={["left", "right", "top"]}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
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
        textStyle={{ fontSize: 30, color: colors.primary, fontWeight: "700" }}
        cursorStyle={{
          color: colors.mostly,
          fontSize: 44,
          fontWeight: "700",
        }}
      />
      <View style={styles.sso}>
        <TouchableOpacity
          style={[styles.buttons, { backgroundColor: colors.primary }]}
        >
          <MaterialIcons name="alternate-email" size={24} color={colors.text} />
          <Text style={[styles.title, { color: colors.text }]}>
            Sign In With Email
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttons, { backgroundColor: colors.primary }]}
        >
          <AntDesign name="google" size={24} color={colors.text} />
          <Text style={[styles.title, { color: colors.text }]}>
            Sign In With Google
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttons, { backgroundColor: colors.primary }]}
        >
          <AntDesign name="github" size={24} color={colors.text} />
          <Text style={[styles.title, { color: colors.text }]}>
            Sign In With Github
          </Text>
        </TouchableOpacity>
      </View>
      <Text
        style={{
          color: colors.gray,
          maxWidth: "70%",
          textAlign: "center",
          fontSize: 13,
        }}
      >
        By continuing you agree to our{" "}
        <Text
          style={{ fontWeight: "bold", color: colors.text }}
          onPress={() => Linking.openURL("https://example.com/terms")}
        >
          Terms
        </Text>{" "}
        and{" "}
        <Text
          style={{ fontWeight: "bold", color: colors.text }}
          onPress={() => Linking.openURL("https://example.com/privacy")}
        >
          Privacy Policy
        </Text>
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 50,
  },
  sso: {
    alignItems: "center",
    justifyContent: "space-evenly",
    gap: 15,
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 100,
    width: 280,
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AuthScreen;
