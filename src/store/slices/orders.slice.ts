import { CPA, OrdersState } from "../types";
import { createSlice } from "@reduxjs/toolkit";
import postRequest from "../postRequest";
import postErrorRequest from "../postErrorRequest";
import ordersAsyncActions from "../actions/orders.action";
import Order from "../../models/Order";

const initialState: OrdersState = {
  list: [],
};

const slice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: {
    [ordersAsyncActions.index.fulfilled.type]: (
      state,
      action: CPA<Array<Order>>
    ) => {
      state.list = action.payload;
      postRequest(action);
    },
    [ordersAsyncActions.index.rejected.type]: (_, action: CPA<any>) => {
      postErrorRequest(action, action, initialState);
    },
    [ordersAsyncActions.getOrder.fulfilled.type]: (
      state,
      action: CPA<Order>
    ) => {
      state.list.unshift(action.payload);
      postRequest(action);
    },
    [ordersAsyncActions.getOrder.rejected.type]: (_, action: CPA<any>) => {
      postErrorRequest(action, action, initialState);
    },
  },
});

export const productActions = slice.actions;

export default slice.reducer;
