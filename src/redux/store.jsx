import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./slices/categorySlice";
import commentReducer from "./slices/commentSlice";
import relatedReducer from "./slices/relatedSlice";
import searchReducer from "./slices/searchSlice";
import videoReducer from "./slices/videoSlice";

const store = configureStore({
  reducer: {
    videos: videoReducer,
    search: searchReducer,
    categories: categoryReducer,
    comments: commentReducer,
    related: relatedReducer,
  },
});

export default store;
