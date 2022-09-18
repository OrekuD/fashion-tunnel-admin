import { CPA, OrdersState } from "../types";
import { createSlice } from "@reduxjs/toolkit";
import postRequest from "../postRequest";
import postErrorRequest from "../postErrorRequest";
import ordersAsyncActions from "../actions/orders.action";
import Order from "../../models/Order";
import SimpleOrder from "../../models/SimpleOrder";
import orderAsyncActions from "../actions/order.action";
import UpdateOrderStatusResponse from "../../network/responses/UpdateOrderStatusResponse";
import OrdersResponse from "../../network/responses/OrdersResponse";

const initialState: OrdersState = {
  list: [],
  meta: {
    currentPage: -1,
    nextPage: -1,
    totalPages: -1,
    pageSize: -1,
  },
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
      action: CPA<OrdersResponse>
    ) => {
      state.list = action.payload.list;
      state.meta = action.payload.meta;
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
      const statusTimeStamps = state.list[orderIndex].statusTimeStamps;
      const timeStampIndex = statusTimeStamps.findIndex(
        ({ status }) => status === action.payload.status
      );
      if (timeStampIndex < 0) {
        statusTimeStamps.unshift({
          status: action.payload.status,
          time: action.payload.time,
        });
      } else {
        statusTimeStamps.splice(timeStampIndex, 1, {
          status: action.payload.status,
          time: action.payload.time,
        });
      }
      state.list.splice(orderIndex, 1, {
        ...state.list[orderIndex],
        status: action.payload.status,
        statusTimeStamps,
      });
    },
  },
});

export const ordersActions = slice.actions;

export default slice.reducer;
