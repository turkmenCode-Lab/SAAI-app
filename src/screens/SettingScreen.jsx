import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Alert,
  Platform,
  Animated,
  ActivityIndicator,
} from "react-native";
import { useAppTheme } from "../theme";
import { Picker } from "@react-native-picker/picker";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import { useLangStore } from "../../store/langStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const theme = useAppTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const token = useAuthStore((state) => state.token);
  const {
    setDarkMode,
    setAccentColor: setStoredAccentColor,
    getStoredSettings,
  } = useThemeStore();
  const { t, setLang } = useLangStore();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [accentColor, setAccentColor] = useState("mostly");
  const [loading, setLoading] = useState(true);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const getDetectedLang = () => {
    try {
      const locale = Localization.locale;
      const langCode = locale.split("-")[0].toLowerCase();
      if (langCode === "ru") return "ru";
      if (langCode === "tk") return "tk";
      return "en";
    } catch {
      return "en";
    }
  };

  useEffect(() => {
    if (!token) {
      navigation.replace("Auth");
      return;
    }

    const loadSettings = async () => {
      const stored = await getStoredSettings();
      setIsDarkMode(stored.darkMode || false);
      let lang = stored.language || getDetectedLang();
      setLanguage(lang);
      setLang(lang);
      setAccentColor(stored.accentColor || "mostly");
      setLoading(false);
    };
    loadSettings();
  }, [token, navigation, getStoredSettings, setLang]);

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(
        "appSettings",
        JSON.stringify({ darkMode: isDarkMode, language, accentColor })
      );
      setLang(language);
    }
  }, [isDarkMode, language, accentColor, loading, setLang]);

  const accentColorValue = theme.colors.accent;

  const animateAccent = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1.2, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  const handleAccentChange = (value) => {
    setAccentColor(value);
    setStoredAccentColor(value);
    animateAccent();
  };

  const handleThemeToggle = () => {
    const newDark = !isDarkMode;
    setIsDarkMode(newDark);
    setDarkMode(newDark);
  };

  const handleLogout = () => {
    Alert.alert(
      t("logOut"),
      t("confirmLogout") || "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: t("logOut"),
          style: "destructive",
          onPress: () => {
            useAuthStore.getState().logout();
            navigation.replace("Auth");
          },
        },
      ]
    );
  };

  const openPrivacyPolicy = async () => {
    const url = "https://your-app.com/privacy-policy";
    const supported = await Linking.canOpenURL(url);
    supported
      ? await Linking.openURL(url)
      : Alert.alert("Error", "Can't open URL.");
  };

  if (loading) {
    return (
      <View
        style={[styles.center, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const renderCard = (children) => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface || theme.colors.card,
        },
      ]}
    >
      {children}
    </View>
  );

  const renderRow = (icon, label, rightContent, onPress) => (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      style={styles.row}
    >
      <View style={styles.left}>
        <MaterialIcons name={icon} size={20} color={accentColorValue} />
        <Text
          style={[
            styles.label,
            { color: theme.colors.text, fontFamily: theme.fonts.medium },
          ]}
        >
          {t(label)} // Dynamic label key
        </Text>
      </View>
      {rightContent}
    </TouchableOpacity>
  );

  const pickerCommon = {
    color: theme.colors.text,
    height: Platform.OS === "ios" ? 180 : 55,
    width: Platform.OS === "ios" ? 180 : 140,
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingBottom: insets.bottom + 16,
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: theme.colors.text, fontFamily: theme.fonts.bold },
        ]}
      >
        {t("settings")}
      </Text>

      <View style={styles.section}>
        {renderCard(
          renderRow(
            "language",
            "language",
            <Picker
              selectedValue={language}
              dropdownIconColor={theme.colors.text}
              style={[styles.picker, pickerCommon]}
              onValueChange={(value) => {
                setLanguage(value);
                setLang(value);
              }}
            >
              <Picker.Item label={t("english")} value="en" />
              <Picker.Item label={t("russian")} value="ru" />
              <Picker.Item label={t("turkmen")} value="tk" />
            </Picker>
          )
        )}
      </View>

      <View style={styles.section}>
        {renderCard(
          renderRow(
            "palette",
            "accentColor",
            <Picker
              selectedValue={accentColor}
              dropdownIconColor={theme.colors.text}
              style={[styles.picker, pickerCommon]}
              onValueChange={handleAccentChange}
            >
              <Picker.Item label={t("blue")} value="mostly" />
              <Picker.Item label={t("purple")} value="vitally" />
              <Picker.Item label={t("orange")} value="principally" />
            </Picker>
          )
        )}

        {renderCard(
          renderRow(
            "preview",
            "accentPreview",
            <Animated.View
              style={[
                styles.accentPreview,
                {
                  backgroundColor: accentColorValue,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            />
          )
        )}
      </View>

      <View style={styles.section}>
        {renderCard(
          renderRow(
            "monitor",
            "darkMode",
            <View style={styles.switchContainer}>
              <Feather
                name="sun"
                size={18}
                color={!isDarkMode ? accentColorValue : theme.colors.neutral}
              />
              <Switch
                value={isDarkMode}
                onValueChange={handleThemeToggle}
                thumbColor={
                  isDarkMode ? accentColorValue : theme.colors.neutral
                }
                trackColor={{
                  false: theme.colors.neutral,
                  true: accentColorValue,
                }}
                ios_backgroundColor={theme.colors.neutral}
              />
              <Feather
                name="moon"
                size={18}
                color={isDarkMode ? accentColorValue : theme.colors.neutral}
              />
            </View>,
            handleThemeToggle
          )
        )}
      </View>

      <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
        <TouchableOpacity onPress={openPrivacyPolicy} style={styles.footerRow}>
          <Feather name="shield" size={18} color={accentColorValue} />
          <Text
            style={[
              styles.footerText,
              { color: accentColorValue, fontFamily: theme.fonts.semibold },
            ]}
          >
            {t("privacyPolicy")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={styles.footerRow}>
          <Feather name="log-out" size={18} color="red" />
          <Text
            style={[
              styles.footerText,
              { color: "red", fontFamily: theme.fonts.semibold },
            ]}
          >
            {t("logOut")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginVertical: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 32,
    letterSpacing: 0.5,
  },
  section: {},
  card: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 0,
    borderWidth: 1,
    borderColor: "transparent",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 48,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  label: {
    fontSize: 16,
    letterSpacing: 0.2,
  },
  picker: {
    height: "100%",
  },
  accentPreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "transparent",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
  },
  footerText: {
    fontSize: 15,
    letterSpacing: 0.3,
  },
});
