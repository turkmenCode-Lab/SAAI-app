import axios from "axios";
import { EXPO_API_URI } from "../../config";
import { useAuthStore } from "../../store/authStore";

export const createAPI = () => {
  const api = axios.create({
    baseURL: EXPO_API_URI || "http://localhost:5000/api",
    timeout: 15000,
  });

  api.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().token;
      console.log("[API] Token →", token ? "present" : "MISSING");
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (err) => Promise.reject(err)
  );

  api.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        console.warn("401 → logging out");
        useAuthStore.getState().logout?.();
      }
      return Promise.reject(err);
    }
  );

  return api;
};
