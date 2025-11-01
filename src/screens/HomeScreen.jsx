// src/screens/HomeScreen.jsx
import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import {
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
import Prompt from "../components/Prompt";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Chat from "../components/UI/Chat";
import { createAPI } from "../utils/api";
import Toast from "../components/UI/Toast";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { token } = useAuthStore();

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

  const apiRef = useRef(null);

  const showToast = useCallback((msg, status = "success") => {
    setToast({ visible: true, message: msg, status });
  }, []);

  // Toast auto‑hide
  useEffect(() => {
    if (toast.visible) {
      const t = setTimeout(
        () => setToast((p) => ({ ...p, visible: false })),
        2300
      );
      return () => clearTimeout(t);
    }
  }, [toast.visible]);

  // ---- AUTH GUARD ----
  useEffect(() => {
    if (!hasCheckedAuth) {
      if (!token) navigation.replace("Auth");
      setHasCheckedAuth(true);
    }
  }, [hasCheckedAuth, token, navigation]);

  useEffect(() => {
    if (hasCheckedAuth && !token) navigation.replace("Auth");
  }, [hasCheckedAuth, token, navigation]);

  // ---- FETCH CHATS ----
  const fetchChats = useCallback(async () => {
    if (!token || !apiRef.current) return;
    try {
      const { data } = await apiRef.current.get("/chat");
      const loaded = (data || [])
        .filter((c) => c && c._id)
        .map((c) => ({
          id: c._id,
          title: c.title || "New Chat",
          messages: (c.messages || []).map((m, i) => ({
            id: `${m._id || i}`,
            role: m.role,
            text: m.content,
            timestamp: m.timestamp || c.createdAt || new Date().toISOString(),
          })),
        }));
      setChats(loaded);
      if (loaded.length && !currentChatId) setCurrentChatId(loaded[0].id);
    } catch (e) {
      console.error("fetchChats error:", e);
      showToast("Failed to load chats.", "error");
    }
  }, [token, currentChatId, showToast]);

  // ---- CREATE CHAT ----
  const createNewChat = useCallback(async () => {
    if (!token || !apiRef.current) return null;
    try {
      const { data } = await apiRef.current.post("/chat", {
        title: "New Chat",
        messages: [],
      });
      const nc = { id: data._id, title: data.title, messages: [] };
      setChats((p) => [...p, nc]);
      setCurrentChatId(nc.id);
      return nc.id;
    } catch (e) {
      console.error("createChat error:", e);
      showToast("Failed to create chat.", "error");
      return null;
    }
  }, [token, showToast]);

  // ---- DELETE CHAT ----
  const deleteChat = useCallback(
    async (chatId) => {
      if (!token || !apiRef.current || !chatId) return;
      try {
        await apiRef.current.delete(`/chat/${chatId}`);
        setChats((p) => p.filter((c) => c.id !== chatId));
        if (currentChatId === chatId) {
          const left = chats.filter((c) => c.id !== chatId);
          setCurrentChatId(left[0]?.id || null);
        }
        showToast("Chat deleted.", "success");
      } catch (e) {
        console.error("deleteChat error:", e);
        showToast("Failed to delete chat.", "error");
      }
    },
    [token, currentChatId, chats, showToast]
  );

  // ---- INIT API (only when token exists) ----
  useEffect(() => {
    if (token) {
      console.log("Token ready → init API");
      apiRef.current = createAPI();
      fetchChats();
    }
    return () => {
      apiRef.current = null;
    };
  }, [token, fetchChats]);

  // ---- SIDEBAR ----
  const loadChat = useCallback((id) => {
    setCurrentChatId(id);
    setIsNavOpen(false);
  }, []);

  const toggleNav = useCallback(() => {
    setIsNavOpen((prev) => {
      const open = !prev;
      Animated.timing(slideValue, {
        toValue: open ? 0 : -SCREEN_WIDTH,
        duration: 525,
        easing: Easing.out(Easing.exp),
        useNativeDriver: false, // <-- REMOVED
      }).start();
      return open;
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

  // ---- SEND MESSAGE ----
  const handleSubmit = useCallback(
    async (text) => {
      if (!text.trim()) return showToast("Please type a message.", "error");
      if (!token) return navigation.replace("Auth");

      let chatId = currentChatId;
      const isNew = !chatId;

      if (isNew) {
        const id = await createNewChat();
        if (!id) return;
        chatId = id;
      }

      setIsLoading(true);
      const userMsg = {
        id: Date.now(),
        role: "user",
        text,
        timestamp: new Date().toISOString(),
      };
      const title = text.length > 35 ? text.slice(0, 35) + "..." : text;

      // optimistic UI
      setChats((p) => {
        const i = p.findIndex((c) => c.id === chatId);
        if (i === -1) return p;
        const c = { ...p[i] };
        c.messages = [...c.messages, userMsg];
        if (isNew || c.title === "New Chat") c.title = title;
        return [...p.slice(0, i), c, ...p.slice(i + 1)];
      });
      setInput("");

      try {
        const { data } = await apiRef.current.post(`/chat/${chatId}/message`, {
          role: "user",
          content: text,
        });

        const ai = data.message;
        const aiMsg = {
          id: Date.now() + 1,
          role: ai.role,
          text: ai.content,
          timestamp: ai.timestamp || new Date().toISOString(),
        };

        setChats((p) =>
          p.map((c) =>
            c.id === chatId ? { ...c, messages: [...c.messages, aiMsg] } : c
          )
        );

        // update title
        if (isNew || chats.find((c) => c.id === chatId)?.title === "New Chat") {
          await apiRef.current.put(`/chat/${chatId}`, { title });
          setChats((p) =>
            p.map((c) => (c.id === chatId ? { ...c, title } : c))
          );
        }
      } catch (e) {
        console.error("sendMessage error:", e);
        showToast(e.response?.data?.message || "Failed to send.", "error");
      } finally {
        setIsLoading(false);
      }
    },
    [currentChatId, token, createNewChat, showToast, chats, navigation]
  );

  const handleNewChat = useCallback(() => {
    createNewChat();
    toggleNav();
  }, [createNewChat, toggleNav]);

  // rotate hamburger
  useEffect(() => {
    Animated.timing(rotation, {
      toValue: isNavOpen ? 1 : 0,
      duration: 525,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false, // <-- REMOVED
    }).start();
  }, [isNavOpen]);

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

      {/* Overlay – pointerEvents moved to style */}
      {isNavOpen && (
        <TouchableOpacity
          style={[styles.overlay, { pointerEvents: "auto" }]}
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
    borderRadius: 26,
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
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 5,
  },
});

export default HomeScreen;
