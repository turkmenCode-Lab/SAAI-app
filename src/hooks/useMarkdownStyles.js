import { StyleSheet } from "react-native";
import { useMemo } from "react";
import { useAppTheme } from "../theme";

const useMarkdownStyles = () => {
  const theme = useAppTheme();
  const { colors, isDark } = theme;
  const accentColorValue = colors.accent;

  return useMemo(
    () =>
      StyleSheet.create({
        body: {
          fontSize: 16,
          lineHeight: 22,
          color: colors.text,
          fontFamily: theme.fonts.regular,
        },
        // Emphasis
        strong: {
          fontWeight: "bold",
          color: colors.text,
        },
        em: {
          fontStyle: "italic",
          color: colors.text,
        },
        // Code Inline
        code_inline: {
          backgroundColor: isDark ? colors.primary : colors.primary,
          color: colors.error, // Use error for consistent red accent in light; adjust if needed
          paddingHorizontal: 4,
          paddingVertical: 2,
          borderRadius: 4,
          fontFamily: "monospace", // Use system monospace for better mobile perf
          fontWeight: "600",
        },
        // Code Block
        code_block: {
          backgroundColor: isDark ? "#1e1e1e" : "#f6f8fa", // Keep GitHub-inspired for readability
          color: isDark ? colors.text : "#24292e",
          padding: 12, // Slightly reduced for mobile minimalism
          borderRadius: 6,
          fontFamily: "monospace",
          fontSize: 14,
          lineHeight: 20,
          marginVertical: 8, // Reduced margins for tighter mobile layout
          borderWidth: 1,
          borderColor: colors.border,
          overflow: "hidden",
        },
        // Language tag (optional)
        fence: {
          color: colors.neutral,
          fontSize: 12,
          marginBottom: 4, // Reduced for minimalism
          fontFamily: "monospace",
        },
        // Headings - Enhanced with h3 and h4 for completeness
        heading1: {
          fontSize: 24, // Slightly larger for mobile hierarchy
          fontWeight: "bold",
          color: colors.text,
          marginVertical: 12,
          fontFamily: theme.fonts.bold,
        },
        heading2: {
          fontSize: 20,
          fontWeight: "600",
          color: colors.text,
          marginVertical: 10,
          fontFamily: theme.fonts.semibold,
        },
        heading3: {
          fontSize: 18,
          fontWeight: "600",
          color: colors.text,
          marginVertical: 8,
          fontFamily: theme.fonts.semibold,
        },
        heading4: {
          fontSize: 16,
          fontWeight: "600",
          color: colors.text,
          marginVertical: 6,
          fontFamily: theme.fonts.medium,
        },
        // Lists - Minimal padding
        bullet_list: { marginLeft: 16, marginVertical: 4 },
        ordered_list: { marginLeft: 16, marginVertical: 4 },
        list_item: {
          color: colors.text,
          marginVertical: 2,
          fontFamily: theme.fonts.regular,
        },
        // Blockquote - Use accent for border, subtle bg
        blockquote: {
          borderLeftWidth: 3, // Slightly thinner for minimalism
          borderLeftColor: accentColorValue,
          paddingLeft: 12,
          marginVertical: 8,
          backgroundColor: isDark
            ? "rgba(255,255,255,0.05)"
            : "rgba(0,0,0,0.03)",
          fontStyle: "italic",
        },
        // Links - Use accent color
        link: {
          color: accentColorValue,
          textDecorationLine: "underline",
        },
        // Table - Simplified borders
        table: {
          borderWidth: 1,
          borderColor: colors.border,
          marginVertical: 8,
          borderRadius: 4, // Subtle rounding
        },
        table_cell: {
          padding: 6, // Reduced for mobile
          borderWidth: 1,
          borderColor: colors.border,
          color: colors.text,
        },
        // Paragraph - Tight spacing
        paragraph: { marginVertical: 4, color: colors.text },
        // HR - Simple divider
        hr: {
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          marginVertical: 12,
        },
      }),
    [colors, isDark, accentColorValue, theme.fonts]
  );
};

export default useMarkdownStyles;
