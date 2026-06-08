// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// 1. Type definitions

// shape of a user object

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

// Shape of credentials a user submits to login
export interface LoginCredentials {
  username: string;
  email: string;
}

// shape of entire auth slice of state

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// 2. Load from localStorage if available

const loadUserFromStorage = (): User | null => {
  try {
    const serialized = localStorage.getItem("auth_user");
    return serialized ? (JSON.parse(serialized) as User) : null;
  } catch (error) {
    console.error("Failed to load user from localStorage", error);
    return null;
  }
};

// 3. Initial state

const storedUser = loadUserFromStorage();

const initialState: AuthState = {
  user: storedUser,
  isAuthenticated: storedUser !== null, // already logged in if user exists
  loading: false,
  error: null,
};

// 4. Async Thunks

// createAsyncThunk takes two arguments:
// - a string prefix for the action types it generates
// - An async function (actual work to do)

// the generic parameters are: <ReturnType (user), ArgumentType(credentials)>
// meaning: what the async function returns, and what argument it receives
// tell the thunk what types to expect
// User -> what the async function returns when it suucceeds. This becomes the action.payload in the fulfilled case. TS knows action.payload is a User object, not unknown.
// LoginCredentials -> what arguments the thunk expects when you dispatch it
// so when you call dispatch(loginUser({username: "abc", email: ""})), TS knows the argument must be an object with username and email strings."
export const loginUser = createAsyncThunk<User, LoginCredentials>(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    try {
      console.log("Logging in with credentials:", credentials);
      console.log("Username:", credentials.username);
      console.log("Email:", credentials.email);
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users",
      );

      if (!response.ok) {
        return thunkAPI.rejectWithValue("Failed to fetch users");
      }

      const users: User[] = await response.json();

      // find a user whose username and email match what was submitted

      const match = users.find(
        (u) =>
          u.username.toLowerCase() === credentials.username.toLowerCase() &&
          u.email.toLowerCase() === credentials.email.toLowerCase(),
      );

      if (!match) {
        return thunkAPI.rejectWithValue("Invalid username or email");
      }

      localStorage.setItem("auth_user", JSON.stringify(match));

      return match;
    } catch (err) {
      return thunkAPI.rejectWithValue("An error occurred during login");
    }
  },
);

export const registerUser = createAsyncThunk<User, LoginCredentials>(
  "auth/registerUser",
  async (credentials, thunkAPI) => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        },
      );

      if (!response.ok) {
        return thunkAPI.rejectWithValue("Failed to register user");
      }

      const user: User = await response.json();
      localStorage.setItem("auth_user", JSON.stringify(user));

      return user;
    } catch (err) {
      return thunkAPI.rejectWithValue("An error occurred during registration");
    }
  },
);

// 5. The slice

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    //sync action
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("auth_user");
    },

    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    //login
    // handling the three possible states of the async thunk: pending, fulfilled, rejected
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        // API call succeeded - action.payload is the user returned by the thunk
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        // API call failed - action.payload is the error message returned by the thunk
        state.loading = false;
        state.error = action.payload as string;
      });

    // register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// export sync actions creators
export const { logout, clearError } = authSlice.actions;

// export the reducer
export default authSlice.reducer;
