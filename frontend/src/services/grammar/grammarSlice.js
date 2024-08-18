// grammarSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as grammarApi from "./grammar.api";

const initialState = {
  grammarData: [],
  selectedGrammar: {},
  status: "idle",
  error: null,
};

// Thunk functions
export const fetchGrammars = createAsyncThunk(
  "grammar/fetchGrammars",
  async (_, { rejectWithValue }) => {
    try {
      return await grammarApi.fetchGrammars();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchGrammarById = createAsyncThunk(
  "grammar/fetchGrammarById",
  async (id, { rejectWithValue }) => {
    try {
      return await grammarApi.fetchGrammarById(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addGrammar = createAsyncThunk(
  "grammar/addGrammar",
  async (grammarData, { rejectWithValue }) => {
    try {
      return await grammarApi.addGrammar(grammarData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateGrammar = createAsyncThunk(
  "grammar/updateGrammar",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      return await grammarApi.updateGrammar(id, updates);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteGrammar = createAsyncThunk(
  "grammar/deleteGrammar",
  async (id, { rejectWithValue }) => {
    try {
      await grammarApi.deleteGrammar(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const grammarSlice = createSlice({
  name: "grammar",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGrammars.fulfilled, (state, action) => {
        state.grammarData = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchGrammarById.fulfilled, (state, action) => {
        state.selectedGrammar = action.payload;
        state.status = "succeeded";
      })
      .addCase(addGrammar.fulfilled, (state, action) => {
        state.grammarData.push(action.payload);
        state.status = "succeeded";
      })
      .addCase(updateGrammar.fulfilled, (state, action) => {
        const index = state.grammarData.findIndex(
          (g) => g._id === action.payload._id
        );
        state.grammarData[index] = action.payload;
        state.status = "succeeded";
      })
      .addCase(deleteGrammar.fulfilled, (state, action) => {
        state.grammarData = state.grammarData.filter(
          (g) => g._id !== action.payload
        );
        state.status = "succeeded";
      })
      .addMatcher(
        (action) =>
          action.type.startsWith("grammar/") &&
          action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("grammar/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        }
      );
  },
});

export default grammarSlice.reducer;
