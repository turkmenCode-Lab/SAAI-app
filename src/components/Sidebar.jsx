import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  TextInput,
  BackHandler,
  Platform,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "@react-navigation/native";
import { useAuthStore } from "../../store/authStore";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import {
  PanGestureHandler,
  State,
  FlatList,
} from "react-native-gesture-handler";
import { useThemeStore } from "../../store/themeStore";
import { useTranslations } from "../utils/translations";
import { BlurView } from "expo-blur";

const Sidebar = ({
  chats,
  currentChatId,
  onLoadChat,
  onNewChat,
  onClose,
  slideValue,
  isOpen,
  onSubmit,
  searchQ,
  setSearchQ,
  onDeleteChat,
}) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const t = useTranslations();
  const { language } = useThemeStore();

  const user = useAuthStore((state) => state.user);

  const animationRefs = useRef(new Map());

  const filteredChats = useMemo(() => {
    if (!searchQ?.trim()) return chats;
    const lowerSearch = searchQ.toLowerCase();
    return chats.filter((chat) =>
      chat.title.toLowerCase().includes(lowerSearch)
    );
  }, [chats, searchQ]);

  const renderChatItem = useCallback(
    ({ item, index }) => {
      const itemId = item.id;
      let animRefs = animationRefs.current.get(itemId);
      if (!animRefs) {
        animRefs = {
          opacity: new Animated.Value(1),
          height: new Animated.Value(60),
        };
        animationRefs.current.set(itemId, animRefs);
      }

      const handleDelete = () => {
        if (animRefs && animRefs.opacity && animRefs.height) {
          Animated.parallel([
            Animated.timing(animRefs.opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }),
            Animated.timing(animRefs.height, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }),
          ]).start(() => {
            onDeleteChat(itemId);
            animationRefs.current.delete(itemId);
          });
        } else {
          onDeleteChat(itemId);
        }
      };

      const handleLoadChat = () => {
        try {
          onLoadChat(itemId);
          setSearchQ("");
          onClose();
        } catch (error) {
          console.error("Error loading chat:", error);
        }
      };

      const getLastMessageDate = () => {
        try {
          if (item.messages?.length > 0) {
            const timestamp = item.messages[item.messages.length - 1].timestamp;
            const date = new Date(timestamp);
            return isNaN(date.getTime())
              ? ""
              : date.toLocaleDateString(language);
          }
          return "";
        } catch (error) {
          console.error("Error parsing date:", error);
          return "";
        }
      };

      const handleLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        if (animRefs && animRefs.height && height > 0 && height !== 60) {
          animRefs.height.setValue(height);
        }
      };

      const ChatItemContent = () => (
        <Animated.View
          style={[
            styles.chatItemContainer,
            {
              opacity: animRefs?.opacity || 1,
              height: animRefs?.height || 60,
            },
          ]}
          onLayout={handleLayout}
        >
          <TouchableOpacity
            style={[
              styles.chatItem,
              currentChatId === itemId && styles.activeChatItem,
            ]}
            onPress={handleLoadChat}
            activeOpacity={0.7}
          >
            <View style={styles.chatContent}>
              <Text
                style={[styles.chatTitle, { color: colors.text }]}
                numberOfLines={1}
              >
                {item.title || t("untitledChat")}
              </Text>
              <Text style={[styles.chatSubtitle, { color: colors.neutral }]}>
                {getLastMessageDate()}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="delete-outline"
                size={20}
                color={colors.error}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </Animated.View>
      );

      return Platform.OS === "ios" && currentChatId === itemId ? (
        <BlurView
          intensity={20}
          tint={colors.background === "#000000" ? "dark" : "light"}
          style={[
            styles.glassContainer,
            {
              borderColor: colors.primary + "30",
            },
          ]}
        >
          <ChatItemContent />
        </BlurView>
      ) : (
        <View
          style={[
            currentChatId === itemId && styles.glassContainer,
            currentChatId === itemId &&
              Platform.OS === "android" && {
                backgroundColor: colors.primary + "15",
                borderColor: colors.primary + "30",
              },
          ]}
        >
          <ChatItemContent />
        </View>
      );
    },
    [
      currentChatId,
      colors,
      onLoadChat,
      onDeleteChat,
      setSearchQ,
      language,
      t,
      onClose,
    ]
  );

  const handleNewChat = useCallback(() => {
    try {
      onNewChat();
      setSearchQ("");
      onClose();
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  }, [onNewChat, setSearchQ, onClose]);

  const handleLogout = useCallback(() => {
    try {
      useAuthStore.getState().logout();
    } catch (e) {
      console.error("Logout error:", e);
    }
  }, []);

  const onGestureEvent = useCallback(
    (event) => {
      if (event.nativeEvent.state === State.END) {
        const { translationX } = event.nativeEvent;
        if (translationX < -100) {
          onClose();
        }
      }
    },
    [onClose]
  );

  const handleSearchSubmit = useCallback(() => {
    if (onSubmit) {
      onSubmit(searchQ);
    }
  }, [onSubmit, searchQ]);

  useEffect(() => {
    if (!isOpen) return;

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        onClose();
        return true;
      }
    );

    return () => backHandler.remove();
  }, [isOpen, onClose]);

  useEffect(() => {
    const currentIds = new Set(chats.map((chat) => chat.id));
    for (const [id] of animationRefs.current.entries()) {
      if (!currentIds.has(id)) {
        animationRefs.current.delete(id);
      }
    }
  }, [chats]);

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View
        style={[
          styles.sidebar,
          {
            backgroundColor: colors.background,
            transform: [{ translateX: slideValue }],
            zIndex: 1000,
            paddingTop: Platform.OS === "android" ? 50 : 70,
            paddingHorizontal: 15,
            paddingBottom: 15,
          },
        ]}
      >
        <View style={styles.headerSection}>
          <View style={styles.titleRow}>
            <Text style={[styles.sidebarTitle, { color: colors.text }]}>
              {t("diveHistory")}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              style={styles.closeBtn}
            >
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={colors.neutral}
              />
            </TouchableOpacity>
          </View>

          {/* Glass Search Bar */}
          {Platform.OS === "ios" ? (
            <BlurView
              intensity={80}
              tint={colors.background === "#000000" ? "dark" : "light"}
              style={[
                styles.searchContainer,
                {
                  borderColor: colors.text + "15",
                },
              ]}
            >
              <MaterialCommunityIcons
                name="magnify"
                size={20}
                color={colors.neutral}
              />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                autoCorrect={false}
                placeholder={t("searchHistory")}
                placeholderTextColor={colors.neutral}
                autoCapitalize="none"
                value={searchQ}
                onChangeText={setSearchQ}
                onSubmitEditing={handleSearchSubmit}
                returnKeyType="search"
              />
            </BlurView>
          ) : (
            <View
              style={[
                styles.searchContainer,
                styles.androidGlass,
                {
                  backgroundColor: colors.background + "CC",
                  borderColor: colors.text + "15",
                },
              ]}
            >
              <MaterialCommunityIcons
                name="magnify"
                size={20}
                color={colors.neutral}
              />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                autoCorrect={false}
                placeholder={t("searchHistory")}
                placeholderTextColor={colors.neutral}
                autoCapitalize="none"
                value={searchQ}
                onChangeText={setSearchQ}
                onSubmitEditing={handleSearchSubmit}
                returnKeyType="search"
              />
            </View>
          )}

          {/* New Chat Button */}
          <TouchableOpacity
            style={[
              styles.newChatBtn,
              { backgroundColor: colors.primary + "20" },
            ]}
            onPress={handleNewChat}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="plus-circle-outline"
              size={20}
              color={colors.primary}
            />
            <Text style={[styles.newChatText, { color: colors.text }]}>
              {t("newChat")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Chat List */}
        <FlatList
          data={filteredChats}
          renderItem={renderChatItem}
          keyExtractor={keyExtractor}
          style={styles.chatList}
          contentContainerStyle={styles.chatListContent}
          removeClippedSubviews={false}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={10}
          extraData={chats}
          showsVerticalScrollIndicator={false}
        />

        {/* User Profile Section */}
        <View style={styles.userSection}>
          {Platform.OS === "ios" ? (
            <BlurView
              intensity={80}
              tint={colors.background === "#000000" ? "dark" : "light"}
              style={[
                styles.userContainer,
                {
                  borderColor: colors.text + "15",
                },
              ]}
            >
              <View style={styles.userContent}>
                <View
                  style={[
                    styles.avatar,
                    {
                      backgroundColor: colors.primary + "30",
                      borderColor: colors.primary + "50",
                    },
                  ]}
                >
                  <Text style={[styles.avatarText, { color: colors.primary }]}>
                    {user?.email ? user.email[0].toUpperCase() : "?"}
                  </Text>
                </View>
                <View style={styles.userInfo}>
                  <Text
                    style={[styles.userEmail, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {user?.email ?? t("guest")}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleLogout}
                  activeOpacity={0.7}
                  style={styles.logoutBtn}
                >
                  <MaterialCommunityIcons
                    name="logout"
                    size={20}
                    color={colors.error}
                  />
                </TouchableOpacity>
              </View>
            </BlurView>
          ) : (
            <View
              style={[
                styles.userContainer,
                styles.androidGlass,
                {
                  backgroundColor: colors.background + "CC",
                  borderColor: colors.text + "15",
                },
              ]}
            >
              <View style={styles.userContent}>
                <View
                  style={[
                    styles.avatar,
                    {
                      backgroundColor: colors.primary + "30",
                      borderColor: colors.primary + "50",
                    },
                  ]}
                >
                  <Text style={[styles.avatarText, { color: colors.primary }]}>
                    {user?.email ? user.email[0].toUpperCase() : "?"}
                  </Text>
                </View>
                <View style={styles.userInfo}>
                  <Text
                    style={[styles.userEmail, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {user?.email ?? t("guest")}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleLogout}
                  activeOpacity={0.7}
                  style={styles.logoutBtn}
                >
                  <MaterialCommunityIcons
                    name="logout"
                    size={20}
                    color={colors.error}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: "100%",
    height: "100%",
    zIndex: 1000,
  },
  headerSection: {
    marginBottom: 15,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 15,
  },
  sidebarTitle: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.3,
    flex: 1,
    marginRight: 8,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    marginLeft: 8,
    flexShrink: 0,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 100,
    borderWidth: 1,
    marginBottom: 12,
    gap: 10,
    overflow: "hidden",
  },
  androidGlass: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    outlineWidth: 0,
  },
  newChatBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 100,
    gap: 8,
    marginBottom: 10,
  },
  newChatText: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  chatList: {
    flex: 1,
    marginBottom: 10,
  },
  chatListContent: {
    paddingBottom: 10,
  },
  glassContainer: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 6,
  },
  chatItemContainer: {
    overflow: "hidden",
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  activeChatItem: {
    backgroundColor: "transparent",
  },
  chatContent: {
    flex: 1,
    marginRight: 8,
  },
  chatTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
    letterSpacing: 0.1,
  },
  chatSubtitle: {
    fontSize: 13,
    opacity: 0.6,
  },
  deleteBtn: {
    padding: 8,
    borderRadius: 8,
  },
  userSection: {
    marginTop: 10,
  },
  userContainer: {
    borderRadius: 100,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 15,
  },
  userContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "700",
  },
  userInfo: {
    flex: 1,
  },
  userEmail: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
  logoutBtn: {
    padding: 8,
    borderRadius: 8,
  },
});

export default Sidebar;
