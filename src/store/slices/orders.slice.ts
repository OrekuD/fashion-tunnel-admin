import { CPA, OrdersState } from "../types";
import { createSlice } from "@reduxjs/toolkit";
import postRequest from "../postRequest";
import postErrorRequest from "../postErrorRequest";
import ordersAsyncActions from "../actions/orders.action";
import Order from "../../models/Order";
import SimpleOrder from "../../models/SimpleOrder";
import orderAsyncActions from "../actions/order.action";
import UpdateOrderStatusResponse from "../../network/responses/UpdateOrderStatusResponse";

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
      action: CPA<Array<SimpleOrder>>
    ) => {
      state.list = action.payload;
      postRequest(action);
    },
    [ordersAsyncActions.index.rejected.type]: (_, action: CPA<any>) => {
      postErrorRequest(action, action, initialState);
    },
    [orderAsyncActions.updateOrderStatus.fulfilled.type]: (
      state,
      action: CPA<UpdateOrderStatusResponse>
    ) => {
      const orderIndex = state.list.findIndex(
        ({ id }) => id === action.payload.orderId
      );
      if (orderIndex < 0) {
        return;
      }
      state.list.splice(orderIndex, 1, {
        ...state.list[orderIndex],
        orderStatus: action.payload.status,
      });
    },
  },
});

export const ordersActions = slice.actions;

export default slice.reducer;
