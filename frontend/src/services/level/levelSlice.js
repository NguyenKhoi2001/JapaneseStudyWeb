import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as levelAPI from "./level.api";

// Thunks
export const fetchAllLevels = createAsyncThunk("levels/fetchAll", async () => {
  return await levelAPI.fetchLevels();
});

export const fetchLessonsForLevel = createAsyncThunk(
  "levels/fetchLessons",
  async (id) => {
    return await levelAPI.fetchLessonsByLevelId(id);
  }
);

// Initial state
const initialState = {
  items: [],
  lessonsByLevel: {},
  status: "idle",
  error: null,
  selectedLevelId: null, // Add this to track the selected level
};

const levelSlice = createSlice({
  name: "levels",
  initialState,
  reducers: {
    selectLevel(state, action) {
      state.selectedLevelId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllLevels.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllLevels.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchAllLevels.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchLessonsForLevel.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLessonsForLevel.fulfilled, (state, action) => {
        state.lessonsByLevel[action.meta.arg] = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchLessonsForLevel.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
export const { selectLevel } = levelSlice.actions;
export default levelSlice.reducer;
