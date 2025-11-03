import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
} from "react-native";
import { useThemeStore } from "../../../store/themeStore";
import * as Clipboard from "expo-clipboard";
import Feather from "@expo/vector-icons/Feather";
import Markdown from "react-native-markdown-display";

const TypingIndicator = ({ colors, accentColorValue }) => {
  const [dots, setDots] = useState([0, 0, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        const newDots = [...prev];
        newDots[0] = newDots[0] === 1 ? 0 : 1;
        newDots[1] = newDots[1] === 1 ? 0 : 1;
        newDots[2] = newDots[2] === 1 ? 0 : 1;
        return newDots;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.typingContainer}>
      {dots.map((scale, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: accentColorValue,
              opacity: scale,
            },
          ]}
        />
      ))}
    </View>
  );
};

const MessageBubble = ({ item, colors, accentColorValue, showToast }) => {
  const isUser = item.role === "user";
  const opacity = useRef(new Animated.Value(0)).current;
  const slideX = useRef(new Animated.Value(isUser ? 50 : -50)).current;
  const isDarkMode = colors.text === "#FFFFFF";

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(item.text);
      if (showToast) {
        showToast("Message copied to clipboard", "success");
      }
      console.log("Message copied to clipboard");
    } catch (error) {
      console.error("Failed to copy text:", error);
      if (showToast) {
        showToast("Failed to copy message", "error");
      }
    }
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideX, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const markdownStyles = useMemo(
    () =>
      StyleSheet.create({
        body: {
          fontSize: 16,
          lineHeight: 22,
          color: colors.text,
        },
        code_inline: {
          backgroundColor: isDarkMode ? "#2d2d2d" : "#f0f0f0",
          color: isDarkMode ? "#ffeb3b" : "#d73a49",
          paddingHorizontal: 6,
          paddingVertical: 2,
          borderRadius: 4,
          fontFamily: "Courier",
          fontWeight: "600",
        },
        code_block: {
          backgroundColor: isDarkMode ? "#1e1e1e" : "#f6f8fa",
          color: isDarkMode ? "#ffffff" : "#24292e",
          padding: 16,
          borderRadius: 8,
          fontFamily: "Courier",
          fontSize: 14,
          lineHeight: 20,
          marginVertical: 12,
          borderWidth: 1,
          borderColor: isDarkMode ? "#404040" : "#e1e4e8",
          overflow: "hidden",
        },
        fence: {
          color: "#858585",
          fontSize: 12,
          marginBottom: 8,
        },
        heading1: {
          fontSize: 22,
          fontWeight: "bold",
          color: colors.text,
          marginVertical: 12,
        },
        heading2: {
          fontSize: 20,
          fontWeight: "600",
          color: colors.text,
          marginVertical: 8,
        },
        bullet_list: { marginLeft: 10 },
        ordered_list: { marginLeft: 10 },
        list_item: { color: colors.text },
        blockquote: {
          borderLeftWidth: 4,
          borderLeftColor: accentColorValue,
          paddingLeft: 16,
          marginVertical: 12,
          backgroundColor: isDarkMode
            ? "rgba(255,255,255,0.05)"
            : "rgba(0,0,0,0.03)",
        },
        link: {
          color: "#4da6ff",
          textDecorationLine: "underline",
        },
        table: {
          borderWidth: 1,
          borderColor: isDarkMode ? "#444" : "#ddd",
          marginVertical: 12,
        },
        table_cell: {
          padding: 8,
          borderWidth: 1,
          borderColor: isDarkMode ? "#444" : "#ddd",
          color: colors.text,
        },
        paragraph: { marginVertical: 8 },
      }),
    [colors.text, isDarkMode, accentColorValue]
  );

  return (
    <Animated.View
      style={[
        styles.messageContainer,
        {
          alignSelf: isUser ? "flex-end" : "flex-start",
          opacity,
          transform: [{ translateX: slideX }],
        },
      ]}
    >
      <View
        style={[
          styles.bubbleWrapper,
          {
            alignItems: isUser ? "flex-end" : "flex-start",
          },
        ]}
      >
        <View
          style={[
            styles.bubble,
            {
              backgroundColor: isUser ? colors.neutral : accentColorValue,
              minHeight: 20,
            },
          ]}
        >
          {isUser ? (
            <Text
              style={[
                styles.bubbleText,
                {
                  color: colors.text,
                },
              ]}
            >
              {item.text}
            </Text>
          ) : (
            <Markdown
              style={markdownStyles}
              rules={{
                code_block: (node, children, parent, styles) => (
                  <View key={node.key} style={{ position: "relative" }}>
                    <TouchableOpacity
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        padding: 6,
                        borderRadius: 6,
                        zIndex: 1,
                      }}
                      onPress={() => {
                        Clipboard.setStringAsync(node.content);
                        showToast("Code copied!", "success");
                      }}
                    >
                      <Feather
                        name="copy"
                        size={16}
                        color={colors.background}
                      />
                    </TouchableOpacity>
                    <Text style={styles.code_block}>{node.content}</Text>
                  </View>
                ),
              }}
            >
              {item.text}
            </Markdown>
          )}
        </View>
        <TouchableOpacity
          style={[
            styles.copyButton,
            {
              backgroundColor: colors.neutral,
              borderColor: colors.border,
            },
          ]}
          onPress={handleCopy}
          activeOpacity={0.7}
        >
          <Feather name="copy" size={14} color={colors.text} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const Chat = ({
  chats,
  currentChatId,
  setChats,
  colors,
  scrollRef,
  isLoading,
  showToast,
}) => {
  const { accentColor } = useThemeStore();

  const messages = useMemo(
    () => chats.find((chat) => chat.id === currentChatId)?.messages || [],
    [chats, currentChatId]
  );

  const accentColorValue = useMemo(
    () => colors[accentColor] || accentColor,
    [colors, accentColor]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 150);
    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  return (
    <ScrollView
      style={styles.chatContainer}
      contentContainerStyle={[
        styles.chatContent,
        { justifyContent: messages.length === 0 ? "center" : "flex-end" },
      ]}
      ref={scrollRef}
      showsVerticalScrollIndicator
      keyboardShouldPersistTaps="handled"
    >
      {messages.length === 0 ? (
        <Text style={[styles.greeting, { color: colors.text }]}>
          How can I help you today?
        </Text>
      ) : (
        messages.map((item, index) => (
          <MessageBubble
            key={item.id || index}
            item={item}
            colors={colors}
            accentColorValue={accentColorValue}
            showToast={showToast}
          />
        ))
      )}
      {isLoading && (
        <TypingIndicator colors={colors} accentColorValue={accentColorValue} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  chatContainer: { flex: 1 },
  chatContent: { flexGrow: 1, paddingVertical: 20, paddingHorizontal: 15 },
  greeting: {
    alignSelf: "center",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
  },
  messageContainer: {
    marginVertical: 4,
    maxWidth: "80%",
  },
  bubbleWrapper: {
    flexDirection: "column",
  },
  bubble: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
  },
  bubbleText: { fontSize: 16, lineHeight: 20 },
  copyButton: {
    marginTop: 4,
    padding: 4,
    backgroundColor: "transparent",
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  typingContainer: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "transparent",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default Chat;
