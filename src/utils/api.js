import axios from "axios";
import { EXPO_API_URI } from "../../config";
import { useAuthStore } from "../../store/authStore";

export const createAPI = () => {
  const token = useAuthStore.getState().token;
  if (!token) {
    throw new Error("No authentication token available");
  }
  return axios.create({
    baseURL: EXPO_API_URI || "http://localhost:5000/api",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};
