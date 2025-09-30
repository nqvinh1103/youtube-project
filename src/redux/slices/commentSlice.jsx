import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../../api/api";

// Thunk để lấy comments
export const fetchVideoComments = createAsyncThunk(
  "comments/fetchComments",
  async ({ videoId, maxResults = 20, order = "time" }, { rejectWithValue }) => {
    try {
      console.log("Fetching comments for video:", videoId);
      const response = await apiClient.get("commentThreads", {
        params: {
          part: "snippet,replies",
          videoId: videoId,
          maxResults: maxResults,
          order: order,
        },
      });
      console.log("Comments response:", response.data);
      return response.data.items;
    } catch (error) {
      console.error("Comments error:", error);
      return rejectWithValue(
        error.response?.data?.error?.message || error.message
      );
    }
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearComments: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Comments
      .addCase(fetchVideoComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideoComments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchVideoComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;
