import axios from "axios";
import { EXPO_API_URI } from "../../config";
import { useAuthStore } from "../../store/authStore";

export const createAPI = () => {
  const token = useAuthStore.getState().token;
  return axios.create({
    baseURL: EXPO_API_URI || "http://localhost:5000/api",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};
