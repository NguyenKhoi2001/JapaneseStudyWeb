// userProgressSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as userProgressAPI from "./userProgress.api";

// Thunks
export const fetchAllUserProgress = createAsyncThunk(
  "userProgress/fetchAll",
  async (userId) => {
    return await userProgressAPI.fetchUserProgressByUser(userId);
  }
);

export const updateUserProgress = createAsyncThunk(
  "userProgress/update",
  async (progressData) => {
    return await userProgressAPI.addUserProgress(progressData);
  }
);

export const checkCanStartLesson = createAsyncThunk(
  "userProgress/canStartLesson",
  async ({ userId, lessonId }) => {
    return await userProgressAPI.canStartLesson(userId, lessonId);
  }
);

export const getLevelProgress = createAsyncThunk(
  "userProgress/levelProgress",
  async ({ userId, levelId }) => {
    return await userProgressAPI.calculateLevelProgress(userId, levelId);
  }
);

// Initial state
const initialState = {
  progress: [],
  canStart: {},
  levelProgress: {},
  status: "idle",
  error: null,
};

const userProgressSlice = createSlice({
  name: "userProgress",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUserProgress.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllUserProgress.fulfilled, (state, action) => {
        state.progress = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchAllUserProgress.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateUserProgress.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserProgress.fulfilled, (state, action) => {
        // Insert or update logic
        const index = state.progress.findIndex(
          (p) => p.lesson._id === action.meta.arg.lessonId
        );
        if (index !== -1) {
          state.progress[index] = action.payload;
        } else {
          state.progress.push(action.payload);
        }
        state.status = "succeeded";
      })
      .addCase(updateUserProgress.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(checkCanStartLesson.fulfilled, (state, action) => {
        state.canStart[action.meta.arg.lessonId] = action.payload.canStart;
      })
      .addCase(getLevelProgress.fulfilled, (state, action) => {
        state.levelProgress[action.meta.arg.levelId] = action.payload.progress;
      });
  },
});

export default userProgressSlice.reducer;
