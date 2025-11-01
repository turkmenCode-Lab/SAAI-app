import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useThemeStore = create((set, get) => ({
  darkMode: false,
  accentColor: "mostly",
  language: "en",

  setDarkMode: (value) => {
    set({ darkMode: value });
    get().saveSettings();
  },

  setAccentColor: (value) => {
    set({ accentColor: value });
    get().saveSettings();
  },

  setLanguage: (value) => {
    set({ language: value });
    get().saveSettings();
  },

  getStoredSettings: async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("appSettings");
      if (jsonValue != null) {
        const settings = JSON.parse(jsonValue);
        set((state) => ({ ...state, ...settings }));
        return settings;
      }
    } catch (e) {
      console.warn("Failed to load theme settings:", e);
    }
    return get();
  },

  saveSettings: async () => {
    const state = get();
    const settings = {
      darkMode: state.darkMode,
      language: state.language,
      accentColor: state.accentColor,
    };
    try {
      await AsyncStorage.setItem("appSettings", JSON.stringify(settings));
    } catch (e) {
      console.warn("Failed to save theme settings:", e);
    }
  },

  reset: () => {
    set({ darkMode: false, accentColor: "mostly", language: "en" });
    get().saveSettings();
  },
}));

export { useThemeStore };
