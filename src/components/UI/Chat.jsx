import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
} from "react-native";
import { useThemeStore } from "../../../store/themeStore";
import * as Clipboard from "expo-clipboard";
import Feather from "@expo/vector-icons/Feather";
import Markdown from "react-native-markdown-display";
import useMarkdownStyles from "../../hooks/useMarkdownStyles";
import { useTranslations } from "../../utils/translations";

// --- NEW IMPORTS ---
// Added the syntax highlighter and the themes we'll use
import SyntaxHighlighter from "react-native-syntax-highlighter";
import {
  atomOneDark,
  atomOneLight,
} from "react-native-syntax-highlighter/dist/styles/prism";
// --------------------

const getContrastColor = (bgColor) => {
  const hex = bgColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
};

const DUMMY_RECOMMENDATIONS = ["quantum", "gamePython", "quote"];

const TypingIndicator = ({ colors, accentColorValue }) => {
  const [dots, setDots] = useState([0, 0, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        const newDots = [...prev];
        newDots[0] = newDots[0] === 1 ? 0 : 1;
        newDots[1] = newDots[1] === 1 ? 0 : 1;
        newDots[2] = newDots[2] === 1 ? 0 : 1;
        return newDots;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.typingContainer}>
      {dots.map((scale, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: accentColorValue,
              opacity: scale,
            },
          ]}
        />
      ))}
    </View>
  );
};

