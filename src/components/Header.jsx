import React, { useState, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "@react-navigation/native";

const Header = () => {
  const { colors } = useTheme();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;

  const toggleNav = () => {
    const toValue = isNavOpen ? 0 : 1;
    Animated.timing(rotation, {
      toValue,
      duration: 125,
      useNativeDriver: true,
    }).start();
    setIsNavOpen(!isNavOpen);
  };

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  return (
    <View style={[styles.header, { backgroundColor: colors.background }]}>
      <View style={styles.leftSection}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={isNavOpen && styles.bar}
          onPress={toggleNav}
        >
          <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
            <FontAwesome6 name="bars-staggered" size={28} color={colors.text} />
          </Animated.View>
        </TouchableOpacity>
        <Text style={[styles.heading, { color: colors.text }]}>Asisstant</Text>
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
          <Text style={[styles.getProText, { color: colors.principally }]}>
            Get Pro
          </Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7}>
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
  getPro: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  getProText: { fontWeight: "600", fontSize: 14, marginLeft: 6 },
});

export default Header;
