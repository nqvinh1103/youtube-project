import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./slices/categorySlice";
import navigationReducer from "./slices/channelNavigationSlice";
import channelReducer from "./slices/channelSlice";
import commentReducer from "./slices/commentSlice";
import relatedReducer from "./slices/relatedSlice";
import searchReducer from "./slices/searchSlice";
import videoReducer from "./slices/videoSlice";

const store = configureStore({
  reducer: {
    videos: videoReducer,
    search: searchReducer,
    categories: categoryReducer,
    channels: channelReducer,
    comments: commentReducer,
    related: relatedReducer,
    channelNavigation: navigationReducer,
  },
});

export default store;