const MessageBubble = ({ item, colors, accentColorValue, showToast, t }) => {
  const isUser = item.role === "user";
  const isDark = colors.text === "#FFFFFF";
  const opacity = useRef(new Animated.Value(0)).current;
  const slideX = useRef(new Animated.Value(isUser ? 50 : -50)).current;

  const userTextColor = getContrastColor(accentColorValue);

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(item.text);
      if (showToast) {
        showToast(t("copiedToClipboard"), "success");
      }
      console.log("Message copied to clipboard");
    } catch (error) {
      console.error("Failed to copy text:", error);
      if (showToast) {
        showToast(t("failedCopy"), "error");
      }
    }
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideX, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const markdownStyles = useMarkdownStyles();

  const bubbleBgColor = isUser ? accentColorValue : colors.primary;
  const bubbleTextColor = isUser ? userTextColor : colors.text;
  const copyButtonBgColor = colors.primary;
  const copyButtonBorderColor = colors.border;
  const copyButtonBorderWidth = isDark ? 0 : 1;

  return (
    <Animated.View
      style={[
        styles.messageContainer,
        {
          alignSelf: isUser ? "flex-end" : "flex-start",
          opacity,
          transform: [{ translateX: slideX }],
        },
      ]}
    >
      <View
        style={[
          styles.bubbleWrapper,
          {
            alignItems: isUser ? "flex-end" : "flex-start",
          },
        ]}
      >
        <View
          style={[
            styles.bubble,
            {
              backgroundColor: bubbleBgColor,
              minHeight: 20,
              borderBottomRightRadius: isUser ? 0 : 15,
              borderBottomLeftRadius: isUser ? 15 : 0,
            },
          ]}
        >
          {isUser ? (
            <Text
              style={[
                styles.bubbleText,
                {
                  color: bubbleTextColor,
                },
              ]}
            >
              {item.text}
            </Text>
          ) : (
            <Markdown
              style={markdownStyles}
              rules={{
                // --- THIS IS THE MODIFIED SECTION ---
                code_block: (node, children, parent, styles) => {
                  // 1. Select the correct syntax theme
                  const syntaxTheme = isDark ? atomOneDark : atomOneLight;

                  // 2. Get code string and language
                  const codeString = String(node.content).replace(/\n$/, "");
                  const language = node.lang || "plaintext";

                  // 3. This is the style for the <SyntaxHighlighter> component
                  // It ensures it fits *inside* your container style
                  const highlighterCustomStyle = {
                    backgroundColor: "transparent", // Use container's background
                    padding: 0, // Container already has padding
                    margin: 0,
                    fontFamily: "monospace", // Base font
                    fontSize: 14,
                  };

                  return (
                    // 1. Use the code_block style from your hook as the main container
                    // This gives it the correct padding, background, border, etc.
                    <View key={node.key} style={markdownStyles.code_block}>
                      // 2. The themed copy button, positioned absolutely
                      <TouchableOpacity
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          backgroundColor: isDark
                            ? "rgba(255,255,255,0.2)"
                            : "rgba(0,0,0,0.1)",
                          padding: 6,
                          borderRadius: 6,
                          zIndex: 1,
                        }}
                        onPress={async () => {
                          try {
                            await Clipboard.setStringAsync(node.content);
                            if (showToast) {
                              showToast(t("codeCopied"), "success");
                            }
                          } catch (error) {
                            console.error("Failed to copy code:", error);
                            if (showToast) {
                              showToast(t("failedCopyCode"), "error");
                            }
                          }
                        }}
                      >
                        <Feather name="copy" size={16} color={colors.text} />
                      </TouchableOpacity>
                      // 3. The language "fence" (e.g., "javascript")
                      {node.lang && (
                        <Text
                          style={[
                            styles.fence, // Uses the local StyleSheet
                            {
                              color: colors.neutral,
                              backgroundColor: isDark
                                ? "rgba(255,255,255,0.1)"
                                : "rgba(0,0,0,0.05)",
                            },
                          ]}
                        >
                          {node.lang}
                        </Text>
                      )}
                      // 4. The Syntax Highlighter
                      <SyntaxHighlighter
                        style={syntaxTheme}
                        language={language}
                        customStyle={highlighterCustomStyle}
                        CodeTag={() => null} // Prevent extra <Code> wrapper
                        PreTag={() => null} // Prevent extra <Pre> wrapper
                        highlighter={"prism"}
                      >
                        {codeString}
                      </SyntaxHighlighter>
                    </View>
                  );
                },
                // --- END OF MODIFIED SECTION ---
                table_head: (node, children, parent, styles) => (
                  <View style={styles.tableHead}>{children}</View>
                ),
                table_cell: (node, children, parent, styles) => {
                  const isHead = parent?.type === "table_head";
                  return (
                    <View
                      key={node.key}
                      style={[styles.tableCell, isHead && styles.tableHeadCell]}
                    >
                      {children}
                    </View>
                  );
                },
              }}
            >
              {item.text}
            </Markdown>
          )}
        </View>
        <TouchableOpacity
          style={[
            styles.copyButton,
            {
              backgroundColor: copyButtonBgColor,
              borderColor: copyButtonBorderColor,
              borderWidth: copyButtonBorderWidth,
            },
          ]}
          onPress={handleCopy}
          activeOpacity={0.7}
        >
          <Feather name="copy" size={14} color={colors.text} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const Chat = ({
  chats,
  currentChatId,
  setChats,
  colors,
  scrollRef,
  isLoading,
  showToast,
  onQuickPromptPress,
}) => {
  const { accentColor } = useThemeStore();
  const t = useTranslations();

  const messages = useMemo(
    () => chats.find((chat) => chat.id === currentChatId)?.messages || [],
    [chats, currentChatId]
  );

  const accentColorValue = useMemo(
    () => colors[accentColor] || accentColor,
    [colors, accentColor]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 150);
    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  return (
    <ScrollView
      style={styles.chatContainer}
      contentContainerStyle={[
        styles.chatContent,
        { justifyContent: messages.length === 0 ? "center" : "flex-end" },
      ]}
      ref={scrollRef}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {messages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.greeting, { color: colors.text }]}>
            {t("howHelp")}
          </Text>
          <View style={styles.quickPrompts}>
            {DUMMY_RECOMMENDATIONS.map((key, index) => (
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.quickPrompt,
                  {
                    backgroundColor: colors.primary,
                    borderColor: accentColorValue,
                  },
                ]}
                key={key}
                onPress={() => onQuickPromptPress?.(t(key))}
              >
                <Text style={{ color: colors.text }}>{t(key)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        messages.map((item, index) => (
          <MessageBubble
            key={item.id || index}
            item={item}
            colors={colors}
            accentColorValue={accentColorValue}
            showToast={showToast}
            t={t}
          />
        ))
      )}
      {isLoading && (
        <TypingIndicator colors={colors} accentColorValue={accentColorValue} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  chatContainer: { flex: 1 },
  chatContent: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  greeting: {
    alignSelf: "center",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
    padding: 20,
    marginBottom: 32,
    fontFamily: "InterSemiBold",
  },
  messageContainer: {
    marginVertical: 6,
    maxWidth: "92.5%",
  },
  bubbleWrapper: {
    flexDirection: "column",
  },
  bubble: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 18,
  },
  bubbleText: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "InterRegular",
  },
  copyButton: {
    marginTop: 6,
    padding: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
    minWidth: 32,
    alignItems: "center",
  },
  typingContainer: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
    borderRadius: 18,
    maxWidth: "85%",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  quickPrompts: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  quickPrompt: {
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    minWidth: 120,
    alignItems: "center",
  },
  // This style is not used by the new highlighter,
  // but I'll leave it in case other code uses it.
  codeBlockWrapper: {
    marginTop: 8,
  },
  fence: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 8,
    fontFamily: "monospace",
  },
  // This is no longer used for code blocks,
  // as the highlighter component handles its own text styling.
  code_block: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: "monospace",
  },
  tableHead: {
    backgroundColor: "transparent",
  },
  tableCell: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  tableHeadCell: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
});

export default Chat;
