import { DefaultTheme, DarkTheme } from "@react-navigation/native";
import { useColorScheme } from "react-native";

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    background: "#FFFFFF",
    text: "#000000",
    primary: "#f2f2f2",
    secondary: "#4C2C92",
    mostly: "#2d72e2ff",
    vitally: "#8A4FFF",
    principally: "#ffb464",
    neutral: "#888888",
    success: "#4BB543",
    error: "#FF3333",
  },
  fonts: {
    regular: "InterRegular",
    medium: "InterMedium",
    semibold: "InterSemiBold",
    bold: "InterBold",
  },
};

export const darkTheme = {
  ...DarkTheme,
  colors: {
    background: "#000000",
    text: "#FFFFFF",
    primary: "#333333",
    secondary: "#4C2C92",
    mostly: "#2d72e2ff",
    vitally: "#D4A4FF",
    principally: "#ffb464",
    neutral: "#f2f2f2",
    success: "#4BB543",
    error: "#FF3333",
  },
  fonts: {
    regular: "InterRegular",
    medium: "InterMedium",
    semibold: "InterSemiBold",
    bold: "InterBold",
  },
};

export const useAppTheme = () => {
  const scheme = useColorScheme();
  return scheme === "dark" ? darkTheme : lightTheme;
};
