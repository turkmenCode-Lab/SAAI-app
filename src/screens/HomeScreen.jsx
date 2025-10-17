import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
  Animated,
  Dimensions,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { useTheme } from "@react-navigation/native";
import { useAuthStore } from "../../store/authStore";
import Prompt from "../components/Prompt";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Chat from "../components/UI/Chat";
import io from "socket.io-client";
import { EXPO_API_URI } from "../../config";
import { createAPI } from "../utils/api";
import Toast from "../components/UI/Toast";

const HomeScreen = ({ navigation }) => {
  const { token } = useAuthStore();

  const [input, setInput] = useState("");
  const [searchQ, setSearchQ] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    status: "success",
  });
  const { colors } = useTheme();
  const scrollRef = useRef(null);
  const rotation = useRef(new Animated.Value(0)).current;
  const SCREEN_WIDTH = Dimensions.get("window").width;
  const slideValue = useRef(new Animated.Value(-SCREEN_WIDTH)).current;

  const socket = useRef(null);
  const apiRef = useRef(null);

  const showToast = useCallback((message, status = "success") => {
    setToast({ visible: true, message, status });
  }, []);

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(
        () => setToast((prev) => ({ ...prev, visible: false })),
        2300
      );
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  const fetchChats = useCallback(async () => {
    if (!token || !apiRef.current) return;
    try {
      const response = await apiRef.current.get("/chat");
      console.log("Chats:", response.data);

      const loadedChats = response.data
        .filter((chat) => chat && chat._id)
        .map((chat) => ({
          id: chat._id,
          title: chat.title || "New Chat",
          messages: (chat.messages || []).map((msg, index) => ({
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
      showToast("Failed to load chats.", "error");
    }
  }, [token, showToast]);

  const createNewChat = useCallback(async () => {
    if (!token || !apiRef.current) return;
    try {
      const response = await apiRef.current.post("/chat", {
        title: "New Chat",
        messages: [],
      });
      if (!response.data?._id) {
        throw new Error("Invalid response from server");
      }
      const newChat = {
        id: response.data._id,
        title: response.data.title,
        messages: [],
      };
      setChats((prev) => [...(prev.filter((c) => c && c.id) || []), newChat]);
      setCurrentChatId(newChat.id);
    } catch (err) {
      console.error("Error creating chat:", err.response?.data || err.message);
      showToast("Failed to create new chat.", "error");
    }
  }, [token, showToast]);

  useEffect(() => {
    if (token) {
      apiRef.current = createAPI();
      socket.current = io(EXPO_API_URI || "http://localhost:5000");
      fetchChats();
    }
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
      apiRef.current = null;
    };
  }, [token, fetchChats]);

  const loadChat = useCallback((id) => {
    if (!id || !socket.current) return;
    setCurrentChatId(id);
    socket.current.emit("joinChat", id);
    setIsNavOpen(false);
  }, []);

  const toggleNav = useCallback(() => {
    const newOpen = !isNavOpen;
    Animated.timing(slideValue, {
      toValue: newOpen ? 0 : -SCREEN_WIDTH,
      duration: 525,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false,
    }).start();
    setIsNavOpen(newOpen);
  }, [isNavOpen]);

  const rotateInterpolate = useMemo(
    () =>
      rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "90deg"],
      }),
    []
  );

  const handleSubmit = useCallback(
    async (text) => {
      if (!text.trim()) {
        showToast("Please enter some text before submitting.", "error");
        return;
      }

      let chatId = currentChatId;
      if (!chatId) {
        if (!token) return;
        await createNewChat();
        chatId = currentChatId;
        if (!chatId) {
          showToast("Failed to create chat.", "error");
          return;
        }
      }

      setIsLoading(true);

      const userMsg = {
        id: Date.now(),
        role: "user",
        text,
        timestamp: new Date().toISOString(),
      };

      setChats((prev) => {
        const filteredPrev = prev.filter((c) => c && c.id) || [];
        const chatIndex = filteredPrev.findIndex((c) => c.id === chatId);
        if (chatIndex === -1) return filteredPrev;

        const updatedChat = {
          ...filteredPrev[chatIndex],
          messages: [...(filteredPrev[chatIndex].messages || []), userMsg],
          title:
            filteredPrev[chatIndex].title === "New Chat"
              ? text.length > 50
                ? text.substring(0, 50) + "..."
                : text
              : filteredPrev[chatIndex].title,
        };

        return [
          ...filteredPrev.slice(0, chatIndex),
          updatedChat,
          ...filteredPrev.slice(chatIndex + 1),
        ];
      });

      setInput("");

      if (socket.current) {
        socket.current.emit("sendMessage", {
          chatId,
          role: "user",
          content: text,
        });
      }

      setIsLoading(false);
    },
    [currentChatId, token, createNewChat, showToast]
  );

  const handleNewChat = useCallback(() => {
    createNewChat();
    toggleNav();
  }, [createNewChat, toggleNav]);

  useEffect(() => {
    if (chats.length === 0 && !isLoading && token) {
      createNewChat();
    }
  }, [chats.length, isLoading, token, createNewChat]);

  return (
    <SafeAreaView
      edges={["left", "right", "top"]}
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
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
        onNewChat={handleNewChat}
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
        <View style={[styles.inputContainer, { paddingHorizontal: 15 }]}>
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
      <Toast
        message={toast.message}
        visible={toast.visible}
        status={toast.status}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  inputContainer: { paddingVertical: 10 },
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
