// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./services/user/userSlice";
import basicQuestionReducer from "./services/study/basicQuestionSlice";
import preferencesReducer from "./services/user/preferencesSlice"; // Import the preferences reducer

export const store = configureStore({
  reducer: {
    user: userReducer,
    basicQuestion: basicQuestionReducer,
    preferences: preferencesReducer,
  },
});
