// src/features/preferences/preferencesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  language: localStorage.getItem("language") || "vi", // Default to Vietnamese if not set
};

export const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem("language", action.payload); // Persist language preference
    },
  },
});

export const { setLanguage } = preferencesSlice.actions;

export default preferencesSlice.reducer;
