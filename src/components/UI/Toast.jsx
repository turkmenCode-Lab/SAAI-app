import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { useTheme } from "@react-navigation/native";

const Toast = ({ message, visible, status }) => {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;

  const [show, setShow] = useState(visible);

  useEffect(() => {
    if (visible) setShow(true);

    const timer = setTimeout(() => setShow(false), 3000);
    return () => clearTimeout(timer);
  }, [visible]);

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.exp),
          useNativeDriver: true,
        }).start();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!show) return null;

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: colors.primary,
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
      <Text
        style={[
          styles.message,
          { color: status === "error" ? colors.error : colors.success },
        ]}
      >
        {message}
      </Text>
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
  },
  message: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default Toast;
