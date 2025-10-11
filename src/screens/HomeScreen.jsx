import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useTheme } from "@react-navigation/native";
import Prompt from "../components/Prompt";
import Header from "../components/Header";

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

  useEffect(() => {
    if (chats.length === 0) {
      createNewChat();
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: false });
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

    if (!currentChatId) {
      createNewChat();
    }

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

    let updatedChats = chats.map((c) =>
      c.id === currentChatId ? { ...c, messages: [...c.messages, userMsg] } : c
    );

    if (
      updatedChats.find((c) => c.id === currentChatId)?.title === "New Chat"
    ) {
      updatedChats = updatedChats.map((c) =>
        c.id === currentChatId
          ? {
              ...c,
              title: text.length > 50 ? text.substring(0, 50) + "..." : text,
            }
          : c
      );
      setChats(updatedChats);
    }

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

  const renderMessage = ({ item }) => (
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

  const renderChatItem = ({ item }) => (
    <TouchableOpacity style={styles.chatItem} onPress={() => loadChat(item.id)}>
      <Text style={styles.chatTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.chatSubtitle}>
        {item.messages.length > 0
          ? new Date(
              item.messages[item.messages.length - 1].timestamp
            ).toLocaleDateString()
          : ""}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
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
      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [{ translateX: slideValue }],
            backgroundColor: colors.background,
          },
        ]}
      >
        <View
          style={[
            styles.sidebarHeader,
            { borderBottomColor: colors.text + "33" },
          ]}
        >
          <Text style={[styles.sidebarTitle, { color: colors.text }]}>
            Chats
          </Text>
          <TouchableOpacity onPress={toggleNav}>
            <FontAwesome6 name="xmark" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.newChatBtn, { backgroundColor: colors.text + "0A" }]}
          onPress={() => {
            createNewChat();
            toggleNav();
          }}
        >
          <Text style={[styles.newChatText, { color: colors.text }]}>
            New Chat
          </Text>
        </TouchableOpacity>
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.chatList}
        />
      </Animated.View>
      <View style={styles.chatContainer}>
        <ScrollView
          ref={scrollRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoiding}
        >
          <View style={styles.content}>
            <Prompt onSubmit={handleSubmit} input={input} setInput={setInput} />
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.submit, { backgroundColor: colors.mostly }]}
              onPress={() => handleSubmit(input)}
              accessibilityLabel={isLoading ? "Sending" : "Submit input"}
              accessibilityRole="button"
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.background} />
              ) : (
                <Feather name="arrow-up" size={28} color={colors.background} />
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  chatContainer: { flex: 1 },
  messagesContainer: { flex: 1 },
  messagesContent: { paddingVertical: 20, paddingHorizontal: 15 },
  keyboardAvoiding: {
    justifyContent: "flex-end",
    paddingVertical: 10,
  },
  content: {
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  sidebar: {
    position: "absolute",
    top: 25,
    left: 0,
    bottom: 0,
    width: 300,
    padding: 15,
    zIndex: 10,
  },
  sidebarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 15,
    borderBottomWidth: 1,
    marginBottom: 15,
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  newChatBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  newChatText: {
    fontSize: 16,
    fontWeight: "500",
  },
  chatList: { flex: 1 },
  chatItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  chatSubtitle: {
    fontSize: 14,
    opacity: 0.7,
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
