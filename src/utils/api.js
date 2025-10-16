import axios from "axios";
import { EXPO_API_URI } from "../../config";
import { useAuthStore } from "../../store/authStore";

export const createAPI = () => {
  const token = useAuthStore((state) => state.token);
  return axios.create({
    baseURL: EXPO_API_URI || "http://localhost:5000/api",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const fetchChats = async () => {
  try {
    const api = createAPI();
    const response = await api.get("/chat");
    console.log("Chats:", response.data);
    setChats(response.data);
  } catch (err) {
    console.error("Error fetching chats:", err.response?.data || err.message);
  }
};

const createNewChatAPI = async () => {
  try {
    const api = createAPI();
    const response = await api.post("/chat", { title: "New Chat" });
    setChats((prev) => [...prev, response.data]);
    setCurrentChatId(response.data.id);
  } catch (err) {
    console.error("Error creating chat:", err.response?.data || err.message);
  }
};

const sendMessageAPI = async (chatId, text) => {
  try {
    const api = createAPI();
    const response = await api.post(`/chat/${chatId}/message`, {
      role: "user",
      content: text,
    });
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId ? { ...c, messages: [...c.messages, response.data] } : c
      )
    );
  } catch (err) {
    console.error("Error sending message:", err.response?.data || err.message);
  }
};
