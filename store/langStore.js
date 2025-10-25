import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { en, ru, tk } from "../lib/lang";

const getDetectedLang = () => {
  try {
    const code = (Localization.locale ?? "en").split("-")[0].toLowerCase();
    return code === "ru" ? "ru" : code === "tk" ? "tk" : "en";
  } catch {
    return "en";
  }
};

export const useLangStore = create(
  persist(
    (set, get) => ({
      lang: getDetectedLang(),
      setLang: (lang) => set({ lang }),
      t: (key) => {
        const { lang } = get();
        const dict = lang === "ru" ? ru : lang === "tk" ? tk : en;
        return dict[key] ?? key;
      },
    }),
    {
      name: "lang-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
