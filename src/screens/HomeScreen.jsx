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

  useEffect(() => {
    if (!token) {
      navigation.replace("Auth");
    }
  }, [token, navigation]);

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

  const deleteChat = useCallback(
    async (chatId) => {
      if (!token || !apiRef.current || !chatId) return;
      try {
        await apiRef.current.delete(`/chat/${chatId}`);
        setChats((prev) => prev.filter((c) => c.id !== chatId));
        if (currentChatId === chatId) {
          setCurrentChatId(null);
        }
        showToast("Chat deleted successfully.", "success");
      } catch (err) {
        console.error(
          "Error deleting chat:",
          err.response?.data || err.message
        );
        showToast("Failed to delete chat.", "error");
      }
    },
    [token, currentChatId, showToast]
  );

  useEffect(() => {
    if (token) {
      apiRef.current = createAPI();
      if (socket.current) {
        socket.current.disconnect();
      }
      socket.current = io(EXPO_API_URI || "http://localhost:5000");
      fetchChats();
    }
    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
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

      if (!token) {
        showToast("Authentication required. Please log in.", "error");
        navigation.replace("Auth");
        return;
      }

      let chatId = currentChatId;
      let isNewChat = !chatId;
      if (isNewChat) {
        await createNewChat();
        chatId = currentChatId;
        if (!chatId) {
          showToast("Failed to create chat.", "error");
          setIsLoading(false); // Ensure reset if failed
          return;
        }
      }

      // Validate chatId exists post-creation
      if (!chatId) {
        showToast("Invalid chat ID.", "error");
        return;
      }

      setIsLoading(true);

      const userMsg = {
        id: Date.now(),
        role: "user",
        text,
        timestamp: new Date().toISOString(),
      };

      const newTitle = text.length > 35 ? text.substring(0, 35) + "..." : text;

      // Optimistically add user message to local state
      setChats((prev) => {
        const filteredPrev = prev.filter((c) => c && c.id) || [];
        const chatIndex = filteredPrev.findIndex((c) => c.id === chatId);
        if (chatIndex === -1) return filteredPrev; // Shouldn't happen, but safe

        const updatedChat = {
          ...filteredPrev[chatIndex],
          messages: [...(filteredPrev[chatIndex].messages || []), userMsg],
          title:
            isNewChat || filteredPrev[chatIndex].title === "New Chat"
              ? newTitle
              : filteredPrev[chatIndex].title,
        };

        return [
          ...filteredPrev.slice(0, chatIndex),
          updatedChat,
          ...filteredPrev.slice(chatIndex + 1),
        ];
      });

      // Update title on server if needed (async, non-blocking)
      if (
        (isNewChat ||
          chats.find((c) => c.id === chatId)?.title === "New Chat") &&
        apiRef.current
      ) {
        (async () => {
          try {
            await apiRef.current.put(`/chat/${chatId}`, { title: newTitle });
          } catch (err) {
            console.error("Error updating chat title:", err);
            // Non-critical, so no toast
          }
        })();
      }

      setInput("");

      // Socket emit for server-side processing
      if (socket.current) {
        // Re-join chat if needed (e.g., new chat)
        socket.current.emit("joinChat", chatId);

        const messageId = Date.now(); // Unique ID for this message's lifecycle
        console.log(
          `📤 Emitting sendMessage: chatId=${chatId}, msgId=${messageId}, text="${text}"`
        );

        socket.current.emit("sendMessage", {
          chatId,
          role: "user",
          content: text,
          messageId, // Optional: Pass for server to echo back if you want
        });

        // Temp listener to reset loading on response (user or AI msg)
        const handleResponse = (data) => {
          console.log(
            `📨 Received response for msgId? ${data.messageId || "N/A"}:`,
            data
          );
          if (data.chatId === chatId && data.role !== "user") {
            // Ignore user echo if any
            setIsLoading(false);
            socket.current.off("receiveMessage", handleResponse); // Cleanup
          }
        };

        // Also listen for errors to reset loading
        const handleError = (data) => {
          if (data.chatId === chatId) {
            console.error("Socket error for this msg:", data.message);
            showToast(`Chat error: ${data.message}`, "error");
            setIsLoading(false);
            socket.current.off("chatError", handleError);
          }
        };

        socket.current.on("receiveMessage", handleResponse);
        socket.current.on("chatError", handleError);

        // Fallback timeout (e.g., 30s) to prevent stuck loading
        const timeoutId = setTimeout(() => {
          console.warn("⏰ Message timeout – resetting loading");
          setIsLoading(false);
          socket.current.off("receiveMessage", handleResponse);
          socket.current.off("chatError", handleError);
          showToast("Response timed out. Try again?", "error");
        }, 30000);

        // Cleanup on any disconnect (in a real app, use a ref for this)
        const origDisconnect = socket.current.disconnect;
        socket.current.disconnect = () => {
          clearTimeout(timeoutId);
          socket.current.off("receiveMessage", handleResponse);
          socket.current.off("chatError", handleError);
          origDisconnect.call(socket.current);
        };
      } else {
        // No socket? Fallback to REST (but warn)
        console.warn("No socket available – can't send real-time");
        showToast("Connection issue. Messages saved locally only.", "warning");
        setIsLoading(false);
      }
    },
    [currentChatId, token, createNewChat, showToast, chats, navigation]
  );
  const handleNewChat = useCallback(() => {
    createNewChat();
    toggleNav();
  }, [createNewChat, toggleNav]);

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
        onDeleteChat={deleteChat}
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
          socket={socket.current}
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
