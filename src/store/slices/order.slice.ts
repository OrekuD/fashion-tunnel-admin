import { CPA, OrderState } from "../types";
import { createSlice } from "@reduxjs/toolkit";
import postRequest from "../postRequest";
import postErrorRequest from "../postErrorRequest";
import ordersAsyncActions from "../actions/orders.action";
import { DetailedOrderProduct } from "../../types";
import Order from "../../models/Order";

const initialState: OrderState = {
  order: null,
};

const slice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: {
    [ordersAsyncActions.getOrder.fulfilled.type]: (
      state,
      action: CPA<Order>
    ) => {
      state.order = action.payload;
      postRequest(action);
    },
    [ordersAsyncActions.getOrder.rejected.type]: (state, action: CPA<any>) => {
      state.order = null;
      postErrorRequest(action, action, initialState);
    },
  },
});

export const orderActions = slice.actions;

export default slice.reducer;
