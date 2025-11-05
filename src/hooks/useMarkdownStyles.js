import { StyleSheet } from "react-native";
import { useMemo } from "react";
import { useAppTheme } from "../theme";

const useMarkdownStyles = () => {
  const theme = useAppTheme();
  const { colors } = theme;
  const isDark = colors.text === "#FFFFFF";
  const accentColorValue = colors.accent;

  const codeBg = isDark ? "#1e1e1e" : "#f6f8fa";
  const codeColor = isDark ? colors.text : "#24292e";

  return useMemo(
    () =>
      StyleSheet.create({
        body: {
          fontSize: 16,
          lineHeight: 24,
          color: colors.text,
          fontFamily: theme.fonts.regular,
        },
        strong: {
          fontWeight: "bold",
          color: colors.text,
        },
        em: {
          fontStyle: "italic",
          color: colors.text,
        },
        code_inline: {
          backgroundColor: codeBg,
          color: codeColor,
          paddingHorizontal: 6,
          paddingVertical: 2,
          borderRadius: 4,
          fontFamily: "monospace",
          fontWeight: "600",
          borderWidth: 1,
          borderColor: isDark ? colors.neutral : colors.neutral,
        },
        code_block: {
          backgroundColor: codeBg,
          color: codeColor,
          padding: 16,
          borderRadius: 8,
          fontFamily: "monospace",
          fontSize: 14,
          lineHeight: 20,
          marginVertical: 12,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: "hidden",
        },
        fence: {
          fontSize: 12,
          marginBottom: 8,
          fontFamily: "monospace",
          color: isDark ? colors.neutral : colors.neutral,
          backgroundColor: isDark
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.05)",
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 4,
          alignSelf: "flex-start",
        },
        heading1: {
          fontSize: 28,
          fontWeight: "bold",
          color: colors.text,
          marginVertical: 16,
          marginBottom: 12,
          fontFamily: theme.fonts.bold,
          borderBottomWidth: 2,
          borderBottomColor: accentColorValue,
          paddingBottom: 4,
        },
        heading2: {
          fontSize: 24,
          fontWeight: "700",
          color: colors.text,
          marginVertical: 12,
          marginBottom: 8,
          fontFamily: theme.fonts.semibold,
        },
        heading3: {
          fontSize: 20,
          fontWeight: "600",
          color: colors.text,
          marginVertical: 10,
          marginBottom: 6,
          fontFamily: theme.fonts.semibold,
        },
        heading4: {
          fontSize: 18,
          fontWeight: "600",
          color: colors.text,
          marginVertical: 8,
          marginBottom: 4,
          fontFamily: theme.fonts.medium,
        },
        heading5: {
          fontSize: 16,
          fontWeight: "600",
          color: colors.text,
          marginVertical: 6,
          fontFamily: theme.fonts.medium,
        },
        heading6: {
          fontSize: 14,
          fontWeight: "600",
          color: colors.text,
          marginVertical: 4,
          fontFamily: theme.fonts.medium,
        },
        bullet_list: {
          marginLeft: 6,
          marginVertical: 8,
          paddingLeft: 0,
        },
        ordered_list: {
          marginLeft: 6,
          marginVertical: 8,
          paddingLeft: 0,
        },
        list_item: {
          color: colors.text,
          marginVertical: 2,
          fontFamily: theme.fonts.regular,
          marginLeft: 2,
          paddingLeft: 2,
        },
        blockquote: {
          borderLeftWidth: 4,
          borderLeftColor: accentColorValue,
          paddingLeft: 16,
          paddingVertical: 6,
          marginVertical: 8,
          backgroundColor: isDark ? colors.primary : colors.primary,
          fontStyle: "italic",
          color: colors.text,
          borderRadius: 4,
          shadowColor: isDark ? colors.neutral : "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 1,
        },
        link: {
          color: accentColorValue,
          textDecorationLine: "underline",
          fontWeight: "500",
        },
        table: {
          borderWidth: 1,
          borderColor: colors.border,
          marginVertical: 10,
          borderRadius: 8,
          overflow: "hidden",
          backgroundColor: isDark ? colors.primary : colors.primary,
        },
        table_cell: {
          padding: 12,
          borderWidth: 1,
          borderColor: colors.border,
          color: colors.text,
          fontFamily: theme.fonts.regular,
        },
        table_head: {
          backgroundColor: accentColorValue,
          color: getContrastColor(accentColorValue),
          fontWeight: "bold",
        },
        paragraph: {
          marginVertical: 6,
          color: colors.text,
          fontFamily: theme.fonts.regular,
        },
        hr: {
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          marginVertical: 20,
          opacity: 0.5,
        },
        image: {
          borderRadius: 8,
          marginVertical: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        },
        inlineCode: {
          ...StyleSheet.absoluteFillObject,
        },
      }),
    [colors, isDark, accentColorValue, theme.fonts, codeBg, codeColor]
  );
};

const getContrastColor = (bgColor) => {
  const hex = bgColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
};

export default useMarkdownStyles;
