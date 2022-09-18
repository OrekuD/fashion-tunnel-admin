import { CPA, OrderState } from "../types";
import { createSlice } from "@reduxjs/toolkit";
import postRequest from "../postRequest";
import postErrorRequest from "../postErrorRequest";
import orderAsyncActions from "../actions/order.action";
import Order from "../../models/Order";
import UpdateOrderStatusResponse from "../../network/responses/UpdateOrderStatusResponse";
import ErrorResponse from "../../network/responses/ErrorResponse";

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
    [orderAsyncActions.getOrder.fulfilled.type]: (
      state,
      action: CPA<Order>
    ) => {
      state.order = action.payload;
      postRequest(action);
    },
    [orderAsyncActions.getOrder.rejected.type]: (
      _,
      action: CPA<ErrorResponse>
    ) => {
      postErrorRequest(action, action, initialState);
    },
    [orderAsyncActions.updateOrderStatus.fulfilled.type]: (
      state,
      action: CPA<UpdateOrderStatusResponse>
    ) => {
      if (!state?.order) return;
      state.order.status = action.payload.status;
      const statusTimeStamps = state.order.statusTimeStamps;
      const timeStampIndex = state.order.statusTimeStamps.findIndex(
        ({ status }) => status === action.payload.status
      );
      if (timeStampIndex < 0) {
        statusTimeStamps.unshift({
          status: action.payload.status,
          time: action.payload.time,
        });
      } else {
        console.log("--yes");
        statusTimeStamps.splice(timeStampIndex, 1, {
          status: action.payload.status,
          time: action.payload.time,
        });
      }
      state.order.statusTimeStamps = statusTimeStamps;
      postRequest(action);
    },
    [orderAsyncActions.updateOrderStatus.rejected.type]: (
      _,
      action: CPA<ErrorResponse>
    ) => {
      postErrorRequest(action, action, initialState);
    },
  },
});

export const orderActions = slice.actions;

export default slice.reducer;
