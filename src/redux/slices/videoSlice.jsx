import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../../api/api";

// Thunk để fetch video từ YouTube API
export const fetchPopularVideos = createAsyncThunk(
  "videos/fetchPopular",
  async (pageToken = null) => {
    const response = await apiClient.get("videos", {
      params: {
        part: "snippet,contentDetails,statistics",
        chart: "mostPopular",
        regionCode: "VN",
        maxResults: 20,
        pageToken: pageToken || "",
      },
    });
    return {
      items: response.data.items,
      nextPageToken: response.data.nextPageToken,
    };
  }
);

// Thunk để lấy chi tiết video
export const fetchVideoDetail = createAsyncThunk(
  "videos/fetchDetail",
  async ({ videoId }, { rejectWithValue }) => {
    try {
      console.log("Fetching video detail for:", videoId);

      // Validate videoId
      if (!videoId) {
        throw new Error("Video ID is required");
      }

      const response = await apiClient.get("videos", {
        params: {
          part: "snippet,contentDetails,statistics",
          id: videoId,
        },
      });
      console.log("Video detail response:", response.data);

      if (!response.data.items || response.data.items.length === 0) {
        throw new Error("Video not found");
      }

      return response.data.items[0];
    } catch (error) {
      console.error("Video detail error:", error);
      return rejectWithValue(
        error.response?.data?.error?.message || error.message
      );
    }
  }
);

const videoSlice = createSlice({
  name: "videos",
  initialState: {
    // Popular videos
    items: [],
    loading: false,
    error: null,
    nextPageToken: null,

    // Video detail
    currentVideo: null,
    detailLoading: false,
    detailError: null,
  },
  reducers: {
    clearCurrentVideo: (state) => {
      state.currentVideo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Popular videos
      .addCase(fetchPopularVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPopularVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [...state.items, ...action.payload.items];
        state.nextPageToken = action.payload.nextPageToken;
      })
      .addCase(fetchPopularVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Video detail
      .addCase(fetchVideoDetail.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchVideoDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentVideo = action.payload;
      })
      .addCase(fetchVideoDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload || action.error.message;
      });
  },
});

export const { clearCurrentVideo } = videoSlice.actions;
export default videoSlice.reducer;
