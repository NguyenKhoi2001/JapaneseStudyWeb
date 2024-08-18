// lessonSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as lessonApi from "./lesson.api";

const initialState = {
  lessonData: [],
  selectedLesson: {},
  status: "idle",
  error: null,
};

export const fetchLessons = createAsyncThunk(
  "lesson/fetchLessons",
  async (_, { rejectWithValue }) => {
    try {
      const data = await lessonApi.fetchLessons();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchLessonById = createAsyncThunk(
  "lesson/fetchLessonById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await lessonApi.fetchLessonById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchResourceByLesson = createAsyncThunk(
  "lesson/fetchResourceByLesson",
  async (id, { rejectWithValue }) => {
    try {
      const data = await lessonApi.fetchResourceByLesson(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addLesson = createAsyncThunk(
  "lesson/addLesson",
  async (lessonData, { rejectWithValue }) => {
    try {
      const data = await lessonApi.addLesson(lessonData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateLesson = createAsyncThunk(
  "lesson/updateLesson",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const data = await lessonApi.updateLesson(id, updates);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteLesson = createAsyncThunk(
  "lesson/deleteLesson",
  async (id, { rejectWithValue }) => {
    try {
      await lessonApi.deleteLesson(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const modifyLessonItems = createAsyncThunk(
  "lesson/modifyLessonItems",
  async ({ id, add, remove }, { rejectWithValue }) => {
    try {
      const data = await lessonApi.modifyLessonItems(id, { add, remove });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const lessonSlice = createSlice({
  name: "lesson",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLessons.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lessonData = action.payload;
      })
      .addCase(fetchLessonById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedLesson = action.payload;
      })
      .addCase(fetchResourceByLesson.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedLesson.resources = action.payload;
      })
      .addCase(addLesson.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lessonData.push(action.payload);
      })
      .addCase(updateLesson.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.lessonData.findIndex(
          (lesson) => lesson._id === action.payload._id
        );
        state.lessonData[index] = action.payload;
      })
      .addCase(deleteLesson.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lessonData = state.lessonData.filter(
          (lesson) => lesson._id !== action.payload
        );
      })
      .addCase(modifyLessonItems.fulfilled, (state, action) => {
        const index = state.lessonData.findIndex(
          (lesson) => lesson._id === action.meta.arg.id
        );
        if (index !== -1) {
          state.lessonData[index] = {
            ...state.lessonData[index],
            ...action.payload,
          };
        }
        state.status = "succeeded";
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        }
      );
  },
});

export default lessonSlice.reducer;
