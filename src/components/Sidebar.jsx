import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
  TextInput,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "@react-navigation/native";
import { useAuthStore } from "../../store/authStore";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, Platform } from "react-native";

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

  const renderChatItem = ({ item }) => (
    <View style={styles.chatItemContainer}>
      <TouchableOpacity
        style={[
          styles.chatItem,
          currentChatId === item.id && {
            backgroundColor: colors.primary + "0F",
          },
        ]}
        onPress={() => onLoadChat(item.id)}
      >
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
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => onDeleteChat(item.id)}
      >
        <MaterialCommunityIcons
          name="delete"
          size={20}
          color={colors.danger || "#FF3B30"}
        />
      </TouchableOpacity>
    </View>
  );

  const handleLogout = () => {
    try {
      useAuthStore.getState().logout();
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          backgroundColor: colors.background,
          transform: [{ translateX: slideValue }],
          zIndex: 1000,
          paddingTop: Platform.OS === "android" ? 40 : 60,
          paddingHorizontal: 15,
        },
      ]}
    >
      <View
        style={[
          styles.sidebarHeader,
          { borderBottomColor: colors.text + "33" },
        ]}
      >
        <TextInput
          style={[
            styles.searchInput,
            {
              color: colors.text,
              borderColor: colors.text,
            },
          ]}
          autoCorrect={false}
          placeholder="Let's search your chat history!?"
          placeholderTextColor={colors.text}
          autoCapitalize="none"
          value={searchQ}
          onChangeText={setSearchQ}
          onSubmitEditing={() => onSubmit && onSubmit(searchQ)}
        />
        <TouchableOpacity onPress={onClose}>
          <MaterialCommunityIcons
            name="backburger"
            size={30}
            color={colors.neutral}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.newChatBtn, { backgroundColor: colors.text + "0A" }]}
        onPress={onNewChat}
      >
        <Text style={[styles.newChatText, { color: colors.text }]}>
          New Chat
        </Text>
      </TouchableOpacity>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id.toString()}
        style={[styles.chatList, { color: colors.text }]}
      />
      <View
        style={[
          styles.sidebarUser,
          { borderTopColor: colors.neutral, marginBottom: 15 },
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
            borderColor: colors.mostly,
          }}
        >
          <Text
            style={{
              color: colors.text,
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
            fontWeight: 500,
            fontSize: 18,
          }}
        >
          {user?.email ?? "Guest"}
        </Text>
        <TouchableOpacity style={{ marginLeft: "auto" }} onPress={handleLogout}>
          <Entypo name="log-out" size={24} color={colors.neutral} />
        </TouchableOpacity>
      </View>
    </Animated.View>
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
  },
  chatItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
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

export default Sidebar;
