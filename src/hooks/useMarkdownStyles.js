import { StyleSheet } from "react-native";
import { useMemo } from "react";
import { useAppTheme } from "../theme";

const useMarkdownStyles = () => {
  const theme = useAppTheme();
  const { colors } = theme;
  const isDark = colors.text === "#FFFFFF";
  const accentColorValue = colors.accent;

  const codeBg = isDark ? "#1E1E1E" : "#F6F8FA";
  const codeColor = isDark ? "#DCDCDC" : "#24292E";
  const quoteBg = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)";
  const tableBg = isDark ? "rgba(255,255,255,0.03)" : "#FAFAFA";
  const subtleBorder = isDark ? "#333" : "#DDD";

  return useMemo(
    () =>
      StyleSheet.create({
        body: {
          fontSize: 14,
          lineHeight: 22,
          color: colors.text,
          fontFamily: theme.fonts.regular,
          paddingHorizontal: 0,
          marginHorizontal: 0,
        },

        paragraph: {
          marginVertical: 6,
          color: colors.text,
          fontFamily: theme.fonts.regular,
        },

        strong: {
          fontWeight: "700",
          color: colors.text,
        },

        em: {
          fontStyle: "italic",
          color: colors.text,
        },

        link: {
          color: accentColorValue,
          textDecorationLine: "underline",
          fontWeight: "600",
        },

        code_inline: {
          backgroundColor: codeBg,
          color: codeColor,
          paddingHorizontal: 5,
          paddingVertical: 2,
          borderRadius: 4,
          fontFamily: "monospace",
          borderWidth: 1,
          borderColor: subtleBorder,
          fontSize: 13,
        },

        code_block: {
          backgroundColor: codeBg,
          color: codeColor,
          padding: 10,
          borderRadius: 6,
          fontFamily: "monospace",
          fontSize: 13,
          lineHeight: 19,
          marginVertical: 8,
          borderWidth: 1,
          borderColor: subtleBorder,
        },

        heading1: {
          fontSize: 22,
          fontWeight: "700",
          color: accentColorValue,
          marginVertical: 12,
          fontFamily: theme.fonts.bold,
          borderBottomWidth: 1.5,
          borderBottomColor: accentColorValue,
          paddingBottom: 3,
        },

        heading2: {
          fontSize: 20,
          fontWeight: "600",
          color: accentColorValue,
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
          color: colors.text,
          fontWeight: "600",
          marginVertical: 6,
          fontFamily: theme.fonts.medium,
        },

        bullet_list: {
          marginLeft: 4, // minimal left indent
          marginVertical: 4,
          paddingLeft: 0,
        },

        ordered_list: {
          marginLeft: 4,
          marginVertical: 4,
          paddingLeft: 0,
        },

        list_item: {
          color: colors.text,
          marginVertical: 2,
          fontFamily: theme.fonts.regular,
          fontSize: 14,
          paddingLeft: 2,
        },

        blockquote: {
          borderLeftWidth: 3,
          borderLeftColor: accentColorValue,
          backgroundColor: quoteBg,
          paddingLeft: 10, // tighter left space
          paddingVertical: 6,
          marginVertical: 8,
          borderRadius: 5,
          fontStyle: "italic",
          color: colors.text,
        },

        table: {
          borderWidth: 1,
          borderColor: subtleBorder,
          marginVertical: 8,
          borderRadius: 5,
          overflow: "hidden",
          backgroundColor: tableBg,
        },

        table_cell: {
          paddingVertical: 6,
          paddingHorizontal: 8,
          borderWidth: 1,
          borderColor: subtleBorder,
          color: colors.text,
          fontFamily: theme.fonts.regular,
          fontSize: 13,
        },

        table_head: {
          backgroundColor: accentColorValue,
          color: getContrastColor(accentColorValue),
          fontWeight: "700",
        },

        hr: {
          borderBottomWidth: 1,
          borderBottomColor: subtleBorder,
          marginVertical: 12,
          opacity: 0.6,
        },

        image: {
          borderRadius: 8,
          marginVertical: 6,
          shadowColor: isDark ? "#000" : "#999",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.15,
          shadowRadius: 2,
          elevation: 2,
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
