import { configureStore } from "@reduxjs/toolkit";
import user from "./user";
import categories from "./category.js"

const store = configureStore({
  reducer: {
    user,
    categories,
  },
});

export default store;
