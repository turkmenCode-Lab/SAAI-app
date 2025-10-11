import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { useTheme } from "@react-navigation/native";
import Prompt from "../components/Prompt";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const HomeScreen = ({ navigation }) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { colors } = useTheme();
  const scrollRef = useRef(null);
  const rotation = useRef(new Animated.Value(0)).current;
  const slideValue = useRef(new Animated.Value(-300)).current;

  const messages = useMemo(() => {
    const currentChat = chats.find((chat) => chat.id === currentChatId);
    return currentChat ? currentChat.messages : [];
  }, [chats, currentChatId]);

  // Create first chat
  useEffect(() => {
    if (chats.length === 0) createNewChat();
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 150);
    return () => clearTimeout(timer);
  }, [messages]);

  const createNewChat = () => {
    const newId = Date.now();
    setChats((prev) => [
      ...prev,
      { id: newId, title: "New Chat", messages: [] },
    ]);
    setCurrentChatId(newId);
  };

  const loadChat = (id) => {
    setCurrentChatId(id);
    setIsNavOpen(false);
  };

  const toggleNav = () => {
    if (!rotation || !slideValue) return; // ✅ avoid undefined refs

    const newOpen = !isNavOpen;
    const rotTo = newOpen ? 1 : 0;
    const slideTo = newOpen ? 0 : -300;

    Animated.parallel([
      Animated.timing(rotation, {
        toValue: rotTo,
        duration: 125,
        useNativeDriver: true,
      }),
      Animated.timing(slideValue, {
        toValue: slideTo,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    setIsNavOpen(newOpen);
  };

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  const handleSubmit = async (text) => {
    if (!text.trim()) {
      Alert.alert("Error", "Please enter some text before submitting.");
      return;
    }

    if (!currentChatId) createNewChat();

    setIsLoading(true);

    const userMsg = {
      id: Date.now(),
      role: "user",
      text,
      timestamp: new Date().toISOString(),
    };

    setChats((prev) =>
      prev.map((c) =>
        c.id === currentChatId
          ? { ...c, messages: [...c.messages, userMsg] }
          : c
      )
    );

    // Update title if new chat
    setChats((prev) =>
      prev.map((c) =>
        c.id === currentChatId && c.title === "New Chat"
          ? {
              ...c,
              title: text.length > 50 ? text.substring(0, 50) + "..." : text,
            }
          : c
      )
    );

    setInput("");

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const aiMsg = {
      id: Date.now() + 1,
      role: "assistant",
      text: `This is a response to your query: ${text}`,
      timestamp: new Date().toISOString(),
    };

    setChats((prev) =>
      prev.map((c) =>
        c.id === currentChatId ? { ...c, messages: [...c.messages, aiMsg] } : c
      )
    );

    setIsLoading(false);
  };

  const renderMessage = (item) => (
    <View
      key={item.id}
      style={[
        styles.bubble,
        item.role === "user" ? styles.userBubble : styles.assistantBubble,
      ]}
    >
      <Text
        style={[
          styles.bubbleText,
          { color: item.role === "user" ? colors.background : colors.text },
        ]}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      edges={["left", "right", "top"]}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Header
        isNavOpen={isNavOpen}
        rotateInterpolate={rotateInterpolate}
        onToggleNav={toggleNav}
      />

      {isNavOpen && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={toggleNav}
          activeOpacity={1}
        />
      )}

      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        onLoadChat={loadChat}
        onNewChat={() => {
          createNewChat();
          toggleNav();
        }}
        onClose={toggleNav}
        slideValue={slideValue}
        isOpen={isNavOpen}
      />

      {/* Keyboard avoiding container */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContent}
          ref={scrollRef}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
        >
          {messages.length === 0 ? (
            <Text
              style={[styles.greeting, { color: colors.text }]}
              accessibilityLabel="Greeting message"
            >
              How can I help you today?
            </Text>
          ) : (
            messages.map(renderMessage)
          )}
        </ScrollView>

        {/* Fixed input area */}
        <View style={styles.inputContainer}>
          <View style={styles.content}>
            <Prompt onSubmit={handleSubmit} input={input} setInput={setInput} />
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.submit, { backgroundColor: colors.primary }]}
              onPress={() => handleSubmit(input)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.background} />
              ) : (
                <Feather name="arrow-up" size={28} color={colors.background} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  chatContainer: { flex: 1 },
  chatContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  inputContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ccc",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  submit: {
    borderRadius: 22.5,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    width: 52,
    height: 52,
  },
  greeting: { alignSelf: "center", fontSize: 24, fontWeight: "600" },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 5,
  },
  bubble: {
    marginVertical: 4,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    maxWidth: "80%",
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#2d72e2ff",
  },
  assistantBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#f2f2f2",
  },
  bubbleText: {
    fontSize: 16,
    lineHeight: 20,
  },
});

export default HomeScreen;
