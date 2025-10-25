import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated, StyleSheet, Dimensions } from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import { useLangStore } from "../../../store/langStore";

export default function TypingErase({
  texts = "Hello, world!",
  typingSpeed = 80,
  erasingSpeed = 40,
  pauseBeforeErase = 900,
  pauseBeforeType = 300,
  loop = true,
  textStyle,
  cursorStyle,
}) {
  const { t } = useLangStore();
  const [displayed, setDisplayed] = useState("");
  const [fontSize, setFontSize] = useState(28);
  const textIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const typingRef = useRef(true);
  const timeoutRef = useRef(null);
  const mountedRef = useRef(true);
  const cursorOpacity = useRef(new Animated.Value(1)).current;

  const resolvedTexts = Array.isArray(texts)
    ? texts.map((item) => (typeof item === "string" ? t(item) || item : item))
    : [t(texts) || texts];

  useEffect(() => {
    const { width } = Dimensions.get("window");
    if (width < 400) setFontSize(24);
    else if (width < 500) setFontSize(26);
    else setFontSize(28);

    const sub = Dimensions.addEventListener("change", ({ window }) => {
      if (window.width < 400) setFontSize(24);
      else if (window.width < 500) setFontSize(26);
      else setFontSize(28);
    });

    return () => sub?.remove?.();
  }, []);

  useEffect(() => {
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
      ])
    );
    blink.start();
    return () => blink.stop();
  }, [cursorOpacity]);

  useEffect(() => {
    mountedRef.current = true;
    startCycle();
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [
    resolvedTexts, // Re-run when translations change
    typingSpeed,
    erasingSpeed,
    pauseBeforeErase,
    pauseBeforeType,
    loop,
  ]);

  function startCycle() {
    textIndexRef.current = 0;
    charIndexRef.current = 0;
    typingRef.current = true;
    setDisplayed("");
    scheduleNext();
  }

  function scheduleNext() {
    if (!mountedRef.current) return;
    const currentText = resolvedTexts[textIndexRef.current];

    if (typingRef.current) {
      if (charIndexRef.current < currentText.length) {
        timeoutRef.current = setTimeout(() => {
          charIndexRef.current += 1;
          setDisplayed(currentText.slice(0, charIndexRef.current));
          scheduleNext();
        }, typingSpeed);
      } else {
        timeoutRef.current = setTimeout(() => {
          typingRef.current = false;
          scheduleNext();
        }, pauseBeforeErase);
      }
    } else {
      if (charIndexRef.current > 0) {
        timeoutRef.current = setTimeout(() => {
          charIndexRef.current -= 1;
          setDisplayed(currentText.slice(0, charIndexRef.current));
          scheduleNext();
        }, erasingSpeed);
      } else {
        const nextIndex = textIndexRef.current + 1;
        if (nextIndex >= resolvedTexts.length) {
          if (!loop) return;
          textIndexRef.current = 0;
        } else {
          textIndexRef.current = nextIndex;
        }
        timeoutRef.current = setTimeout(() => {
          typingRef.current = true;
          scheduleNext();
        }, pauseBeforeType);
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.textBase,
          { fontSize, lineHeight: fontSize + 10 },
          textStyle,
        ]}
        selectable={false}
      >
        {displayed}
      </Text>
      <Animated.Text
        style={[
          styles.cursor,
          {
            fontSize,
            lineHeight: fontSize + 10,
            opacity: cursorOpacity,
          },
          cursorStyle,
        ]}
      >
        <Octicons
          name="sparkle-fill"
          size={fontSize}
          color={cursorStyle?.color || "#888"}
        />
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  textBase: {
    fontWeight: "500",
  },
  cursor: {
    marginLeft: 2,
  },
});
