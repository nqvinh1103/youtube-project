/**
 * API Configuration - Centralized config cho tất cả API calls
 * Dễ thay đổi và maintain
 */

export const API_CONFIG = {
  // YouTube API settings
  YOUTUBE: {
    BASE_URL: "https://www.googleapis.com/youtube/v3/",
    TIMEOUT: 20000,
    DEFAULT_REGION: "VN",
    DEFAULT_MAX_RESULTS: 20,
    DEFAULT_PARTS: "snippet,contentDetails,statistics",
  },

  // Retry settings
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000, // ms
    BACKOFF_MULTIPLIER: 2,
  },

  // Rate limiting
  RATE_LIMIT: {
    REQUESTS_PER_MINUTE: 100,
    BURST_LIMIT: 10,
  },

  // Cache settings
  CACHE: {
    TTL: 5 * 60 * 1000, // 5 minutes
    MAX_SIZE: 100,
  },
};

export const ENDPOINTS = {
  VIDEOS: "videos",
  SEARCH: "search",
  CHANNELS: "channels",
  CHANNEL_SECTIONS: "channelSections",
  PLAYLISTS: "playlists",
  PLAYLIST_ITEMS: "playlistItems",
  COMMENTS: "commentThreads",
};

export const VIDEO_CATEGORIES = {
  ENTERTAINMENT: "24",
  MUSIC: "10",
  GAMING: "20",
  SPORTS: "17",
  NEWS: "25",
  EDUCATION: "27",
  SCIENCE: "28",
  TECH: "28",
};
