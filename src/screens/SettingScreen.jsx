import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useThemeStore } from "../../store/themeStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslations } from "../utils/translations";
import Toast from "../components/UI/Toast";

export default function SettingsScreen() {
  const theme = useAppTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const t = useTranslations();

  const token = useAuthStore((state) => state.token);
  const {
    setDarkMode,
    setAccentColor: setStoredAccentColor,
    getStoredSettings,
    setLanguage: setStoredLanguage, // Assuming this exists in the store; add if not
  } = useThemeStore();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [accentColor, setAccentColor] = useState("mostly");
  const [loading, setLoading] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastStatus, setToastStatus] = useState("success");
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!token) {
      navigation.replace("Auth");
      return;
    }

    const loadSettings = async () => {
      const stored = await getStoredSettings();
      setIsDarkMode(stored.darkMode || false);
      setLanguage(stored.language || "en");
      setAccentColor(stored.accentColor || "mostly");
      setLoading(false);
    };
    loadSettings();
  }, [token, navigation, getStoredSettings]);

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(
        "appSettings",
        JSON.stringify({ darkMode: isDarkMode, language, accentColor })
      );
    }
  }, [isDarkMode, language, accentColor, loading]);

  const accentColorValue = useMemo(
    () => theme.colors.accent,
    [theme.colors.accent]
  );

  const animateAccent = useCallback(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1.2, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
  }, [scaleAnim]);

  const handleAccentChange = useCallback(
    (value) => {
      setAccentColor(value);
      setStoredAccentColor(value);
      animateAccent();
    },
    [setAccentColor, setStoredAccentColor, animateAccent]
  );

  const handleThemeToggle = useCallback(() => {
    const newDark = !isDarkMode;
    setIsDarkMode(newDark);
    setDarkMode(newDark);
  }, [isDarkMode, setIsDarkMode, setDarkMode]);

  const handleLanguageChange = useCallback(
    (value) => {
      const oldLanguage = language;
      setLanguage(value);
      if (setStoredLanguage) {
        setStoredLanguage(value); // Update store if available
      }
      // Show toast with recommendation
      setToastMessage(t("languageChanged"));
      setToastStatus("success");
      setToastVisible(true);
    },
    [language, setLanguage, setStoredLanguage, t]
  );

  const handleLogout = useCallback(() => {
    Alert.alert(t("logOut"), t("sureLogout"), [
      { text: "Cancel", style: "cancel" },
      {
        text: t("logOut"),
        style: "destructive",
        onPress: () => {
          useAuthStore.getState().logout();
          navigation.replace("Auth");
        },
      },
    ]);
  }, [navigation, t]);

  const openPrivacyPolicy = useCallback(async () => {
    const url = "https://your-app.com/privacy-policy";
    const supported = await Linking.canOpenURL(url);
    supported
      ? await Linking.openURL(url)
      : Alert.alert("Error", "Can't open URL.");
  }, []);

  const renderCard = useCallback(
    (children) => (
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
    ),
    [theme.colors]
  );

  const renderRow = useCallback(
    (icon, label, rightContent, onPress) => (
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
            {label}
          </Text>
        </View>
        {rightContent}
      </TouchableOpacity>
    ),
    [accentColorValue, theme.colors, theme.fonts]
  );

  const pickerCommon = useMemo(
    () => ({
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 8,
      borderRadius: 13,
      height: Platform.OS === "ios" ? 180 : 55,
      width: Platform.OS === "ios" ? 180 : 140,
    }),
    [theme.colors, Platform.OS]
  );

  if (loading) {
    return (
      <View
        style={[styles.center, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          paddingVertical: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: "absolute",
            left: 16,
          }}
        >
          <Text
            style={{
              color: theme.colors.secondary,
              fontWeight: "500",
              fontSize: 20,
            }}
          >
            <Ionicons
              name="arrow-back-outline"
              size={28}
              color={theme.colors.secondary}
            />
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            color: theme.colors.text,
            fontFamily: theme.fonts.bold,
            fontSize: 32,
          }}
        >
          {t("settings")}
        </Text>
      </View>

      <View style={styles.section}>
        {renderCard(
          renderRow(
            "language",
            t("language"),
            <Picker
              selectedValue={language}
              dropdownIconColor={theme.colors.text}
              style={[styles.picker, pickerCommon]}
              onValueChange={handleLanguageChange}
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
            t("accentColor"),
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
            t("accentPreview"),
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
            t("darkMode"),
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

      <Toast
        visible={toastVisible}
        message={toastMessage}
        status={toastStatus}
        onHide={() => setToastVisible(false)}
      />
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
