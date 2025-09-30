import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://youtube.googleapis.com/youtube/v3/",
  params: {
    key: import.meta.env.VITE_YT_API_KEY,
  },
  timeout: 20000,
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
    return Promise.reject(error);
  }
);
