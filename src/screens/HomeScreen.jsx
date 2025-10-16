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
  Animated,
  Dimensions,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { useTheme } from "@react-navigation/native";
import Prompt from "../components/Prompt";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Chat from "../components/UI/Chat";
import io from "socket.io-client";
import { EXPO_API_URI } from "../../config";
import { createAPI } from "../utils/api";

const HomeScreen = ({ navigation }) => {
  const [input, setInput] = useState("");
  const [searchQ, setSearchQ] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { colors } = useTheme();
  const scrollRef = useRef(null);
  const rotation = useRef(new Animated.Value(0)).current;
  const SCREEN_WIDTH = Dimensions.get("window").width;
  const slideValue = useRef(new Animated.Value(-SCREEN_WIDTH)).current;

  const socket = io(EXPO_API_URI || "http://localhost:5000");

  const fetchChats = async () => {
    try {
      const api = createAPI();
      const response = await api.get("/chat");
      console.log("Chats:", response.data);

      const loadedChats = response.data.map((chat) => ({
        id: chat._id,
        title: chat.title || "New Chat",
        messages: chat.messages.map((msg, index) => ({
          id: index,
          role: msg.role,
          text: msg.content,
          timestamp: chat.createdAt || new Date().toISOString(),
        })),
      }));
      setChats(loadedChats);
      if (loadedChats.length > 0) {
        setCurrentChatId(loadedChats[0].id);
      }
    } catch (err) {
      console.error("Error fetching chats:", err.response?.data || err.message);
    }
  };

  const createNewChat = async () => {
    try {
      const api = createAPI();
      const response = await api.post("/chat", {
        title: "New Chat",
        messages: [],
      });
      const newChat = {
        id: response.data._id,
        title: response.data.title,
        messages: [],
      };
      setChats((prev) => [...prev, newChat]);
      setCurrentChatId(newChat.id);
    } catch (err) {
      console.error("Error creating chat:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to create new chat.");
    }
  };

  useEffect(() => {
    fetchChats();
    return () => socket.disconnect();
  }, []);

  const loadChat = (id) => {
    setCurrentChatId(id);
    socket.emit("joinChat", id);
    setIsNavOpen(false);
  };

  const toggleNav = () => {
    const newOpen = !isNavOpen;
    Animated.timing(slideValue, {
      toValue: newOpen ? 0 : -SCREEN_WIDTH,
      duration: 525,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false,
    }).start();
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
      await createNewChat();
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

    socket.emit("sendMessage", {
      chatId: currentChatId,
      role: "user",
      content: text,
    });

    setIsLoading(false);
  };

  useEffect(() => {
    if (chats.length === 0 && !isLoading) {
      createNewChat();
    }
  }, [chats.length]);

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
        searchQ={searchQ}
        setSearchQ={setSearchQ}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <Chat
          chats={chats}
          currentChatId={currentChatId}
          setChats={setChats}
          colors={colors}
          scrollRef={scrollRef}
          isLoading={isLoading}
          socket={socket}
        />
        <View
          style={[
            styles.inputContainer,
            {
              paddingBottom: 10 + (Platform.OS === "ios" ? 20 : 0),
            },
          ]}
        >
          <View style={styles.content}>
            <Prompt onSubmit={handleSubmit} input={input} setInput={setInput} />
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.submit, { backgroundColor: colors.mostly }]}
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
  inputContainer: { paddingVertical: 10, paddingHorizontal: 15 },
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
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 5,
  },
});

export default HomeScreen;
