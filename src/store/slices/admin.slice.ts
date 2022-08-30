import {
  createSlice,
  PayloadAction as PA,
  PayloadAction,
} from "@reduxjs/toolkit";
import User from "../../models/User";

const initialState = {};

const slice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
});

export const adminActions = slice.actions;

export default slice.reducer;
