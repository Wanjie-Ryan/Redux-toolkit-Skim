# Reduxjs/toolkit - manages the state
- Gives you createSlice, createAsyncThunk, configureStore

# React-Redux - connects React components to the Redux store
- lets your components read and update the states
- Gives you the provider component, useSelector, and useDispatch hooks that let React components talk to Redux store

**ConfigureStore**
- Combines reducers, adds redux-thunk middleware, this is what makes createAsyncThunk (async API calls) work.



# Redux store

- Single JS object that holds the entire application's state. (global state)
- store = {
  auth: {
    user: { id: 1, name: "Ryan", email: "ryan@gmail.com" },
    isAuthenticated: true,
    loading: false,
    error: null
  }
  // other slices would appear here as your app grows
}

# Slice
- A slice of the Redux store that manages a specific piece of state and its related logic.
- A slice owns
    - state (initialState) - what data looks like before anything happens.
    - reducers (sync logic to update the state) - functions that define how state changes.
    - actions - auto generated from reducer names.


# Reducer
- Pure function with this signature: (state, action) => newState
- Given the same inputs, it alwaysa returns the same output.
- It takes the current state, looks at the action that was dispatched, and returns the next state.

- What is an action?
    - Plain JS object that describes what happened.
    - Must have a type property that indicates the type of action being performed.
    - Can have an optional payload property that contains any data needed to perform the action.

- {
  type: "auth/loginUser/fulfilled",  // a string identifier
  payload: { id: 1, name: "Ryan" }   // the data carried with it
}

- When you call dispatch(action), you're sending that object to the store, the sotre passes it to the reducer, which reads action.type and decides what to do with action.payload.

# CreateAsyncThunk
- Redux reducers are sync. Real apps need to make API calls, which are async. createAsyncThunk solves this.
- When dispatched, it goes through 3 automatic lifecyle stages:
- dispatch(loginUser(credentials))
        │
        ├─ 1. auth/loginUser/pending    ← API call started
        │      (set loading: true)
        │
        ├─ 2. auth/loginUser/fulfilled  ← API call succeeded
        │      (set user data, loading: false)
        │
        └─ 3. auth/loginUser/rejected   ← API call failed
               (set error message, loading: false)


- Slice listens for these 3 actions types inside extraReducers and updates state accordingly.
# Difference btn reducers and extraReducers
- reducers: for sync actions defined inside the slice.
- extraReducers - for handling actions that come from outside the slice, like async thunks

- dispatch(loginUser({ username: "Bret", email: "Sincere@april.biz" }))
    │
    │   createAsyncThunk fires the async function
    │
    ├── loginUser.pending   → loading: true
    │
    │   fetch() runs...
    │
    ├── loginUser.fulfilled → user: { id:1, name:"..." }, isAuthenticated: true
    │        OR
    └── loginUser.rejected  → error: "Invalid username or email"

