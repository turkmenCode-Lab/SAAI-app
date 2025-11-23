import { create } from "zustand";
import axios from "axios";
import { EXPO_API_URI } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      register: async (email, password) => {
        set({ loading: true, error: null });

        try {
          const res = await axios.post(`${EXPO_API_URI}/auth/register`, {
            email,
            password,
          });

          set({
            user: res.data.user,
            token: res.data.token,
            loading: false,
          });

          return res.data;
        } catch (err) {
          set({
            loading: false,
            error: err.response?.data?.message || "Registration failed",
          });
        }
      },

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await axios.post(`${EXPO_API_URI}/auth/login`, {
            email,
            password,
          });

          set({
            user: res.data.user,
            token: res.data.token,
            loading: false,
          });

          return res.data;
        } catch (err) {
          set({
            loading: false,
            error: err.response?.data?.message || "Login failed",
          });
        }
      },

      logout: () => {
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage",

      storage: createJSONStorage(() => AsyncStorage),

      partialize: (state) => ({ user: state.user, token: state.token }),

      onStorageError: (error) => {
        console.error("Zustand persist error:", error);
      },
    }
  )
);
