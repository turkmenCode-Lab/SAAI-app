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
  LayoutAnimation,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "@react-navigation/native";
import { useAuthStore } from "../../store/authStore";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import { PanGestureHandler, State } from "react-native-gesture-handler";

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

  const user = useAuthStore((state) => state.user);

  const animationRefs = useRef(new Map()).current;

  const filteredChats = useMemo(() => {
    if (!searchQ?.trim()) return chats;
    const lowerSearch = searchQ.toLowerCase();
    return chats.filter((chat) =>
      chat.title.toLowerCase().includes(lowerSearch)
    );
  }, [chats, searchQ]);

  const renderChatItem = useCallback(
    ({ item, index }) => {
      if (!animationRefs.has(item.id)) {
        animationRefs.set(item.id, {
          opacity: new Animated.Value(1),
          height: new Animated.Value(60), // Initial height
        });
      }
      const animRefs = animationRefs.get(item.id);

      const handleDelete = async () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        Animated.parallel([
          Animated.timing(animRefs.opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(animRefs.height, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }),
        ]).start(() => {
          onDeleteChat(item.id);
          animationRefs.delete(item.id);
        });
      };

      const handleLoadChat = () => {
        try {
          onLoadChat(item.id);
          setSearchQ("");
        } catch (error) {
          console.error("Error loading chat:", error);
        }
      };

      const getLastMessageDate = () => {
        try {
          if (item.messages?.length > 0) {
            const timestamp = item.messages[item.messages.length - 1].timestamp;
            const date = new Date(timestamp);
            return isNaN(date.getTime()) ? "" : date.toLocaleDateString();
          }
          return "";
        } catch (error) {
          console.error("Error parsing date:", error);
          return "";
        }
      };

      return (
        <Animated.View
          style={[
            styles.chatItemContainer,
            {
              opacity: animRefs.opacity,
              height: animRefs.height,
              transform: [{ scaleX: animRefs.height }],
            },
          ]}
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            if (height > 0 && height !== 60) {
              animRefs.height.setValue(height);
            }
          }}
        >
          <TouchableOpacity
            style={[
              styles.chatItem,
              currentChatId === item.id && {
                backgroundColor: `${colors.primary}0F`,
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
                {item.title || "Untitled Chat"}
              </Text>
              <Text style={[styles.chatSubtitle, { color: colors.neutral }]}>
                {getLastMessageDate()}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.deleteBtn]}
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
    [currentChatId, colors, onLoadChat, onDeleteChat, setSearchQ]
  );

  const handleNewChat = useCallback(() => {
    try {
      onNewChat();
      setSearchQ("");
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  }, [onNewChat, setSearchQ]);

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
    // Clean up animation refs when chats change
    const currentIds = new Set(chats.map((chat) => chat.id));
    for (const [id] of animationRefs.entries()) {
      if (!currentIds.has(id)) {
        animationRefs.delete(id);
      }
    }
  }, [chats]);

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  const getItemLayout = useCallback(
    (data, index) => ({
      length: 60,
      offset: 60 * index,
      index,
    }),
    []
  );

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View
        style={[
          styles.sidebar,
          {
            backgroundColor: colors.background,
            transform: [{ translateX: slideValue }],
            zIndex: 1000,
            paddingTop: Platform.OS === "android" ? 40 : 60,
            paddingHorizontal: 15,
          },
        ]}
      >
        <Text
          style={[
            styles.sidebarTitle,
            { color: colors.text, textAlign: "center", marginVertical: 10 },
          ]}
        >
          Let's Dive into your history
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
                backgroundColor: colors.primary,
              },
            ]}
            autoCorrect={false}
            placeholder="Let's search your chat history!?"
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
          style={[styles.newChatBtn, { backgroundColor: `${colors.text}0A` }]}
          onPress={handleNewChat}
          activeOpacity={0.7}
        >
          <Text style={[styles.newChatText, { color: colors.text }]}>
            + New Chat
          </Text>
        </TouchableOpacity>
        <FlatList
          data={filteredChats}
          renderItem={renderChatItem}
          keyExtractor={keyExtractor}
          style={styles.chatList}
          getItemLayout={getItemLayout}
          removeClippedSubviews={false}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={10}
          extraData={chats}
        />
        <View
          style={[
            styles.sidebarUser,
            { borderTopColor: colors.border, marginBottom: 15 },
          ]}
        >
          <View
            style={{
              backgroundColor: colors.primary,
              borderRadius: 100,
              width: 44,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 3,
              borderColor: colors.accent,
            }}
          >
            <Text
              style={{
                color: getContrastColor(colors.primary),
                fontFamily: "InterSemiBold",
                fontSize: 24,
              }}
            >
              {user?.email ? user.email[0].toUpperCase() : "?"}
            </Text>
          </View>
          <Text
            style={{
              color: colors.text,
              fontFamily: "InterMedium",
              fontWeight: "500",
              fontSize: 18,
              flex: 1,
            }}
          >
            {user?.email ?? "Guest"}
          </Text>
          <TouchableOpacity
            style={{ marginLeft: "auto" }}
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
    padding: 15,
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
    gap: 5,
    outlineWidth: 0,
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
  chatItemContainer: {
    position: "relative",
    marginBottom: 4,
    overflow: "hidden",
  },
  chatItem: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  chatContent: {
    flex: 1,
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
  deleteBtn: {
    position: "absolute",
    right: 8,
    top: 12,
    padding: 4,
    borderRadius: 4,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    borderRadius: 27.5,
    padding: 10,
    borderWidth: 1,
  },
  sidebarUser: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },
});

const getContrastColor = (bgColor) => {
  const hex = bgColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
};

export default Sidebar;
