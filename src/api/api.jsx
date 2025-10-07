import axios from "axios";
import { API_CONFIG } from "../config/apiConfig";

export const apiClient = axios.create({
  baseURL: API_CONFIG.YOUTUBE.BASE_URL,
  params: {
    key: import.meta.env.VITE_YT_API_KEY,
  },
  timeout: API_CONFIG.YOUTUBE.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    // Trả về response gốc từ YouTube API
    return response;
  },
  (error) => {
    console.error("API Error:", error);
    console.error(
      "API Key being used:",
      import.meta.env.VITE_YT_API_KEY?.substring(0, 10) + "..."
    );
    console.error("Error details:", error.response?.data);
    return Promise.reject(error);
  }
);
