import { DefaultTheme, DarkTheme } from "@react-navigation/native";
import { useColorScheme } from "react-native";

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    background: "#FFFFFF",
    text: "#000000",
    primary: "#f2f2f2",
    secondary: "#4C2C92",
    vitally: "#8A4FFF",
    principally: "#ffb464",
  },
};

export const darkTheme = {
  ...DarkTheme,
  colors: {
    background: "#000000",
    text: "#FFFFFF",
    primary: "#333333",
    secondary: "#4C2C92",
    vitally: "#D4A4FF",
    principally: "#ffb464",
  },
};

export const useAppTheme = () => {
  const scheme = useColorScheme();
  return scheme === "dark" ? darkTheme : lightTheme;
};
