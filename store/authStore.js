import { create } from "zustand";
import axios from "axios";
import { EXPO_API_URI } from "../config";

export const useAuthStore = create((set) => ({
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
      set({ user: res.data.user, token: res.data.token, loading: false });
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
      console.log(res.data);
      set({ user: res.data.user, token: res.data.token, loading: false });
      return res.data;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Login failed",
      });
    }
  },

  logout: () => set({ user: null, token: null }),
}));
