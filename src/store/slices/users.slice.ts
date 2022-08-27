import { CPA, UsersState } from "../types";
import { createSlice } from "@reduxjs/toolkit";
import productsAsyncActions from "../actions/products.action";
import Product from "../../models/Product";
import postRequest from "../postRequest";
import postErrorRequest from "../postErrorRequest";
import usersAsyncActions from "../actions/users.action";
import User from "../../models/User";
import OkResponse from "../../network/responses/OkResponse";

const initialState: UsersState = {
  list: [],
};

const slice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: {
    [usersAsyncActions.index.fulfilled.type]: (
      state,
      action: CPA<Array<User>>
    ) => {
      state.list = action.payload;
      postRequest(action);
    },
    [usersAsyncActions.index.rejected.type]: (_, action: CPA<any>) => {
      postErrorRequest(action, action, initialState);
    },
    [usersAsyncActions.getUser.fulfilled.type]: (state, action: CPA<User>) => {
      // state.list.unshift(action.payload);
      postRequest(action);
    },
    [usersAsyncActions.getUser.rejected.type]: (_, action: CPA<any>) => {
      postErrorRequest(action, action, initialState);
    },
    [usersAsyncActions.deleteUser.fulfilled.type]: (
      state,
      action: CPA<OkResponse & { userId: string }>
    ) => {
      const userIndex = state.list.findIndex(
        ({ id }) => id === action.payload.userId
      );
      if (userIndex < 0) {
        return;
      }
      state.list.splice(userIndex, 1);
      postRequest(action);
    },
    [usersAsyncActions.deleteUser.rejected.type]: (_, action: CPA<any>) => {
      postErrorRequest(action, action, initialState);
    },
  },
});

export const productActions = slice.actions;

export default slice.reducer;
