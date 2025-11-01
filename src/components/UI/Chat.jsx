import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useThemeStore } from "../../../store/themeStore";

const Chat = ({
  chats,
  currentChatId,
  setChats,
  colors,
  scrollRef,
  isLoading,
}) => {
  const { accentColor } = useThemeStore();
  const [isThinking, setIsThinking] = useState(false);

  const messages =
    chats.find((chat) => chat.id === currentChatId)?.messages || [];

  // resolve actual color value from theme
  const accentColorValue = colors[accentColor] || accentColor; // fallback in case accentColor is already a hex

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 150);
    return () => clearTimeout(timer);
  }, [messages, isThinking]);

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
          <View
            key={item.id || index}
            style={[
              styles.bubble,
              item.role === "user"
                ? { alignSelf: "flex-end", backgroundColor: colors.neutral }
                : {
                    alignSelf: "flex-start",
                    backgroundColor: accentColorValue,
                  },
            ]}
          >
            <Text
              style={[
                styles.bubbleText,
                {
                  color: item.role === "user" ? colors.background : colors.text,
                },
              ]}
            >
              {item.text}
            </Text>
          </View>
        ))
      )}
      {(isLoading || isThinking) && (
        <ActivityIndicator style={{ marginTop: 10 }} color={accentColorValue} />
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
  bubble: {
    marginVertical: 4,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    maxWidth: "80%",
  },
  bubbleText: { fontSize: 16, lineHeight: 20 },
});

export default Chat;
