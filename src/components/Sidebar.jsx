import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
  TextInput,
  BackHandler,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "@react-navigation/native";
import { useAuthStore } from "../../store/authStore";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { useThemeStore } from "../../store/themeStore";
import { useTranslations } from "../utils/translations";

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
  const insets = useSafeAreaInsets();

  const user = useAuthStore((state) => state.user);

  const animationRefs = useRef(new Map());
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Fade in animation when sidebar opens
  useEffect(() => {
    if (isOpen) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [isOpen, fadeAnim]);

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
          scale: new Animated.Value(1),
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
            Animated.timing(animRefs.scale, {
              toValue: 0.8,
              duration: 300,
              useNativeDriver: true,
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
          // Scale animation on press
          Animated.sequence([
            Animated.timing(animRefs.scale, {
              toValue: 0.95,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(animRefs.scale, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
          ]).start();

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

      return (
        <Animated.View
          style={[
            styles.chatItemContainer,
            {
              opacity: animRefs?.opacity || 1,
              height: animRefs?.height || 60,
              transform: [{ scale: animRefs?.scale || 1 }],
            },
          ]}
          onLayout={handleLayout}
        >
          <TouchableOpacity
            style={[
              styles.chatItem,
              currentChatId === itemId && {
                backgroundColor: `${colors.primary}15`,
                borderLeftWidth: 3,
                borderLeftColor: colors.primary,
              },
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
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="delete"
              size={20}
              color={colors.error}
            />
          </TouchableOpacity>
        </Animated.View>
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
            opacity: fadeAnim,
            paddingTop: insets.top + 15,
            paddingBottom: insets.bottom,
            paddingHorizontal: 15,
          },
        ]}
      >
        <Text style={[styles.sidebarTitle, { color: colors.text }]}>
          {t("diveHistory")}
        </Text>
        <View
          style={[styles.sidebarHeader, { borderBottomColor: colors.border }]}
        >
          <TextInput
            style={[
              styles.searchInput,
              {
                color: colors.text,
                borderColor: colors.border,
                backgroundColor: `${colors.primary}10`,
              },
            ]}
            autoCorrect={false}
            placeholder={t("searchHistory")}
            placeholderTextColor={colors.neutral}
            autoCapitalize="none"
            value={searchQ}
            onChangeText={setSearchQ}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <MaterialCommunityIcons
              name="backburger"
              size={30}
              color={colors.neutral}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[
            styles.newChatBtn,
            { backgroundColor: `${colors.primary}15` },
          ]}
          onPress={handleNewChat}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="plus"
            size={20}
            color={colors.text}
            style={styles.newChatIcon}
          />
          <Text style={[styles.newChatText, { color: colors.text }]}>
            {t("newChat")}
          </Text>
        </TouchableOpacity>
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
          extraData={currentChatId}
          showsVerticalScrollIndicator={false}
        />
        <View style={[styles.sidebarUser, { borderTopColor: colors.border }]}>
          <View
            style={[
              styles.userAvatar,
              {
                backgroundColor: colors.primary,
                borderColor: colors.accent,
              },
            ]}
          >
            <Text
              style={[
                styles.userAvatarText,
                {
                  color: getContrastColor(colors.primary),
                },
              ]}
            >
              {user?.email ? user.email[0].toUpperCase() : "?"}
            </Text>
          </View>
          <Text
            style={[styles.userEmail, { color: colors.text }]}
            numberOfLines={1}
          >
            {user?.email ?? t("guest")}
          </Text>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Entypo name="log-out" size={24} color={colors.neutral} />
          </TouchableOpacity>
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
    overflow: "hidden",
  },
  sidebarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 15,
    borderBottomWidth: 1,
    marginBottom: 15,
    gap: 10,
  },
  sidebarTitle: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 10,
    marginBottom: 15,
  },
  newChatBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 15,
  },
  newChatIcon: {
    marginRight: 8,
  },
  newChatText: {
    fontSize: 16,
    fontWeight: "600",
  },
  chatList: {
    flex: 1,
  },
  chatListContent: {
    paddingBottom: 15,
  },
  chatItemContainer: {
    position: "relative",
    marginBottom: 6,
    overflow: "hidden",
  },
  chatItem: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingRight: 45,
    borderRadius: 10,
  },
  chatContent: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  chatSubtitle: {
    fontSize: 13,
    opacity: 0.7,
  },
  deleteBtn: {
    position: "absolute",
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    padding: 8,
    borderRadius: 6,
    zIndex: 2,
  },
  searchInput: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    fontSize: 15,
  },
  sidebarUser: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 15,
    paddingTop: 15,
    borderTopWidth: 1,
  },
  userAvatar: {
    borderRadius: 100,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
  },
  userAvatarText: {
    fontFamily: "InterSemiBold",
    fontSize: 20,
    fontWeight: "700",
  },
  userEmail: {
    fontFamily: "InterMedium",
    fontWeight: "600",
    fontSize: 16,
    flex: 1,
  },
  logoutBtn: {
    padding: 4,
  },
});

const getContrastColor = (bgColor) => {
  if (!bgColor || typeof bgColor !== "string") return "#FFFFFF";
  const hex = bgColor.replace("#", "");
  if (hex.length !== 6) return "#FFFFFF";

  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
};

export default Sidebar;
