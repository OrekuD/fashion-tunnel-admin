import { CPA, UserState } from "../types";
import { createSlice } from "@reduxjs/toolkit";
import postRequest from "../postRequest";
import postErrorRequest from "../postErrorRequest";
import usersAsyncActions from "../actions/users.action";
import User from "../../models/User";

const initialState: UserState = {
  user: null,
};

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: {
    [usersAsyncActions.getUser.fulfilled.type]: (state, action: CPA<User>) => {
      state.user = action.payload;
      postRequest(action);
    },
    [usersAsyncActions.getUser.rejected.type]: (state, action: CPA<any>) => {
      state.user = null;
      postErrorRequest(action, action, initialState);
    },
  },
});

export const userActions = slice.actions;

export default slice.reducer;
