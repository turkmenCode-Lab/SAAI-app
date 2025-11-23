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
  LayoutAnimation,
  UIManager,
  Keyboard,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
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
import { useThemeStore } from "../../store/themeStore";
import { useTranslations } from "../utils/translations";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const HomeScreen = () => {
  const navigation = useNavigation();
  const { token } = useAuthStore();
  const { accentColor } = useThemeStore();
  const { colors } = useTheme();
  const t = useTranslations();
  const insets = useSafeAreaInsets();

  const accentColorValue = useMemo(
    () => colors[accentColor] || colors.primary || "#007AFF",
    [colors, accentColor]
  );

  const [input, setInput] = useState("");
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
  const [searchQ, setSearchQ] = useState("");

  const scrollRef = useRef(null);
  const rotation = useRef(new Animated.Value(0)).current;
  const SCREEN_WIDTH = Dimensions.get("window").width;
  const slideValue = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const apiRef = useRef(null);

  const showToast = useCallback((msg, status = "success") => {
    setToast({ visible: true, message: msg, status });
  }, []);

  useEffect(() => {
    if (!hasCheckedAuth) {
      if (!token) {
        navigation.replace("Auth");
      }
      setHasCheckedAuth(true);
      return;
    }
    if (!token) {
      navigation.replace("Auth");
    }
  }, [hasCheckedAuth, token, navigation]);

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 2300);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  useEffect(() => {
    if (token) {
      apiRef.current = createAPI();
      fetchChats();
    }
    return () => {
      apiRef.current = null;
    };
  }, [token]);

  const fetchChats = useCallback(async () => {
    if (!token || !apiRef.current) return;
    try {
      const { data } = await apiRef.current.get("/chat");
      if (!Array.isArray(data)) {
        throw new Error("Invalid response format");
      }
      const loadedChats = data
        .filter((c) => c && c._id)
        .map((c) => ({
          id: c._id,
          title: c.title || "New Chat",
          createdAt: c.createdAt || new Date().toISOString(),
          messages: (c.messages || []).map((m, i) => ({
            id: `${m._id || i}`,
            role: m.role,
            text: m.content,
            timestamp: m.timestamp || c.createdAt || new Date().toISOString(),
          })),
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setChats(loadedChats);
      if (loadedChats.length > 0) {
        setCurrentChatId(loadedChats[0].id);
      }
    } catch (error) {
      console.error("fetchChats error:", error);
      showToast("Failed to load chats.", "error");
    }
  }, [token, showToast]);

  const createNewChat = useCallback(async () => {
    if (!token || !apiRef.current) return null;
    try {
      const { data } = await apiRef.current.post("/chat", {
        title: "New Chat",
        messages: [],
      });
      if (!data?._id) throw new Error("Invalid response");
      const newChat = {
        id: data._id,
        title: data.title,
        createdAt: data.createdAt || new Date().toISOString(),
        messages: [],
      };
      setChats((prev) => [newChat, ...prev]);
      setCurrentChatId(newChat.id);
      return newChat.id;
    } catch (error) {
      console.error("createNewChat error:", error);
      showToast("Failed to create chat.", "error");
      return null;
    }
  }, [token, showToast]);

  const deleteChat = useCallback(
    async (chatId) => {
      if (!token || !apiRef.current || !chatId) return;
      try {
        await apiRef.current.delete(`/chat/${chatId}`);
        setChats((prev) => {
          const filtered = prev.filter((c) => c.id !== chatId);
          if (currentChatId === chatId) {
            setCurrentChatId(filtered.length > 0 ? filtered[0].id : null);
          }
          return filtered;
        });
        showToast("Chat deleted.", "success");
      } catch (error) {
        console.error("deleteChat error:", error);
        showToast("Failed to delete chat.", "error");
      }
    },
    [token, currentChatId, showToast]
  );

  const loadChat = useCallback((id) => {
    setCurrentChatId(id);
    setIsNavOpen(false);
  }, []);

  const toggleNav = useCallback(() => {
    setIsNavOpen((prev) => {
      const isOpen = !prev;
      Animated.timing(slideValue, {
        toValue: isOpen ? 0 : -SCREEN_WIDTH,
        duration: 525,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }).start();
      return isOpen;
    });
  }, [slideValue]);

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
      const trimmed = text.trim();
      if (!trimmed) return showToast(t("emptyMessage"), "error");
      if (!token) return navigation.replace("Auth");

      let chatId = currentChatId;
      const isNewChat = !chatId;
      if (isNewChat) {
        chatId = await createNewChat();
        if (!chatId) return;
      }

      const title =
        trimmed.length > 35 ? `${trimmed.slice(0, 35)}...` : trimmed;
      const userMsg = {
        id: Date.now().toString(),
        role: "user",
        text: trimmed,
        timestamp: new Date().toISOString(),
        isAnimating: true,
      };

      setChats((prev) => {
        const index = prev.findIndex((c) => c.id === chatId);
        if (index === -1) return prev;
        const updatedChat = {
          ...prev[index],
          messages: [...prev[index].messages, userMsg],
          ...(isNewChat || prev[index].title === "New Chat" ? { title } : {}),
        };
        return [...prev.slice(0, index), updatedChat, ...prev.slice(index + 1)];
      });
      setInput("");

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsLoading(true);

      try {
        const { data } = await apiRef.current.post(`/chat/${chatId}/message`, {
          role: "user",
          content: trimmed,
        });
        if (!data?.message) throw new Error("Invalid response");

        const aiMsg = {
          id: (Date.now() + 1).toString(),
          role: data.message.role,
          text: data.message.content,
          timestamp: data.message.timestamp || new Date().toISOString(),
          isAnimating: true,
        };

        setChats((prev) =>
          prev.map((c) =>
            c.id === chatId ? { ...c, messages: [...c.messages, aiMsg] } : c
          )
        );

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        if (
          isNewChat ||
          chats.find((c) => c.id === chatId)?.title === "New Chat"
        ) {
          await apiRef.current.put(`/chat/${chatId}`, { title });
          setChats((prev) =>
            prev.map((c) => (c.id === chatId ? { ...c, title } : c))
          );
        }
      } catch (error) {
        console.error("handleSubmit error:", error);
        showToast(
          error.response?.data?.message || "Failed to send message.",
          "error"
        );
        setChats((prev) =>
          prev.map((c) =>
            c.id === chatId
              ? {
                  ...c,
                  messages: c.messages.map((m, idx) =>
                    idx === c.messages.length - 1
                      ? { ...m, isAnimating: false }
                      : m
                  ),
                }
              : c
          )
        );
      } finally {
        setIsLoading(false);
        setTimeout(() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setChats((prev) =>
            prev.map((c) =>
              c.id === chatId
                ? {
                    ...c,
                    messages: c.messages.map((m) => ({
                      ...m,
                      isAnimating: false,
                    })),
                  }
                : c
            )
          );
        }, 500);
      }
    },
    [currentChatId, token, createNewChat, showToast, chats, navigation, t]
  );

  const handleNewChat = useCallback(() => {
    createNewChat();
    toggleNav();
  }, [createNewChat, toggleNav]);

  const handleQuickPromptPress = useCallback(
    (promptText) => {
      setInput(promptText);
    },
    [setInput, handleSubmit]
  );

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: isNavOpen ? 1 : 0,
      duration: 525,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, [isNavOpen, rotation]);

  const keyboardBehavior = Platform.OS === "ios" ? "padding" : "height";
  const keyboardOffset = Platform.select({
    ios: insets.bottom + 20,
    android: 0,
  });

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        if (scrollRef.current) {
          scrollRef.current.scrollToEnd({ animated: true });
        }
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        // Optional: Adjust if needed
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  return (
    <SafeAreaView
      edges={["left", "right"]}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Header
        isNavOpen={isNavOpen}
        rotateInterpolate={rotateInterpolate}
        onToggleNav={toggleNav}
      />

      {isNavOpen && (
        <TouchableOpacity
          style={[styles.overlay, { pointerEvents: "auto" }]}
          onPress={toggleNav}
          activeOpacity={1}
          accessible={false}
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
        onDeleteChat={deleteChat}
        searchQ={searchQ}
        setSearchQ={setSearchQ}
        onSubmit={() => {}}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={keyboardBehavior}
        keyboardVerticalOffset={keyboardOffset}
        enabled
      >
        <View style={{ flex: 1, paddingVertical: 10 }}>
          <Chat
            chats={chats}
            currentChatId={currentChatId}
            setChats={setChats}
            colors={colors}
            scrollRef={scrollRef}
            isLoading={isLoading}
            showToast={showToast}
            onQuickPromptPress={handleQuickPromptPress}
          />
        </View>
      </KeyboardAvoidingView>

      <View style={{ paddingBottom: Math.max(insets.bottom, 10) }}>
        <Prompt
          onSubmit={handleSubmit}
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          accentColorValue={accentColorValue}
        />
      </View>

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
  inputContainer: {},
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
