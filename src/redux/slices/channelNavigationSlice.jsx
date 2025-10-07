import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTab: "Home",
  videoSort: "latest",
  liveVideoSort: "latest",
  playlistSort: "Date added (newest)",
};

const channelNavigationSlice = createSlice({
  name: "channelNavigation",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setVideoSort: (state, action) => {
      state.videoSort = action.payload;
    },
    setLiveVideoSort: (state, action) => {
      state.liveVideoSort = action.payload;
    },
    setPlaylistSort: (state, action) => {
      state.playlistSort = action.payload;
    },
  },
});

export const { setActiveTab, setVideoSort, setLiveVideoSort, setPlaylistSort } =
  channelNavigationSlice.actions;
export default channelNavigationSlice.reducer;
