import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native";
import { useAppTheme } from "../theme"; // adjust path if needed
import { Picker } from "@react-native-picker/picker";

export default function SettingsScreen() {
  const theme = useAppTheme();
  const [isDarkMode, setIsDarkMode] = useState(theme.dark || false);
  const [language, setLanguage] = useState("en");

  const handleThemeToggle = () => {
    setIsDarkMode((prev) => !prev);
    // if you have theme persistence, add logic here
  };

  const openPrivacyPolicy = () => {
    Linking.openURL("https://your-app.com/privacy-policy");
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text
        style={[
          styles.title,
          { color: theme.colors.text, fontFamily: theme.fonts.bold },
        ]}
      >
        Settings
      </Text>

      {/* Language Selection */}
      <View style={styles.section}>
        <Text
          style={[
            styles.label,
            { color: theme.colors.text, fontFamily: theme.fonts.medium },
          ]}
        >
          Change Language
        </Text>
        <View
          style={[
            styles.pickerContainer,
            { backgroundColor: theme.colors.primary },
          ]}
        >
          <Picker
            selectedValue={language}
            dropdownIconColor={theme.colors.text}
            style={{ color: theme.colors.text }}
            onValueChange={(value) => setLanguage(value)}
          >
            <Picker.Item label="English" value="en" />
            <Picker.Item label="Русский" value="ru" />
            <Picker.Item label="Türkmençe" value="tk" />
          </Picker>
        </View>
      </View>

      {/* Theme Toggle */}
      <View style={styles.section}>
        <Text
          style={[
            styles.label,
            { color: theme.colors.text, fontFamily: theme.fonts.medium },
          ]}
        >
          Dark Mode
        </Text>
        <Switch
          value={isDarkMode}
          onValueChange={handleThemeToggle}
          thumbColor={theme.colors.mostly}
          trackColor={{
            false: theme.colors.neutral,
            true: theme.colors.secondary,
          }}
        />
      </View>

      {/* Privacy Policy */}
      <TouchableOpacity onPress={openPrivacyPolicy} style={styles.section}>
        <Text
          style={[
            styles.link,
            { color: theme.colors.vitally, fontFamily: theme.fonts.semibold },
          ]}
        >
          Privacy Policy
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 26,
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
  },
  pickerContainer: {
    width: 150,
    borderRadius: 10,
  },
  link: {
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
