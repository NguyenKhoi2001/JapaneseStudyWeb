import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as vocabularyAPI from "./vocabulary.api";

export const fetchAllVocabularies = createAsyncThunk(
  "vocabularies/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await vocabularyAPI.fetchVocabularies();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getVocabulary = createAsyncThunk(
  "vocabularies/getById",
  async (id, { rejectWithValue }) => {
    try {
      return await vocabularyAPI.fetchVocabularyById(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createVocabulary = createAsyncThunk(
  "vocabularies/create",
  async (vocabularyData, { rejectWithValue }) => {
    try {
      return await vocabularyAPI.addVocabulary(vocabularyData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateVocabulary = createAsyncThunk(
  "vocabularies/update",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      return await vocabularyAPI.updateVocabulary(id, updates);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeVocabulary = createAsyncThunk(
  "vocabularies/delete",
  async (id, { rejectWithValue }) => {
    try {
      return await vocabularyAPI.deleteVocabulary(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

const vocabularySlice = createSlice({
  name: "vocabularies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllVocabularies.fulfilled, (state, action) => {
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.status = "succeeded";
      })
      .addCase(createVocabulary.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.status = "succeeded";
      })
      .addCase(updateVocabulary.fulfilled, (state, action) => {
        const index = state.items.findIndex((v) => v.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.status = "succeeded";
      })
      .addCase(removeVocabulary.fulfilled, (state, action) => {
        state.items = state.items.filter((v) => v.id !== action.payload);
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

export default vocabularySlice.reducer;
