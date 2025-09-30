import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../../api/api";

// Thunk để search videos (hỗ trợ cả basic và advanced search)
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
    },
    { rejectWithValue }
  ) => {
    try {
      console.log("Searching for:", {
        query,
        categoryId,
        order,
        publishedAfter,
        duration,
        type,
        maxResults,
      });

      // Xây dựng params cơ bản
      const params = {
        part: "snippet",
        q: query,
        type: type,
        maxResults: maxResults,
        regionCode: "VN",
        order: order,
      };

      // Thêm filters nếu có
      if (categoryId && categoryId !== "0") {
        params.videoCategoryId = categoryId;
      }
      if (publishedAfter) {
        params.publishedAfter = publishedAfter;
      }
      if (duration) {
        params.videoDuration = duration;
      }

      const response = await apiClient.get("search", { params });
      console.log("Search response:", response.data);

      // Lấy thêm thông tin chi tiết cho từng video
      if (response.data.items && response.data.items.length > 0) {
        const videoIds = response.data.items
          .map((item) => item.id.videoId)
          .join(",");
        const detailsResponse = await apiClient.get("videos", {
          params: {
            part: "contentDetails,statistics",
            id: videoIds,
          },
        });

        // Merge thông tin chi tiết vào search results
        const enrichedItems = response.data.items.map((item) => {
          const details = detailsResponse.data.items.find(
            (detail) => detail.id === item.id.videoId
          );
          return {
            ...item,
            contentDetails: details?.contentDetails,
            statistics: details?.statistics,
          };
        });

        return enrichedItems;
      }

      return response.data.items;
    } catch (error) {
      console.error("Search error:", error);
      return rejectWithValue(
        error.response?.data?.error?.message || error.message
      );
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
  },
  reducers: {
    clearSearchResults: (state) => {
      state.results = [];
      state.query = "";
    },
    setSearchQuery: (state, action) => {
      state.query = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Search videos
      .addCase(searchVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(searchVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearSearchResults, setSearchQuery } = searchSlice.actions;
export default searchSlice.reducer;
