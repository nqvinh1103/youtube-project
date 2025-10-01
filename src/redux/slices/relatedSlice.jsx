import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { videoService } from "../../services/videoService";

// Thunk để lấy related videos - Sử dụng service layer
export const fetchRelatedVideos = createAsyncThunk(
  "related/fetchRelated",
  async ({ videoId, maxResults = 20 }, { rejectWithValue }) => {
    try {
      console.log("Fetching related videos for:", videoId);
      const result = await videoService.fetchRelatedVideos(videoId, maxResults);
      return result;
    } catch (error) {
      console.error("Related videos error:", error);
      return rejectWithValue(error.message);
    }
  }
);

const relatedSlice = createSlice({
  name: "related",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearRelatedVideos: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Related videos
      .addCase(fetchRelatedVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRelatedVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchRelatedVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearRelatedVideos } = relatedSlice.actions;
export default relatedSlice.reducer;
