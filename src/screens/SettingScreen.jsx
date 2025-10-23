import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native";
import { useAppTheme } from "../theme";
import { Picker } from "@react-native-picker/picker";

export default function SettingsScreen() {
  const theme = useAppTheme();
  const [isDarkMode, setIsDarkMode] = useState(theme.dark || false);
  const [language, setLanguage] = useState("en");
  const [accentColor, setAccentColor] = useState("mostly");

  const handleThemeToggle = () => {
    setIsDarkMode((prev) => !prev);
  };

  const openPrivacyPolicy = () => {
    Linking.openURL("https://your-app.com/privacy-policy");
  };

  const accentColorValue = theme.colors[accentColor];

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

      <View style={styles.section}>
        <Text
          style={[
            styles.label,
            { color: theme.colors.text, fontFamily: theme.fonts.medium },
          ]}
        >
          Accent Color
        </Text>
        <View
          style={[
            styles.pickerContainer,
            { backgroundColor: theme.colors.primary },
          ]}
        >
          <Picker
            selectedValue={accentColor}
            dropdownIconColor={theme.colors.text}
            style={{ color: theme.colors.text }}
            onValueChange={(value) => setAccentColor(value)}
          >
            <Picker.Item label="Blue" value="mostly" />
            <Picker.Item label="Purple" value="vitally" />
            <Picker.Item label="Orange" value="principally" />
          </Picker>
        </View>
      </View>

      <View style={styles.section}>
        <Text
          style={[
            styles.label,
            { color: theme.colors.text, fontFamily: theme.fonts.medium },
          ]}
        >
          Accent Preview
        </Text>
        <View
          style={[styles.accentPreview, { backgroundColor: accentColorValue }]}
        />
      </View>

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
          thumbColor={accentColorValue}
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
  accentPreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  link: {
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
