import { apiClient } from "../api/api";
import { ENDPOINTS } from "../config/apiConfig";

class CommentService {
  async fetchVideoComments(videoId, maxResults = 20, order = "time") {
    try {
      console.log("Fetching comments for video:", videoId);

      const response = await apiClient.get(ENDPOINTS.COMMENTS, {
        params: {
          part: "snippet,replies",
          videoId: videoId,
          maxResults: maxResults,
          order: order,
        },
      });

      console.log("Comments response:", response.data);
      return response.data.items || [];
    } catch (error) {
      console.error("Comments error:", error);
      throw this.handleApiError(error);
    }
  }

  async fetchCommentReplies(parentId, maxResults = 10) {
    try {
      const response = await apiClient.get(ENDPOINTS.COMMENTS, {
        params: {
          part: "snippet",
          parentId: parentId,
          maxResults: maxResults,
        },
      });

      return response.data.items || [];
    } catch (error) {
      console.error("Comment replies error:", error);
      throw this.handleApiError(error);
    }
  }

  async fetchCommentsWithPagination(
    videoId,
    pageToken = null,
    maxResults = 20
  ) {
    try {
      const params = {
        part: "snippet,replies",
        videoId: videoId,
        maxResults: maxResults,
        order: "time",
      };

      if (pageToken) {
        params.pageToken = pageToken;
      }

      const response = await apiClient.get(ENDPOINTS.COMMENTS, { params });

      return {
        items: response.data.items || [],
        nextPageToken: response.data.nextPageToken || null,
        totalResults: response.data.pageInfo?.totalResults || 0,
      };
    } catch (error) {
      console.error("Comments pagination error:", error);
      throw this.handleApiError(error);
    }
  }

  handleApiError(error) {
    if (error.response?.data?.error) {
      const apiError = error.response.data.error;
      return new Error(apiError.message || "YouTube API Error");
    }

    if (
      error.response?.status === 403 &&
      error.response?.data?.error?.message?.includes("commentsDisabled")
    ) {
      return new Error("Comments are disabled for this video");
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

export const commentService = new CommentService();
export default commentService;
