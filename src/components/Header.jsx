import React, { useCallback, memo } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslations } from "../utils/translations";

const Header = ({ isNavOpen, rotateInterpolate, onToggleNav }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const t = useTranslations();

  const handleToggleNav = useCallback(() => {
    onToggleNav();
  }, [onToggleNav]);

  const handleSettingsPress = useCallback(() => {
    navigation.navigate("Settings");
  }, [navigation]);

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + (Platform.OS === "android" ? 5 : 0),
        },
      ]}
    >
      <View style={styles.leftSection}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={isNavOpen && styles.bar}
          onPress={handleToggleNav}
        >
          <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
            <FontAwesome6 name="bars-staggered" size={28} color={colors.text} />
          </Animated.View>
        </TouchableOpacity>

        <Text style={[styles.heading, { color: colors.text }]}>
          {t("assistant")}
        </Text>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.getPro, { backgroundColor: colors.secondary }]}
        >
          <MaterialCommunityIcons
            name="star-four-points-outline"
            size={20}
            color={colors.principally}
          />
          <Text style={[styles.getProText, { color: "#fff" }]}>
            {t("getPro")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSettingsPress} activeOpacity={0.7}>
          <MaterialCommunityIcons
            name="dots-vertical"
            style={{ marginRight: -15 }}
            size={28}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginHorizontal: 15,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftSection: { flexDirection: "row", alignItems: "center", gap: 5 },
  rightSection: { flexDirection: "row", alignItems: "center", gap: 5 },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginLeft: 8,
  },
  bar: { opacity: 0.7 },
  getPro: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  getProText: { fontWeight: "600", fontSize: 14, marginLeft: 6 },
});

export default memo(Header);
