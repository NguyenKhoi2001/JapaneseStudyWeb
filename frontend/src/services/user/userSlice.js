import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as userApi from "./user.api";

const initialState = {
  currentUserData: null, // Stores logged-in user's data
  otherUserData: null, // Temporarily stores other users' data being viewed
  status: "idle",
  error: null,
};

// Initialize user on app load
export const initializeUser = createAsyncThunk(
  "user/initializeUser",
  async (_, { dispatch }) => {
    const token = localStorage.getItem("userToken");
    const userId = localStorage.getItem("userId");
    if (token && userId) {
      //fetches the user's data
      dispatch(fetchCurrentUser());
    }
  }
);

// Handles user login
export const login = createAsyncThunk(
  "user/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const { userId } = await userApi.loginUser(credentials);
      const userData = await userApi.getUser(userId);
      return userData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Handles new user registration
export const register = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const { userId } = await userApi.createUser(userData);
      const userDetails = await userApi.getUser(userId);
      return userDetails;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetches data for the logged-in user
export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("Current user ID not found.");
      const userData = await userApi.getUser(userId);
      // console.log("Fetched user data: ", userData); // Log fetched data
      return userData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetches data for viewing another user's profile
export const fetchOtherUserData = createAsyncThunk(
  "user/fetchOtherUserData",
  async (userId, { rejectWithValue }) => {
    try {
      const userData = await userApi.getUser(userId);
      return userData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Updates the current user's profile
export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async ({ userId, updateData }, { getState, rejectWithValue }) => {
    try {
      const { currentUserData } = getState().user;
      if (userId !== currentUserData?.userId)
        throw new Error("Mismatched user ID.");
      const updatedUserData = await userApi.updateUser(userId, updateData);
      console.log("current user: " + updatedUserData.json());
      return updatedUserData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUserData = null;
      state.otherUserData = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("userToken");
      localStorage.removeItem("userId");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUserData = action.payload;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUserData = action.payload;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUserData = action.payload;
      })
      .addCase(fetchOtherUserData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.otherUserData = action.payload;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUserData = action.payload;
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

export const { logout } = userSlice.actions;

export default userSlice.reducer;
