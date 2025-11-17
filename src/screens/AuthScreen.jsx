import { useState } from "react";
import { useTheme } from "@react-navigation/native";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Linking,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TypingErase from "../components/UI/TypingErase";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAppTheme } from "../../src/theme";
import Toast from "../components/UI/Toast";
import { useTranslations } from "../utils/translations";

const AuthScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const theme = useAppTheme();
  const [toastVisible, setToastVisible] = useState(false);
  const t = useTranslations();

  const showComingSoon = () => {
    setToastVisible(true);
  };

  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = [
    { fontFamily: theme.fonts.regular, color: theme.colors.text },
    ...(Text.defaultProps.style || []),
  ];

  return (
    <SafeAreaView
      edges={["left", "right", "top"]}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.contentWrapper}>
        <View style={styles.heroSection}>
          <Text
            style={[
              styles.heroTitle,
              {
                color: colors.vitally,
                fontFamily: theme.fonts.bold,
              },
            ]}
          >
            Ready to start?
          </Text>

          <TypingErase
            texts={[t("startDeveloping"), t("hiHelp"), t("solveIssues")]}
            typingSpeed={45}
            erasingSpeed={30}
            pauseBeforeErase={1000}
            pauseBeforeType={400}
            loop={true}
            textStyle={{
              color: colors.text,
              fontWeight: "600",
              fontSize: 18,
              fontFamily: theme.fonts.medium,
            }}
            cursorStyle={{
              color: colors.vitally,
              fontSize: 36,
              fontWeight: "700",
            }}
          />

          <View style={styles.logoContainer}>
            <Text
              style={[
                styles.logoText,
                {
                  color: colors.text,
                  fontFamily: theme.fonts.bold,
                },
              ]}
            >
              Sora
            </Text>
            <View
              style={[styles.logoDot, { backgroundColor: colors.vitally }]}
            />
          </View>

          <Text
            style={[
              styles.tagline,
              {
                color: colors.neutral,
                fontFamily: theme.fonts.regular,
              },
            ]}
          >
            {t("smarterResponses")}
          </Text>
        </View>

        <View style={styles.spacer} />

        {/* Action Buttons Section */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("EmailAuth")}
            activeOpacity={0.85}
            style={[
              styles.primaryButton,
              {
                backgroundColor: colors.text,
              },
            ]}
          >
            <MaterialIcons
              name="alternate-email"
              size={22}
              color={colors.background}
            />
            <Text
              style={[
                styles.primaryButtonText,
                {
                  color: colors.background,
                  fontFamily: theme.fonts.semibold,
                },
              ]}
            >
              {t("signInEmail")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={showComingSoon}
            activeOpacity={0.85}
            style={[
              styles.secondaryButton,
              {
                backgroundColor: colors.primary,
                borderColor: colors.border || colors.neutral,
              },
            ]}
          >
            <AntDesign name="google" size={22} color={colors.text} />
            <Text
              style={[
                styles.secondaryButtonText,
                {
                  color: colors.text,
                  fontFamily: theme.fonts.medium,
                },
              ]}
            >
              {t("signInGoogle")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text
          style={[
            styles.footerText,
            {
              color: colors.neutral,
              fontFamily: theme.fonts.regular,
            },
          ]}
        >
          By continuing you agree to our
          <Text
            style={{
              fontWeight: "600",
              color: colors.text,
              fontFamily: theme.fonts.semibold,
            }}
            onPress={() => Linking.openURL("https://example.com/terms")}
          >
            {t("terms")}
          </Text>{" "}
          and{" "}
          <Text
            style={{
              fontWeight: "600",
              color: colors.text,
              fontFamily: theme.fonts.semibold,
            }}
            onPress={() => Linking.openURL("https://example.com/privacy")}
          >
            {t("privacy")}
          </Text>
        </Text>
      </View>

      <Toast
        message={t("comingSoon")}
        visible={toastVisible}
        status="error"
        onHide={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  heroSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: 60,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: "800",
    marginBottom: 20,
    letterSpacing: -1,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 32,
    marginBottom: 8,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  logoDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 4,
    marginBottom: -8,
  },
  tagline: {
    fontSize: 15,
    marginTop: 4,
    opacity: 0.8,
  },
  spacer: {
    flex: 0.3,
  },
  actionsContainer: {
    paddingBottom: 40,
    gap: 14,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 16,
    gap: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: "600",
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 16,
    gap: 10,
    borderWidth: 1.5,
  },
  secondaryButtonText: {
    fontSize: 17,
    fontWeight: "500",
  },
  loginLink: {
    textAlign: "center",
    fontSize: 15,
    marginTop: 12,
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
});

export default AuthScreen;
