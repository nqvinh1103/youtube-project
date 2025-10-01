import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { commentService } from "../../services/commentService";

// Thunk để lấy comments - Sử dụng service layer
export const fetchVideoComments = createAsyncThunk(
  "comments/fetchComments",
  async ({ videoId, maxResults = 20, order = "time" }, { rejectWithValue }) => {
    try {
      const result = await commentService.fetchVideoComments(
        videoId,
        maxResults,
        order
      );
      return result;
    } catch (error) {
      console.error("Comments error:", error);
      return rejectWithValue(error.message);
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
