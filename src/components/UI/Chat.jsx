import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import io from "socket.io-client";
import { EXPO_API_URI } from "../../../config";

const socket = io(EXPO_API_URI || "http://localhost:5000");

const Chat = ({
  chats,
  currentChatId,
  setChats,
  colors,
  scrollRef,
  isLoading,
}) => {
  const messages =
    chats.find((chat) => chat.id === currentChatId)?.messages || [];

  useEffect(() => {
    if (currentChatId) socket.emit("joinChat", currentChatId);
    socket.on("receiveMessage", (data) => {
      setChats((prev) =>
        prev.map((c) =>
          c.id === data.chatId
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  {
                    id: Date.now(),
                    role: data.role,
                    text: data.content,
                    timestamp: new Date().toISOString(),
                  },
                ],
              }
            : c
        )
      );
    });
    return () => socket.off("receiveMessage");
  }, [currentChatId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 150);
    return () => clearTimeout(timer);
  }, [messages]);

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
        messages.map((item) => (
          <View
            key={item.id}
            style={[
              styles.bubble,
              item.role === "user"
                ? {
                    alignSelf: "flex-end",
                    backgroundColor: colors.text,
                  }
                : styles.assistantBubble,
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
      {isLoading && <ActivityIndicator style={{ marginTop: 10 }} />}
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
  assistantBubble: { alignSelf: "flex-start", backgroundColor: "#f2f2f2" },
  bubbleText: { fontSize: 16, lineHeight: 20 },
});

export default Chat;
