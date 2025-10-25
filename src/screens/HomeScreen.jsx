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
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../../store/authStore";
import { useLangStore } from "../../store/langStore";
import Prompt from "../components/Prompt";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Chat from "../components/UI/Chat";
import io from "socket.io-client";
import { EXPO_API_URI } from "../../config";
import { createAPI } from "../utils/api";
import Toast from "../components/UI/Toast";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { token } = useAuthStore();
  const { t } = useLangStore();

  const [input, setInput] = useState("");
  const [searchQ, setSearchQ] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
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
    if (!hasCheckedAuth) {
      if (!token) {
        navigation.replace("Auth");
      }
      setHasCheckedAuth(true);
    }
  }, [hasCheckedAuth, token, navigation]);

  useEffect(() => {
    if (hasCheckedAuth && !token) {
      navigation.replace("Auth");
    }
  }, [hasCheckedAuth, token, navigation]);

  const fetchChats = useCallback(async () => {
    if (!token || !apiRef.current) return;
    try {
      const response = await apiRef.current.get("/chat");
      console.log("Chats:", response.data);

      const loadedChats = response.data
        .filter((chat) => chat && chat._id)
        .map((chat) => ({
          id: chat._id,
          title: chat.title || t("newChat"),
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
      showToast(t("failedToLoadChats") || "Failed to load chats.", "error");
    }
  }, [token, showToast, t]);

  const createNewChat = useCallback(async () => {
    if (!token || !apiRef.current) return;
    try {
      const response = await apiRef.current.post("/chat", {
        title: t("newChat"),
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
      showToast(
        t("failedToCreateChat") || "Failed to create new chat.",
        "error"
      );
    }
  }, [token, showToast, t]);

  const deleteChat = useCallback(
    async (chatId) => {
      if (!token || !apiRef.current || !chatId) return;
      try {
        await apiRef.current.delete(`/chat/${chatId}`);
        setChats((prev) => prev.filter((c) => c.id !== chatId));
        if (currentChatId === chatId) {
          setCurrentChatId(null);
        }
        showToast(t("chatDeleted") || "Chat deleted successfully.", "success");
      } catch (err) {
        console.error(
          "Error deleting chat:",
          err.response?.data || err.message
        );
        showToast(t("failedToDeleteChat") || "Failed to delete chat.", "error");
      }
    },
    [token, currentChatId, showToast, t]
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
    setIsNavOpen((prev) => {
      const newOpen = !prev;
      Animated.timing(slideValue, {
        toValue: newOpen ? 0 : -SCREEN_WIDTH,
        duration: 525,
        easing: Easing.out(Easing.exp),
        useNativeDriver: false,
      }).start();
      return newOpen;
    });
  }, []);

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
        showToast(
          t("pleaseEnterText") || "Please enter some text before submitting.",
          "error"
        );
        return;
      }

      if (!token) {
        showToast(
          t("authRequired") || "Authentication required. Please log in.",
          "error"
        );
        navigation.replace("Auth");
        return;
      }

      let chatId = currentChatId;
      let isNewChat = !chatId;
      if (isNewChat) {
        await createNewChat();
        chatId = currentChatId;
        if (!chatId) {
          showToast(
            t("failedToCreateChat") || "Failed to create chat.",
            "error"
          );
          setIsLoading(false);
          return;
        }
      }

      if (!chatId) {
        showToast(t("invalidChatId") || "Invalid chat ID.", "error");
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

      setChats((prev) => {
        const filteredPrev = prev.filter((c) => c && c.id) || [];
        const chatIndex = filteredPrev.findIndex((c) => c.id === chatId);
        if (chatIndex === -1) return filteredPrev;

        const updatedChat = {
          ...filteredPrev[chatIndex],
          messages: [...(filteredPrev[chatIndex].messages || []), userMsg],
          title:
            isNewChat || filteredPrev[chatIndex].title === t("newChat")
              ? newTitle
              : filteredPrev[chatIndex].title,
        };

        return [
          ...filteredPrev.slice(0, chatIndex),
          updatedChat,
          ...filteredPrev.slice(chatIndex + 1),
        ];
      });

      if (
        (isNewChat ||
          chats.find((c) => c.id === chatId)?.title === t("newChat")) &&
        apiRef.current
      ) {
        (async () => {
          try {
            await apiRef.current.put(`/chat/${chatId}`, { title: newTitle });
          } catch (err) {
            console.error("Error updating chat title:", err);
          }
        })();
      }

      setInput("");

      if (socket.current) {
        socket.current.emit("joinChat", chatId);

        const messageId = Date.now();
        console.log(
          `📤 Emitting sendMessage: chatId=${chatId}, msgId=${messageId}, text="${text}"`
        );

        socket.current.emit("sendMessage", {
          chatId,
          role: "user",
          content: text,
          messageId,
        });

        const handleResponse = useCallback(
          (data) => {
            console.log(
              `📨 Received response for msgId? ${data.messageId || "N/A"}:`,
              data
            );
            if (data.chatId === chatId && data.role !== "user") {
              setIsLoading(false);
              socket.current.off("receiveMessage", handleResponse);
            }
          },
          [chatId]
        );

        const handleError = useCallback(
          (data) => {
            if (data.chatId === chatId) {
              console.error("Socket error for this msg:", data.message);
              showToast(
                t(`chatError.${data.message}`) || `Chat error: ${data.message}`,
                "error"
              );
              setIsLoading(false);
              socket.current.off("chatError", handleError);
            }
          },
          [chatId, showToast, t]
        );

        socket.current.on("receiveMessage", handleResponse);
        socket.current.on("chatError", handleError);

        const timeoutId = setTimeout(() => {
          console.warn("⏰ Message timeout – resetting loading");
          setIsLoading(false);
          socket.current.off("receiveMessage", handleResponse);
          socket.current.off("chatError", handleError);
          showToast(
            t("responseTimedOut") || "Response timed out. Try again?",
            "error"
          );
        }, 30000);

        const origDisconnect = socket.current.disconnect;
        socket.current.disconnect = () => {
          clearTimeout(timeoutId);
          socket.current.off("receiveMessage", handleResponse);
          socket.current.off("chatError", handleError);
          origDisconnect.call(socket.current);
        };
      } else {
        console.warn("No socket available – can't send real-time");
        showToast(
          t("connectionIssue") ||
            "Connection issue. Messages saved locally only.",
          "warning"
        );
        setIsLoading(false);
      }
    },
    [currentChatId, token, createNewChat, showToast, chats, navigation, t]
  );

  const handleNewChat = useCallback(() => {
    createNewChat();
    toggleNav();
  }, [createNewChat, toggleNav]);

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: isNavOpen ? 1 : 0,
      duration: 525,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, [isNavOpen, rotation]);

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
        style={{ flex: 1, paddingVertical: 15 }}
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
              style={[styles.submit, { backgroundColor: colors.accent }]}
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
