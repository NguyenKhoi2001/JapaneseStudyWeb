// kanjiSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as kanjiApi from "./kanji.api";

// Define a template for kanji data that reflects the structure of the mongoose schema
const tempKanjiBody = {
  character: "",
  meaning: {
    jp: "",
    en: "",
    vi: "",
  },
  sinoVietnameseSounds: "",
  onyomi: [],
  kunyomi: [],
  examples: [],
};

const initialState = {
  kanjiData: [],
  selectedKanji: { ...tempKanjiBody },
  status: "idle",
  error: null,
};

// Fetch all kanjis
export const fetchKanjis = createAsyncThunk(
  "kanji/fetchKanjis",
  async (_, { rejectWithValue }) => {
    try {
      const data = await kanjiApi.fetchKanjis();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch a single kanji by ID
export const fetchKanjiById = createAsyncThunk(
  "kanji/fetchKanjiById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await kanjiApi.fetchKanjiById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add a new kanji
export const addKanji = createAsyncThunk(
  "kanji/addKanji",
  async (kanjiData, { rejectWithValue }) => {
    try {
      const data = await kanjiApi.addKanji(kanjiData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update an existing kanji
export const updateKanji = createAsyncThunk(
  "kanji/updateKanji",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const data = await kanjiApi.updateKanji(id, updates);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete a kanji
export const deleteKanji = createAsyncThunk(
  "kanji/deleteKanji",
  async (id, { rejectWithValue }) => {
    try {
      await kanjiApi.deleteKanji(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const kanjiSlice = createSlice({
  name: "kanji",
  initialState,
  reducers: {
    resetSelectedKanji(state) {
      state.selectedKanji = { ...tempKanjiBody };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchKanjis.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.kanjiData = action.payload;
      })
      .addCase(fetchKanjiById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedKanji = action.payload;
      })
      .addCase(addKanji.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.kanjiData.push(action.payload);
      })
      .addCase(updateKanji.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.kanjiData.findIndex(
          (kanji) => kanji._id === action.payload._id
        );
        state.kanjiData[index] = action.payload;
      })
      .addCase(deleteKanji.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.kanjiData = state.kanjiData.filter(
          (kanji) => kanji._id !== action.payload
        );
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

export const { resetSelectedKanji } = kanjiSlice.actions;

export default kanjiSlice.reducer;
