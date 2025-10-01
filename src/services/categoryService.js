import { apiClient } from "../api/api";
import { API_CONFIG, ENDPOINTS, VIDEO_CATEGORIES } from "../config/apiConfig";

class CategoryService {
  async fetchVideoCategories(regionCode = API_CONFIG.YOUTUBE.DEFAULT_REGION) {
    try {
      console.log("Fetching video categories for region:", regionCode);

      const response = await apiClient.get("videoCategories", {
        params: {
          part: "snippet",
          regionCode: regionCode,
        },
      });

      console.log("Categories response:", response.data);
      return response.data.items || [];
    } catch (error) {
      console.error("Categories error:", error);
      throw this.handleApiError(error);
    }
  }

  getPopularCategories() {
    return [
      { id: "0", snippet: { title: "All", assignable: true } },
      {
        id: VIDEO_CATEGORIES.MUSIC,
        snippet: { title: "Music", assignable: true },
      },
      {
        id: VIDEO_CATEGORIES.GAMING,
        snippet: { title: "Gaming", assignable: true },
      },
      {
        id: VIDEO_CATEGORIES.ENTERTAINMENT,
        snippet: { title: "Entertainment", assignable: true },
      },
      {
        id: VIDEO_CATEGORIES.SPORTS,
        snippet: { title: "Sports", assignable: true },
      },
      {
        id: VIDEO_CATEGORIES.NEWS,
        snippet: { title: "News", assignable: true },
      },
      {
        id: VIDEO_CATEGORIES.EDUCATION,
        snippet: { title: "Education", assignable: true },
      },
      {
        id: VIDEO_CATEGORIES.SCIENCE,
        snippet: { title: "Science & Technology", assignable: true },
      },
    ];
  }

  async getCategoryById(
    categoryId,
    regionCode = API_CONFIG.YOUTUBE.DEFAULT_REGION
  ) {
    try {
      const response = await apiClient.get("videoCategories", {
        params: {
          part: "snippet",
          id: categoryId,
          regionCode: regionCode,
        },
      });

      return response.data.items?.[0] || null;
    } catch (error) {
      console.error("Error fetching category by ID:", error);
      throw this.handleApiError(error);
    }
  }

  async getVideosByCategory(categoryId, pageToken = null, maxResults = 20) {
    try {
      const params = {
        part: "snippet,contentDetails,statistics",
        chart: "mostPopular",
        videoCategoryId: categoryId,
        maxResults: maxResults,
        regionCode: API_CONFIG.YOUTUBE.DEFAULT_REGION,
      };

      if (pageToken) {
        params.pageToken = pageToken;
      }

      const response = await apiClient.get(ENDPOINTS.VIDEOS, { params });

      return {
        items: response.data.items || [],
        nextPageToken: response.data.nextPageToken || null,
        totalResults: response.data.pageInfo?.totalResults || 0,
      };
    } catch (error) {
      console.error("Error fetching videos by category:", error);
      throw this.handleApiError(error);
    }
  }

  handleApiError(error) {
    if (error.response?.data?.error) {
      const apiError = error.response.data.error;
      return new Error(apiError.message || "YouTube API Error");
    }

    if (error.code === "NETWORK_ERROR" || !error.response) {
      return new Error("Network error. Please check your connection.");
    }

    if (error.response?.status === 403) {
      return new Error("API quota exceeded. Please try again later.");
    }

    return new Error(error.message || "An unexpected error occurred");
  }
}

export const categoryService = new CategoryService();
export default categoryService;
