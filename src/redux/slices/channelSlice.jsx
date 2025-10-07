import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { channelService } from "../../services/channelService";
import { playlistService } from "../../services/playlistService";

export const fetchChannelsInfo = createAsyncThunk(
  "channels/fetchChannelsInfo",
  async (channelIds, { rejectWithValue }) => {
    try {
      if (!channelIds || channelIds.length === 0) {
        return [];
      }

      const channels = await channelService.fetchMultipleChannels(channelIds);
      return channelService.createChannelMap(channels);
    } catch (error) {
      console.error("Error fetching channels info:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchChannelSections = createAsyncThunk(
  "channels/fetchChannelSections",
  async (channelId, { rejectWithValue }) => {
    try {
      if (!channelId) {
        throw new Error("Channel ID is required");
      }

      const data = await channelService.fetchChannelSections(channelId);
      return { channelId, sections: data.items || [] };
    } catch (error) {
      console.error("Error fetching channel sections:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPlaylistsForSections = createAsyncThunk(
  "channels/fetchPlaylistsForSections",
  async (channelId, { getState, rejectWithValue }) => {
    try {
      const sections =
        getState().channels.sectionsByChannelId?.[channelId] || [];
      const playlistIds = sections
        .flatMap((s) => s.contentDetails?.playlists || [])
        .filter(Boolean);
      const uniqueIds = Array.from(new Set(playlistIds));
      const playlists = await playlistService.fetchPlaylistsByIds(uniqueIds);
      return { channelId, playlists };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPlaylistItemsForPlaylist = createAsyncThunk(
  "channels/fetchPlaylistItemsForPlaylist",
  async ({ playlistId, pageToken }, { rejectWithValue }) => {
    try {
      const { items, nextPageToken } = await playlistService.fetchPlaylistItems(
        playlistId,
        pageToken
      );
      return { playlistId, items, nextPageToken };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPlaylistsByChannel = createAsyncThunk(
  "channels/fetchPlaylistsByChannel",
  async ({ channelId, pageToken }, { rejectWithValue }) => {
    try {
      const { items, nextPageToken } =
        await playlistService.fetchPlaylistsByChannelId(channelId, pageToken);
      return { channelId, items, nextPageToken };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPopularVideos = createAsyncThunk(
  "channel/fetchPopularVideos",
  async (
    { channelId, maxResults = 25, pageToken = null, isLoadMore = false },
    { rejectWithValue }
  ) => {
    try {
      const result = await channelService.getPopularVideosByChannel({
        channelId,
        maxResults,
        pageToken,
      });
      return { ...result, isLoadMore };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const channelSlice = createSlice({
  name: "channels",
  initialState: {
    channels: {},
    loading: false,
    error: null,
    sectionsByChannelId: {},
    playlistsById: {},
    playlistItemsByPlaylistId: {},
    popularVideosByChannelId: {},
  },
  reducers: {
    clearChannels: (state) => {
      state.channels = {};
      state.error = null;
      state.sectionsByChannelId = {};
      state.playlistsById = {};
      state.playlistItemsByPlaylistId = {};
      state.popularVideosByChannelId = {};
    },
    setChannelInfo: (state, action) => {
      const { channelId, channelInfo } = action.payload;
      state.channels[channelId] = channelInfo;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannelsInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChannelsInfo.fulfilled, (state, action) => {
        state.loading = false;
        // Merge new channel data with existing data
        state.channels = { ...state.channels, ...action.payload };
      })
      .addCase(fetchChannelsInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchChannelSections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChannelSections.fulfilled, (state, action) => {
        state.loading = false;
        const { channelId, sections } = action.payload;
        state.sectionsByChannelId[channelId] = sections;
      })
      .addCase(fetchChannelSections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchPlaylistsForSections.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchPlaylistsForSections.fulfilled, (state, action) => {
        const { playlists } = action.payload;
        playlists.forEach((p) => {
          state.playlistsById[p.id] = p;
        });
      })
      .addCase(fetchPlaylistsForSections.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchPlaylistItemsForPlaylist.fulfilled, (state, action) => {
        const { playlistId, items, nextPageToken } = action.payload;
        const existing = state.playlistItemsByPlaylistId[playlistId] || {
          items: [],
          nextPageToken: null,
        };
        state.playlistItemsByPlaylistId[playlistId] = {
          items: [...existing.items, ...items],
          nextPageToken,
        };
      })
      .addCase(fetchPlaylistItemsForPlaylist.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchPopularVideos.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchPopularVideos.fulfilled, (state, action) => {
        const { items, nextPageToken, isLoadMore } = action.payload;
        const channelId = items.length > 0 ? items[0].snippet.channelId : null;
        if (!channelId) return;

        const existingEntry = state.popularVideosByChannelId[channelId] || {
          items: [],
          nextPageToken: null,
        };

        state.popularVideosByChannelId[channelId] = {
          items: isLoadMore ? [...existingEntry.items, ...items] : items,
          nextPageToken,
        };
      })
      .addCase(fetchPopularVideos.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchPlaylistsByChannel.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchPlaylistsByChannel.fulfilled, (state, action) => {
        const { channelId, items, nextPageToken } = action.payload;
        const existing = state.playlistsById[channelId] || {
          items: [],
          nextPageToken: null,
        };

        state.playlistsById[channelId] = {
          items: [...existing.items, ...items],
          nextPageToken,
        };
      })
      .addCase(fetchPlaylistsByChannel.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearChannels, setChannelInfo } = channelSlice.actions;
export default channelSlice.reducer;
