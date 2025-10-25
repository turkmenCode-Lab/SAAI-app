import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { en, ru, tk } from "../lib/lang";

const getDetectedLang = () => {
  try {
    const locale = Localization.locale;
    const langCode = locale.split("-")[0].toLowerCase();
    if (langCode === "ru") return "ru";
    if (langCode === "tk") return "tk";
    return "en";
  } catch {
    return "en";
  }
};

export const useLangStore = create(
  persist(
    (set, get) => ({
      lang: getDetectedLang(),
      setLang: (newLang) => set({ lang: newLang }),
      t: (key) => {
        const { lang } = get();
        const dict = lang === "ru" ? ru : lang === "tk" ? tk : en;
        return dict[key] || key;
      },
    }),
    {
      name: "lang-storage",
      getStorage: () => AsyncStorage,
    }
  )
);
