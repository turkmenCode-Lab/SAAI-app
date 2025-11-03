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

  const markdownStyles = StyleSheet.create({
    body: {
      fontSize: 16,
      lineHeight: 20,
      color: "#fff",
    },
    heading1: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#fff",
      marginTop: 0,
      marginBottom: 8,
    },
    heading2: {
      fontSize: 18,
      fontWeight: "600",
      color: "#fff",
      marginTop: 0,
      marginBottom: 6,
    },
    strong: {
      fontWeight: "bold",
    },
    em: {
      fontStyle: "italic",
    },
    code_inline: {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      color: "#ffeb3b",
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
      fontFamily: "monospace",
    },
    code_block: {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      color: "#ffeb3b",
      padding: 12,
      borderRadius: 8,
      fontFamily: "monospace",
      fontSize: 14,
      lineHeight: 18,
      marginVertical: 8,
    },
    blockquote: {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderLeftWidth: 4,
      borderLeftColor: "#fff",
      paddingLeft: 12,
      marginVertical: 8,
      paddingVertical: 4,
    },
    bullet_list: {
      marginLeft: 16,
      marginVertical: 4,
    },
    bullet_list_icon: {
      color: "#fff",
      fontSize: 6,
    },
    ordered_list: {
      marginLeft: 16,
      marginVertical: 4,
    },
    list_item: {
      marginVertical: 2,
      color: "#fff",
    },
    hr: {
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255, 255, 255, 0.3)",
      marginVertical: 12,
    },
    link: {
      color: "#4da6ff",
      textDecorationLine: "underline",
    },
    table: {
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.2)",
      marginVertical: 8,
    },
    table_row: {
      flexDirection: "row",
      backgroundColor: "transparent",
    },
    table_cell: {
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.2)",
      padding: 8,
      flex: 1,
      color: "#fff",
    },
    paragraph: {
      marginVertical: 4,
    },
  });

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
                  color: colors.background,
                },
              ]}
            >
              {item.text}
            </Text>
          ) : (
            <Markdown
              style={markdownStyles}
              onLinkPress={(url) => {
                console.log("Link pressed:", url);
              }}
            >
              {item.text}
            </Markdown>
          )}
        </View>
        <TouchableOpacity
          style={[styles.copyButton, { backgroundColor: colors.neutral }]}
          onPress={handleCopy}
          activeOpacity={0.7}
        >
          <Feather name="copy" size={14} color={colors.background} />
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
