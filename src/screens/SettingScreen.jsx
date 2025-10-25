import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
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
import { useThemeStore } from "../../store/themeStore";
import { useLangStore } from "../../store/langStore";
import * as Localization from "expo-localization";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingsRow = React.memo(function SettingsRow({
  icon,
  label,
  right,
  onPress,
}) {
  const theme = useAppTheme();
  const accent = theme.colors.accent;

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      style={styles.row}
    >
      <View style={styles.left}>
        <MaterialIcons name={icon} size={20} color={accent} />
        <Text
          style={[
            styles.label,
            { color: theme.colors.text, fontFamily: theme.fonts.medium },
          ]}
        >
          {label}
        </Text>
      </View>
      {right}
    </TouchableOpacity>
  );
});

export default function SettingsScreen() {
  const theme = useAppTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const token = useAuthStore((s) => s.token);
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

  useEffect(() => {
    if (!token) {
      navigation.replace("Auth");
      return;
    }

    (async () => {
      const stored = await getStoredSettings();
      setIsDarkMode(stored.darkMode ?? false);
      const detected = getDetectedLang();
      const lang = stored.language ?? detected;
      setLanguage(lang);
      setLang(lang);
      setAccentColor(stored.accentColor ?? "mostly");
      setLoading(false);
    })();
  }, [token, navigation, getStoredSettings, setLang]);

  useEffect(() => {
    if (loading) return;

    const save = async () => {
      await AsyncStorage.setItem(
        "appSettings",
        JSON.stringify({ darkMode: isDarkMode, language, accentColor })
      );
    };
    save();
  }, [isDarkMode, language, accentColor, loading]);

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
    [setStoredAccentColor, animateAccent]
  );

  const handleThemeToggle = useCallback(() => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    setDarkMode(next);
  }, [isDarkMode, setDarkMode]);

  const handleLangChange = useCallback(
    (value) => {
      setLanguage(value);
      setLang(value);
    },
    [setLang]
  );

  const handleLogout = useCallback(() => {
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
  }, [t, navigation]);

  const openPrivacyPolicy = useCallback(async () => {
    const url = "https://your-app.com/privacy-policy";
    const can = await Linking.canOpenURL(url);
    can ? Linking.openURL(url) : Alert.alert("Error", "Can't open URL.");
  }, []);

  const rows = useMemo(() => {
    const accent = theme.colors.accent;

    return [
      {
        key: "lang",
        icon: "language",
        label: t("language"),
        right: (
          <Picker
            selectedValue={language}
            dropdownIconColor={theme.colors.text}
            style={[styles.picker, pickerCommon, { color: theme.colors.text }]}
            onValueChange={handleLangChange}
          >
            <Picker.Item label={t("english")} value="en" />
            <Picker.Item label={t("russian")} value="ru" />
            <Picker.Item label={t("turkmen")} value="tk" />
          </Picker>
        ),
      },
      {
        key: "accent",
        icon: "palette",
        label: t("accentColor"),
        right: (
          <Picker
            selectedValue={accentColor}
            dropdownIconColor={theme.colors.text}
            style={[styles.picker, pickerCommon, { color: theme.colors.text }]}
            onValueChange={handleAccentChange}
          >
            <Picker.Item label={t("blue")} value="blue" />
            <Picker.Item label={t("purple")} value="purple" />
            <Picker.Item label={t("orange")} value="orange" />
          </Picker>
        ),
      },
      {
        key: "preview",
        icon: "preview",
        label: t("accentPreview"),
        right: (
          <Animated.View
            style={[
              styles.accentPreview,
              { backgroundColor: accent, transform: [{ scale: scaleAnim }] },
            ]}
          />
        ),
      },
      {
        key: "dark",
        icon: "monitor",
        label: t("darkMode"),
        right: (
          <View style={styles.switchContainer}>
            <Feather
              name="sun"
              size={18}
              color={!isDarkMode ? accent : theme.colors.neutral}
            />
            <Switch
              value={isDarkMode}
              onValueChange={handleThemeToggle}
              thumbColor={isDarkMode ? accent : theme.colors.neutral}
              trackColor={{
                false: theme.colors.neutral,
                true: accent,
              }}
              ios_backgroundColor={theme.colors.neutral}
            />
            <Feather
              name="moon"
              size={18}
              color={isDarkMode ? accent : theme.colors.neutral}
            />
          </View>
        ),
        onPress: handleThemeToggle,
      },
    ];
  }, [
    t,
    language,
    accentColor,
    isDarkMode,
    theme,
    handleLangChange,
    handleAccentChange,
    handleThemeToggle,
    scaleAnim,
  ]);

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
      <Text
        style={[
          styles.title,
          { color: theme.colors.text, fontFamily: theme.fonts.bold },
        ]}
      >
        {t("settings")}
      </Text>

      {rows.map((row) => (
        <View
          key={row.key}
          style={[
            styles.card,
            { backgroundColor: theme.colors.surface || theme.colors.card },
          ]}
        >
          <SettingsRow
            icon={row.icon}
            label={row.label}
            right={row.right}
            onPress={row.onPress}
          />
        </View>
      ))}

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
        <TouchableOpacity onPress={openPrivacyPolicy} style={styles.footerRow}>
          <Feather name="shield" size={18} color={theme.colors.accent} />
          <Text
            style={[
              styles.footerText,
              { color: theme.colors.accent, fontFamily: theme.fonts.semibold },
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

function getDetectedLang() {
  try {
    const code = (Localization.locale || "en").split("-")[0].toLowerCase();
    return code === "ru" ? "ru" : code === "tk" ? "tk" : "en";
  } catch {
    return "en";
  }
}

const pickerCommon = {
  height: Platform.OS === "ios" ? 180 : 55,
  width: Platform.OS === "ios" ? 180 : 140,
};

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
  card: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
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
