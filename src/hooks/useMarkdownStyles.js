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
          lineHeight: 16,
          color: colors.text,
          fontFamily: theme.fonts.regular,
          color: colors.mostly,
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
          paddingHorizontal: 4,
          paddingVertical: 2,
          borderRadius: 4,
          fontFamily: "monospace",
          fontWeight: "600",
        },
        code_block: {
          backgroundColor: codeBg,
          color: codeColor,
          padding: 12,
          borderRadius: 6,
          fontFamily: "monospace",
          fontSize: 14,
          lineHeight: 20,
          marginVertical: 8,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: "hidden",
        },
        fence: {
          fontSize: 12,
          marginBottom: 4,
          fontFamily: "monospace",
        },
        heading1: {
          fontSize: 24,
          fontWeight: "bold",
          color: colors.text,
          marginVertical: 10,
          fontFamily: theme.fonts.bold,
        },
        heading2: {
          fontSize: 20,
          fontWeight: "600",
          color: colors.text,
          marginVertical: 8,
          fontFamily: theme.fonts.semibold,
        },
        heading3: {
          fontSize: 18,
          fontWeight: "600",
          color: colors.text,
          marginVertical: 7,
          fontFamily: theme.fonts.semibold,
        },
        heading4: {
          fontSize: 16,
          fontWeight: "600",
          color: colors.text,
          marginVertical: 4,
          fontFamily: theme.fonts.medium,
        },
        bullet_list: { marginLeft: 8, marginVertical: 3 },
        ordered_list: { marginLeft: 8, marginVertical: 3 },
        list_item: {
          color: colors.text,
          marginVertical: 2,
          fontFamily: theme.fonts.regular,
        },
        blockquote: {
          borderLeftWidth: 3,
          borderLeftColor: accentColorValue,
          paddingLeft: 10,
          marginVertical: 6,
          backgroundColor: isDark
            ? "rgba(255,255,255,0.05)"
            : "rgba(0,0,0,0.03)",
          fontStyle: "italic",
          color: colors.text,
        },
        link: {
          color: accentColorValue,
          textDecorationLine: "underline",
        },
        table: {
          borderWidth: 1,
          borderColor: colors.border,
          marginVertical: 8,
          borderRadius: 4,
        },
        table_cell: {
          padding: 6,
          borderWidth: 1,
          borderColor: colors.border,
          color: colors.text,
        },
        paragraph: { marginVertical: 4, color: colors.text },
        hr: {
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          marginVertical: 12,
        },
      }),
    [colors, isDark, accentColorValue, theme.fonts, codeBg, codeColor]
  );
};

export default useMarkdownStyles;
