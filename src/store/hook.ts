import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./index";

// use these two throughout the app instead of the plain usedispatch and useSelector from react-redux

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// if you used raw useSelector(state => state.auth) everywhere. TS would type state as unknown - it has no idea what your store looks like.
// with useAppSelector, TS already knows the full shape of rootstate, so you get autocomplete and type safety
// useAppDispatch - it knows dispatch can handle thunks
// hook.ts just exports these hooks to be used globally instead of importing in each and every file. It's a common pattern in Redux Toolkit projects.
