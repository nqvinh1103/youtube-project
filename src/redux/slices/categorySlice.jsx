import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../../api/api";

// Thunk để lấy video categories
export const fetchVideoCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching video categories");
      const response = await apiClient.get("videoCategories", {
        params: {
          part: "snippet",
          regionCode: "VN",
        },
      });
      console.log("Categories response:", response.data);
      return response.data.items;
    } catch (error) {
      console.error("Categories error:", error);
      return rejectWithValue(
        error.response?.data?.error?.message || error.message
      );
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCategories: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Video categories
      .addCase(fetchVideoCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideoCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchVideoCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearCategories } = categorySlice.actions;
export default categorySlice.reducer;
