import { apiClient } from "../api/api";

class VideoService {
  async fetchPopularVideos(
    pageToken = null,
    regionCode = "VN",
    maxResults = 20
  ) {
    try {
      const response = await apiClient.get("videos", {
        params: {
          part: "snippet,contentDetails,statistics",
          chart: "mostPopular",
          regionCode,
          maxResults,
          pageToken: pageToken || "",
        },
      });

      return {
        items: response.data.items || [],
        nextPageToken: response.data.nextPageToken || null,
        totalResults: response.data.pageInfo?.totalResults || 0,
      };
    } catch (error) {
      console.error("Error fetching popular videos:", error);
      throw this.handleApiError(error);
    }
  }

  async fetchVideoDetail(videoId) {
    try {
      if (!videoId) {
        throw new Error("Video ID is required");
      }

      const response = await apiClient.get("videos", {
        params: {
          part: "snippet,contentDetails,statistics",
          id: videoId,
        },
      });

      if (!response.data.items || response.data.items.length === 0) {
        throw new Error("Video not found");
      }

      return response.data.items[0];
    } catch (error) {
      console.error("Error fetching video detail:", error);
      throw this.handleApiError(error);
    }
  }

  async fetchRelatedVideos(videoId, maxResults = 20) {
    try {
      const response = await apiClient.get("search", {
        params: {
          part: "snippet",
          type: "video",
          relatedToVideoId: videoId,
          maxResults,
        },
      });

      return response.data.items || [];
    } catch (error) {
      console.error("Error fetching related videos:", error);
      throw this.handleApiError(error);
    }
  }

  async fetchVideosByCategory(categoryId, pageToken = null) {
    try {
      const response = await apiClient.get("videos", {
        params: {
          part: "snippet,contentDetails,statistics",
          chart: "mostPopular",
          videoCategoryId: categoryId,
          maxResults: 20,
          pageToken: pageToken || "",
        },
      });

      return {
        items: response.data.items || [],
        nextPageToken: response.data.nextPageToken || null,
      };
    } catch (error) {
      console.error("Error fetching videos by category:", error);
      throw this.handleApiError(error);
    }
  }

  handleApiError(error) {
    // YouTube API specific error handling
    if (error.response?.data?.error) {
      const apiError = error.response.data.error;
      return new Error(apiError.message || "YouTube API Error");
    }

    // Network errors
    if (error.code === "NETWORK_ERROR" || !error.response) {
      return new Error("Network error. Please check your connection.");
    }

    // Rate limiting
    if (error.response?.status === 403) {
      return new Error("API quota exceeded. Please try again later.");
    }

    // Default error
    return new Error(error.message || "An unexpected error occurred");
  }

  async withRetry(apiCall, maxRetries = 3, delay = 1000) {
    let lastError;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await apiCall();
      } catch (error) {
        lastError = error;

        // Không retry cho một số lỗi cụ thể
        if (error.response?.status === 400 || error.response?.status === 404) {
          throw error;
        }

        if (i < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
        }
      }
    }

    throw lastError;
  }
}

export const videoService = new VideoService();
export default videoService;
