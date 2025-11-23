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
import { BlurView } from "expo-blur";

const Header = ({ isNavOpen, rotateInterpolate, onToggleNav }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleToggleNav = useCallback(() => {
    onToggleNav();
  }, [onToggleNav]);

  const handleSettingsPress = useCallback(() => {
    navigation.navigate("Settings");
  }, [navigation]);

  const HeaderContent = () => (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.iconButton, isNavOpen && styles.bar]}
        onPress={handleToggleNav}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
          <FontAwesome6 name="bars-staggered" size={24} color={colors.text} />
        </Animated.View>
      </TouchableOpacity>

      <Text style={[styles.heading, { color: colors.text }]}>Sora</Text>

      <TouchableOpacity
        onPress={handleSettingsPress}
        activeOpacity={0.7}
        style={styles.iconButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <MaterialCommunityIcons
          name="cog-outline"
          size={24}
          color={colors.text}
        />
      </TouchableOpacity>
    </>
  );

  return (
    <View
      style={[
        styles.headerContainer,
        {
          paddingTop: insets.top + (Platform.OS === "android" ? 5 : 0),
        },
      ]}
    >
      {Platform.OS === "ios" ? (
        <BlurView
          intensity={80}
          tint={colors.background === "#000000" ? "dark" : "light"}
          style={[
            styles.header,
            {
              borderColor: colors.text + "20",
            },
          ]}
          experimentalBlurMethod="dimezisBlurView"
        >
          <HeaderContent />
        </BlurView>
      ) : (
        <View
          style={[
            styles.header,
            styles.androidGlass,
            {
              backgroundColor: colors.background + "CC",
              borderColor: colors.text + "20",
            },
          ]}
        >
          <HeaderContent />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 15,
    right: 15,
    zIndex: 1000,
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 100,
    borderWidth: 1,
    overflow: "hidden",
  },
  androidGlass: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    zIndex: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
  },
  bar: { opacity: 0.7 },
});

export default memo(Header);
