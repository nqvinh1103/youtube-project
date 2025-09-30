import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../../api/api";

// Thunk để lấy related videos (sử dụng search với từ khóa từ video hiện tại)
export const fetchRelatedVideos = createAsyncThunk(
  "related/fetchRelated",
  async ({ videoId, maxResults = 20 }, { rejectWithValue }) => {
    try {
      console.log("Fetching related videos for:", videoId);

      // Lấy thông tin video hiện tại để tạo từ khóa tìm kiếm
      const videoResponse = await apiClient.get("videos", {
        params: {
          part: "snippet",
          id: videoId,
        },
      });

      if (!videoResponse.data.items || videoResponse.data.items.length === 0) {
        console.log("No video found for ID:", videoId);
        return [];
      }

      const currentVideo = videoResponse.data.items[0];
      const channelId = currentVideo.snippet.channelId;
      const channelTitle = currentVideo.snippet.channelTitle;

      // Tạo search query từ title và channel
      const titleWords = currentVideo.snippet.title
        .split(" ")
        .slice(0, 3)
        .join(" ");
      const searchQuery = `${titleWords} ${channelTitle}`;

      console.log("Searching related videos with query:", searchQuery);
      console.log("Channel ID:", channelId);

      // Tìm kiếm video liên quan dựa trên title và channel
      const response = await apiClient.get("search", {
        params: {
          part: "snippet",
          type: "video",
          q: searchQuery,
          maxResults: maxResults + 10, // Lấy thêm để có thể lọc
          regionCode: "VN",
          order: "relevance",
        },
      });

      console.log("Related videos response:", response.data);

      // Lọc bỏ video hiện tại khỏi kết quả
      let filteredResults = response.data.items.filter(
        (video) => video.id.videoId !== videoId
      );

      // Nếu không đủ kết quả, thử tìm kiếm với channel
      if (filteredResults.length < maxResults && channelId) {
        console.log("Not enough results, searching by channel:", channelId);

        const channelResponse = await apiClient.get("search", {
          params: {
            part: "snippet",
            type: "video",
            channelId: channelId,
            maxResults: maxResults + 5,
            regionCode: "VN",
            order: "relevance",
          },
        });

        const channelVideos = channelResponse.data.items.filter(
          (video) => video.id.videoId !== videoId
        );

        // Merge kết quả từ cả hai search
        const existingIds = new Set(filteredResults.map((v) => v.id.videoId));
        const newVideos = channelVideos.filter(
          (v) => !existingIds.has(v.id.videoId)
        );

        filteredResults = [...filteredResults, ...newVideos];
        console.log(
          "After channel search, total results:",
          filteredResults.length
        );
      }

      // Nếu vẫn không đủ, thử tìm kiếm với từ khóa đơn giản hơn
      if (filteredResults.length < maxResults) {
        console.log("Still not enough results, trying simpler search");

        const simpleResponse = await apiClient.get("search", {
          params: {
            part: "snippet",
            type: "video",
            q: titleWords,
            maxResults: maxResults + 5,
            regionCode: "VN",
            order: "relevance",
          },
        });

        const simpleVideos = simpleResponse.data.items.filter(
          (video) => video.id.videoId !== videoId
        );

        const existingIds = new Set(filteredResults.map((v) => v.id.videoId));
        const newVideos = simpleVideos.filter(
          (v) => !existingIds.has(v.id.videoId)
        );

        filteredResults = [...filteredResults, ...newVideos];
        console.log(
          "After simple search, total results:",
          filteredResults.length
        );
      }

      const result = filteredResults.slice(0, maxResults);
      console.log("Final related videos count:", result.length);
      return result;
    } catch (error) {
      console.error("Related videos error:", error);
      return rejectWithValue(
        error.response?.data?.error?.message || error.message
      );
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
