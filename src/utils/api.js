import axios from "axios";
import { EXPO_API_URI } from "../../config";
import { useAuthStore } from "../../store/authStore";

export const createAPI = () => {
  const api = axios.create({
    baseURL: EXPO_API_URI || "http://192.168.x.x:5000/api",
    headers: {
      "Content-Type": "application/json",
    },
  });
  api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (!token) throw new Error("No token available");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  return api;
};
