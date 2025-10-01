import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { searchService } from "../../services/searchService";

export const searchVideos = createAsyncThunk(
  "search/searchVideos",
  async (
    {
      query,
      categoryId,
      order = "relevance",
      publishedAfter,
      duration,
      type = "video",
      maxResults = 25,
      pageToken = null,
      isLoadMore = false,
    },
    { rejectWithValue }
  ) => {
    try {
      const result = await searchService.searchVideos({
        query,
        categoryId,
        order,
        publishedAfter,
        duration,
        type,
        maxResults,
        pageToken,
      });
      return { ...result, isLoadMore };
    } catch (error) {
      console.error("Search error:", error);
      return rejectWithValue(error.message);
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    results: [],
    loading: false,
    error: null,
    query: "",
    nextPageToken: null,
  },
  reducers: {
    clearSearchResults: (state) => {
      state.results = [];
      state.query = "";
      state.nextPageToken = null;
    },
    setSearchQuery: (state, action) => {
      state.query = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchVideos.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.isLoadMore) {
          state.results = [...state.results, ...action.payload.items];
        } else {
          state.results = action.payload.items;
          state.query = action.meta.arg.query;
        }
        state.nextPageToken = action.payload.nextPageToken;
      })
      .addCase(searchVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearSearchResults, setSearchQuery } = searchSlice.actions;
export default searchSlice.reducer;
