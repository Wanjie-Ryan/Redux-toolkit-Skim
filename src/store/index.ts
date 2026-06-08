import { configureStore } from "@reduxjs/toolkit";

// import the authSlice reducer here
import authReducer from "../features/auth/authSlice";

// configureStore creates the store which is a container.
// The reducer field inside it is where you register your slices.
// configureStore = the building
// reducer: {}    = the floors of that building
// authReducer    = one floor (the auth floor)
// postsReducer   = another floor (if you add it later)
export const store = configureStore({
  reducer: {
    // add the auth reducer here
    auth: authReducer,
    // the key auth in the reducer map is what determines where in the state tree this slice lives.
    // you'll read it later as state.auth.user, state.auth.isAuthenticated, etc.
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// store.getState is a redux method that returns entire state object.
// ReturnType is a TypeScript utility type that infers the return type of a function.

//
