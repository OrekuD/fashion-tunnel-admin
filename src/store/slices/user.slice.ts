import {
  createSlice,
  PayloadAction as PA,
  PayloadAction,
} from "@reduxjs/toolkit";
import User from "../../models/User";

const initialState = {};

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {},
});

export const userActions = slice.actions;

export default slice.reducer;
