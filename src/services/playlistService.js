import { apiClient } from "../api/api";
import { ENDPOINTS } from "../config/apiConfig";

class PlaylistService {
  async fetchPlaylistsByIds(playlistIds = []) {
    if (!playlistIds.length) return [];
    const batchSize = 50;
    const results = [];
    for (let i = 0; i < playlistIds.length; i += batchSize) {
      const batch = playlistIds.slice(i, i + batchSize);
      const res = await apiClient.get(ENDPOINTS.PLAYLISTS, {
        params: {
          part: "snippet,contentDetails",
          id: batch.join(","),
          maxResults: 50,
        },
      });
      if (res.data?.items) results.push(...res.data.items);
    }
    return results;
  }

  async fetchPlaylistItems(playlistId, pageToken) {
    if (!playlistId) return { items: [], nextPageToken: null };
    const res = await apiClient.get(ENDPOINTS.PLAYLIST_ITEMS, {
      params: {
        part: "snippet,contentDetails",
        playlistId,
        maxResults: 25,
        pageToken,
      },
    });
    return {
      items: res.data?.items || [],
      nextPageToken: res.data?.nextPageToken || null,
    };
  }

  async fetchPlaylistsByChannelId(channelId, pageToken) {
    if (!channelId) return { items: [], nextPageToken: null };

    const res = await apiClient.get(ENDPOINTS.PLAYLISTS, {
      params: {
        part: "snippet,contentDetails",
        channelId,
        maxResults: 25,
        pageToken,
      },
    });

    return {
      items: res.data?.items || [],
      nextPageToken: res.data?.nextPageToken || null,
    };
  }
}

export const playlistService = new PlaylistService();
export default playlistService;
