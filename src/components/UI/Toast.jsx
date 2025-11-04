import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

const Toast = ({ message, visible: propVisible, status, onHide }) => {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const [internalVisible, setInternalVisible] = useState(false);

  useEffect(() => {
    if (propVisible && !internalVisible) {
      setInternalVisible(true);
      opacity.setValue(0);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }).start();
    }
  }, [propVisible, internalVisible, opacity]);

  useEffect(() => {
    let timer;
    if (internalVisible) {
      timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.exp),
          useNativeDriver: true,
        }).start(() => {
          setInternalVisible(false);
          if (onHide) onHide();
        });
      }, 2500);
    }
    return () => clearTimeout(timer);
  }, [internalVisible, opacity, onHide]);

  const hideToast = useCallback(() => {
    if (internalVisible) {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.exp),
        useNativeDriver: true,
      }).start(() => {
        setInternalVisible(false);
        if (onHide) onHide();
      });
    }
  }, [internalVisible, opacity, onHide]);

  if (!internalVisible) return null;

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: status === "error" ? colors.error : colors.success,
          opacity,
          transform: [
            {
              translateY: opacity.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Text style={[styles.message, { color: "#f2f2f2" }]}>{message}</Text>
      <TouchableOpacity activeOpacity={0.75} onPress={hideToast}>
        <Ionicons name="close" size={24} color={colors.background} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 1000,
  },
  message: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },
});

export default Toast;
