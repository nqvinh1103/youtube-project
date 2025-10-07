import { apiClient } from "../api/api";
import { ENDPOINTS } from "../config/apiConfig";

class ChannelService {
  async enrichVideoDetails(items) {
    try {
      const videoIds = items.map((item) => item.id.videoId).join(",");
      if (!videoIds) return items;

      const detailsResponse = await apiClient.get(ENDPOINTS.VIDEOS, {
        params: {
          part: "contentDetails,statistics",
          id: videoIds,
        },
      });

      const enriched = items.map((item) => {
        const details = detailsResponse.data.items.find(
          (d) => d.id === item.id.videoId
        );
        return {
          ...item,
          contentDetails: details?.contentDetails,
          statistics: details?.statistics,
        };
      });

      return enriched;
    } catch (error) {
      console.error("Error enriching video details:", error);
      return items;
    }
  }

  async getPopularVideosByChannel({
    channelId,
    maxResults = 25,
    pageToken = null,
  }) {
    try {
      const params = {
        part: "snippet",
        channelId: channelId,
        type: "video",
        order: "viewCount", // sắp xếp theo lượt xem
        maxResults: maxResults,
      };
      if (pageToken) params.pageToken = pageToken;

      const response = await apiClient.get(ENDPOINTS.SEARCH, { params });

      const items = response.data.items || [];

      // enrich thêm statistics (viewCount, likeCount, v.v.)
      const enrichedItems = await this.enrichVideoDetails(items);

      return {
        items: enrichedItems,
        nextPageToken: response.data.nextPageToken || null,
      };
    } catch (error) {
      console.error("Error fetching popular videos:", error);
      throw new Error("Failed to fetch popular videos for channel");
    }
  }
  async fetchChannelSections(channelId) {
    try {
      if (!channelId) {
        throw new Error("Channel ID is required");
      }

      const response = await apiClient.get(ENDPOINTS.CHANNEL_SECTIONS, {
        params: {
          part: "snippet,contentDetails",
          channelId,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching channel sections:", error);
      throw this.handleApiError(error);
    }
  }
  async fetchChannelInfo(channelId) {
    try {
      if (!channelId) {
        throw new Error("Channel ID is required");
      }

      const response = await apiClient.get(ENDPOINTS.CHANNELS, {
        params: {
          part: "snippet,statistics,brandingSettings",
          id: channelId,
        },
      });

      if (!response.data.items || response.data.items.length === 0) {
        throw new Error("Channel not found");
      }

      return response.data.items[0];
    } catch (error) {
      console.error("Error fetching channel info:", error);
      throw this.handleApiError(error);
    }
  }

  async fetchMultipleChannels(channelIds) {
    try {
      if (!channelIds || channelIds.length === 0) {
        return [];
      }

      const batchSize = 50;
      const batches = [];

      for (let i = 0; i < channelIds.length; i += batchSize) {
        const batch = channelIds.slice(i, i + batchSize);
        batches.push(batch);
      }

      const allChannels = [];

      for (const batch of batches) {
        const response = await apiClient.get(ENDPOINTS.CHANNELS, {
          params: {
            part: "snippet,statistics,brandingSettings",
            id: batch.join(","),
          },
        });

        if (response.data.items) {
          allChannels.push(...response.data.items);
        }
      }

      return allChannels;
    } catch (error) {
      console.error("Error fetching multiple channels:", error);
      throw this.handleApiError(error);
    }
  }

  // Tạo map từ channelId -> channel info để dễ lookup
  createChannelMap(channels) {
    return channels.reduce((map, channel) => {
      map[channel.id] = {
        id: channel.id,
        title: channel.snippet?.title,
        description: channel.snippet?.description,
        thumbnail: channel.snippet?.thumbnails?.default?.url,
        mediumThumbnail: channel.snippet?.thumbnails?.medium?.url,
        highThumbnail: channel.snippet?.thumbnails?.high?.url,
        subscriberCount: channel.statistics?.subscriberCount,
        videoCount: channel.statistics?.videoCount,
        viewCount: channel.statistics?.viewCount,
        publishedAt: channel.snippet?.publishedAt,
        country: channel.snippet?.country,
        bannerUrl:
          channel.brandingSettings?.image?.bannerExternalUrl ||
          channel.brandingSettings?.image?.bannerImageUrl ||
          null,
      };
      return map;
    }, {});
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
}

export const channelService = new ChannelService();
export default channelService;
