import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { videoService } from "../../services/videoService";

// Thunk để fetch video từ YouTube API - Sử dụng service layer
export const fetchPopularVideos = createAsyncThunk(
  "videos/fetchPopular",
  async (pageToken = null, { rejectWithValue }) => {
    try {
      const result = await videoService.fetchPopularVideos(pageToken);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk để lấy chi tiết video - Sử dụng service layer
export const fetchVideoDetail = createAsyncThunk(
  "videos/fetchDetail",
  async ({ videoId }, { rejectWithValue }) => {
    try {
      console.log("Fetching video detail for:", videoId);
      const result = await videoService.fetchVideoDetail(videoId);
      console.log("Video detail response:", result);
      return result;
    } catch (error) {
      console.error("Video detail error:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Thunk để lấy related videos - Sử dụng service layer
export const fetchRelatedVideos = createAsyncThunk(
  "videos/fetchRelated",
  async ({ videoId }, { rejectWithValue }) => {
    try {
      console.log("Fetching related videos for:", videoId);
      const result = await videoService.fetchRelatedVideos(videoId);
      return result;
    } catch (error) {
      console.error("Related videos error:", error);
      return rejectWithValue(error.message);
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

    // Related videos
    relatedVideos: [],
    relatedLoading: false,
    relatedError: null,
  },
  reducers: {
    clearCurrentVideo: (state) => {
      state.currentVideo = null;
    },
    clearRelatedVideos: (state) => {
      state.relatedVideos = [];
      state.relatedError = null;
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
      })

      // Related videos
      .addCase(fetchRelatedVideos.pending, (state) => {
        state.relatedLoading = true;
        state.relatedError = null;
      })
      .addCase(fetchRelatedVideos.fulfilled, (state, action) => {
        state.relatedLoading = false;
        state.relatedVideos = action.payload;
      })
      .addCase(fetchRelatedVideos.rejected, (state, action) => {
        state.relatedLoading = false;
        state.relatedError = action.payload || action.error.message;
      });
  },
});

export const { clearCurrentVideo, clearRelatedVideos } = videoSlice.actions;
export default videoSlice.reducer;
