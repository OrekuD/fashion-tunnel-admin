import { CPA, UsersState } from "../types";
import { createSlice } from "@reduxjs/toolkit";
import productsAsyncActions from "../actions/products.action";
import Product from "../../models/Product";
import postRequest from "../postRequest";
import postErrorRequest from "../postErrorRequest";
import usersAsyncActions from "../actions/users.action";
import User from "../../models/User";
import OkResponse from "../../network/responses/OkResponse";
import UsersResponse from "../../network/responses/UsersResponse";

const initialState: UsersState = {
  list: [],
  meta: {
    currentPage: -1,
    nextPage: -1,
    totalPages: -1,
    pageSize: -1,
  },
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
      action: CPA<UsersResponse>
    ) => {
      state.list = action.payload.list;
      state.meta = action.payload.meta;
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

export const usersActions = slice.actions;

export default slice.reducer;
