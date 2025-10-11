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
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useTheme } from "@react-navigation/native";

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
}) => {
  const { colors } = useTheme();

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
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
  );

  return (
    <Animated.View
      style={[
        styles.sidebar,
        {
          transform: [{ translateX: slideValue }],
          backgroundColor: colors.background,
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
          onSubmitEditing={() => onSubmit(searchQ)}
          multiline
        />
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
        style={styles.chatList}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    top: 25,
    left: 0,
    bottom: 0,
    width: 300,
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
  chatItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
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
  searchInput: {
    flex: 1,
    borderRadius: 27.5,
    padding: 10,
    borderWidth: 1,
  },
});

export default Sidebar;
