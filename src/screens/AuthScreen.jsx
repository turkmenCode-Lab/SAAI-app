import { useTheme } from "@react-navigation/native";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AuthScreen = () => {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      edges={["left", "right", "top"]}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text>Auth Screen</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default AuthScreen;
