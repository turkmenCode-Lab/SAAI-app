// TypingErase.js
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";

/**
 * Props
 * - texts: string | string[]       -> text or array of texts to cycle through
 * - typingSpeed: number            -> ms per char when typing (default 80)
 * - erasingSpeed: number           -> ms per char when erasing (default 40)
 * - pauseBeforeErase: number       -> ms pause after typing full text (default 900)
 * - pauseBeforeType: number        -> ms pause after erasing before next typing (default 300)
 * - loop: boolean                  -> repeat cycle (default true)
 * - textStyle: style               -> style for typed text
 * - cursorStyle: style             -> style for cursor
 */
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
  const textArray = Array.isArray(texts) ? texts : [texts];

  const [displayed, setDisplayed] = useState("");
  const textIndexRef = useRef(0); // which text in textArray
  const charIndexRef = useRef(0); // how many chars currently
  const typingRef = useRef(true); // whether we're typing (true) or erasing (false)
  const timeoutRef = useRef(null);
  const mountedRef = useRef(true);

  // blinking cursor animation
  const cursorOpacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    texts,
    typingSpeed,
    erasingSpeed,
    pauseBeforeErase,
    pauseBeforeType,
    loop,
  ]);

  function startCycle() {
    // initialize refs (useful when texts prop changes)
    textIndexRef.current = 0;
    charIndexRef.current = 0;
    typingRef.current = true;
    setDisplayed("");
    scheduleNext();
  }

  function scheduleNext() {
    if (!mountedRef.current) return;
    const currentText = textArray[textIndexRef.current];
    if (typingRef.current) {
      // typing step
      if (charIndexRef.current < currentText.length) {
        timeoutRef.current = setTimeout(() => {
          charIndexRef.current += 1;
          setDisplayed(currentText.slice(0, charIndexRef.current));
          scheduleNext();
        }, typingSpeed);
      } else {
        // finished typing full text
        timeoutRef.current = setTimeout(() => {
          typingRef.current = false;
          scheduleNext();
        }, pauseBeforeErase);
      }
    } else {
      // erasing step
      if (charIndexRef.current > 0) {
        timeoutRef.current = setTimeout(() => {
          charIndexRef.current -= 1;
          setDisplayed(currentText.slice(0, charIndexRef.current));
          scheduleNext();
        }, erasingSpeed);
      } else {
        // finished erasing
        const nextIndex = textIndexRef.current + 1;
        if (nextIndex >= textArray.length) {
          if (!loop) {
            // stop at empty
            return;
          }
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
      <Text style={[styles.textBase, textStyle]} selectable={false}>
        {displayed}
      </Text>
      <Animated.Text
        style={[styles.cursor, cursorStyle, { opacity: cursorOpacity }]}
      >
        |
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
    fontSize: 18,
    lineHeight: 22,
  },
  cursor: {
    fontSize: 18,
    lineHeight: 22,
    marginLeft: 2,
  },
});
