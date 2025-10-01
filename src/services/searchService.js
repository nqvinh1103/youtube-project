import { apiClient } from "../api/api";
import { API_CONFIG, ENDPOINTS } from "../config/apiConfig";

class SearchService {
  async searchVideos({
    query,
    categoryId,
    order = "relevance",
    publishedAfter,
    duration,
    type = "video",
    maxResults = 25,
    pageToken = null,
  }) {
    try {
      const params = {
        part: "snippet",
        q: query,
        type: type,
        maxResults: maxResults,
        regionCode: API_CONFIG.YOUTUBE.DEFAULT_REGION,
        order: order,
      };

      if (categoryId && categoryId !== "0") {
        params.videoCategoryId = categoryId;
      }
      if (publishedAfter) {
        params.publishedAfter = publishedAfter;
      }
      if (duration) {
        params.videoDuration = duration;
      }
      if (pageToken) {
        params.pageToken = pageToken;
      }

      const response = await apiClient.get(ENDPOINTS.SEARCH, { params });

      if (response.data.items && response.data.items.length > 0) {
        const enrichedItems = await this.enrichSearchResults(
          response.data.items
        );
        return {
          items: enrichedItems,
          nextPageToken: response.data.nextPageToken || null,
        };
      }

      return {
        items: response.data.items || [],
        nextPageToken: response.data.nextPageToken || null,
      };
    } catch (error) {
      console.error("Search error:", error);
      throw this.handleApiError(error);
    }
  }

  async enrichSearchResults(items) {
    try {
      const videoIds = items.map((item) => item.id.videoId).join(",");

      const detailsResponse = await apiClient.get(ENDPOINTS.VIDEOS, {
        params: {
          part: "contentDetails,statistics",
          id: videoIds,
        },
      });

      const enrichedItems = items.map((item) => {
        const details = detailsResponse.data.items.find(
          (detail) => detail.id === item.id.videoId
        );
        return {
          ...item,
          contentDetails: details?.contentDetails,
          statistics: details?.statistics,
        };
      });

      return enrichedItems;
    } catch (error) {
      console.error("Error enriching search results:", error);
      return items;
    }
  }

  handleApiError(error) {
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
}

export const searchService = new SearchService();
export default searchService;
