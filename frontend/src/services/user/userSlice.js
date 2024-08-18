import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as userApi from "./user.api";
import { jwtDecode } from "jwt-decode";

// Define a template for user data that reflects the structure of the mongoose schema
const tempUserBody = {
  username: "",
  email: "",
  passwordHash: "",
  displayName: "",
  profilePicture: "",
  dateJoined: new Date().toISOString(),
  lastLogin: null,
  progress: [],
  preferences: {
    language: "vn",
    notificationSettings: {
      emailNotifications: true,
      pushNotifications: false,
    },
  },
  roles: [],
};

const isTokenValid = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp > Date.now() / 1000;
  } catch (error) {
    return false; // Token is invalid or malformed
  }
};

// Use the template for both currentUserData and otherUserData in initialState
const initialState = {
  currentUserData: { ...tempUserBody },
  otherUserData: { ...tempUserBody }, // This can be null or another user's data based on use case
  status: "idle",
  error: null,
};

// Initialize user on app load
export const initializeUser = createAsyncThunk(
  "user/initializeUser",
  async (_, { dispatch }) => {
    const token = localStorage.getItem("userToken");
    if (token && isTokenValid(token)) {
      // Token is valid, fetch the user's data
      dispatch(fetchCurrentUser());
    } else {
      // Token is invalid or not present, dispatch logout to clean up
      dispatch(logout());
    }
  }
);

export const login = createAsyncThunk(
  "user/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await userApi.loginUser(credentials);
      if (!response.success) {
        return rejectWithValue(response.error.message);
      }
      const userData = await userApi.getPrivateUserData(response.data.userId);
      if (!userData.success) {
        return rejectWithValue(userData.error.message);
      }
      return userData.data;
    } catch (error) {
      return rejectWithValue(
        error.message || "An unknown error occurs when trying to login"
      );
    }
  }
);

export const register = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await userApi.createUser(userData);
      if (!response.success) {
        return rejectWithValue(response.error.message);
      }
      const userDetails = await userApi.getPrivateUserData(
        response.data.userId
      );
      if (!userDetails.success) {
        return rejectWithValue(userDetails.error.message);
      }
      return userDetails.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetches data for the logged-in user
export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("userToken");
    if (!token || !isTokenValid(token)) {
      dispatch(logout());
      return rejectWithValue("Session expired. Please log in again.");
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      dispatch(logout());
      return rejectWithValue("No user ID found. Please log in.");
    }
    try {
      if (!userId) throw new Error("Current user ID not found.");
      const response = await userApi.getPrivateUserData(userId);
      return response.data;
    } catch (error) {
      console.log("error: ", error);
      if (error.message.includes("User not found")) {
        dispatch(logout());
        return rejectWithValue("User not found. Please log in again.");
      }
      return rejectWithValue(error.message);
    }
  }
);
// Fetches data for viewing another user's profile
export const fetchOtherUserData = createAsyncThunk(
  "user/fetchOtherUserData",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userApi.getPublicUserData(userId);
      if (!response.success) {
        return rejectWithValue(response.error.message);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetches all users' data
export const fetchAllUsersData = createAsyncThunk(
  "user/fetchAllUsersData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.getAllUsersData();
      if (!response.success) {
        return rejectWithValue(response.error.message);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async ({ userId, updateData }, { getState, rejectWithValue }) => {
    try {
      const { currentUserData } = getState().user;
      if (userId !== currentUserData.userId) {
        throw new Error("Mismatched user ID.");
      }

      const response = await userApi.updateUser(userId, updateData);
      if (!response.success) {
        return rejectWithValue(response.error.message);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Deleting a user
export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userApi.deleteUser(userId);
      if (!response.success) {
        return rejectWithValue(response.error.message);
      }
      return response.data;
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
      state.currentUserData = { ...tempUserBody };
      state.otherUserData = { ...tempUserBody };
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
          state.error = action.payload || "An unknown error occurred.";
        }
      );
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
