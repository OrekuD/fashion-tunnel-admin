import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import API from "../../constants/api";
import Order from "../../models/Order";
import UpdateOrderStatusRequest from "../../network/requests/UpdateOrderStatusRequest";
import { requestActions } from "../slices/request.slice";

const getOrder = createAsyncThunk(
  "order/get",
  async (orderId: string, thunkApi) => {
    thunkApi.dispatch(requestActions.started(getOrder.typePrefix));
    try {
      const response = await API.client.get<any, AxiosResponse<Order>>(
        `/admin/orders/${orderId}`
      );
      thunkApi.dispatch(requestActions.beforeFulfilled(getOrder.typePrefix));

      return response.data;
    } catch (error) {
      // console.log({ ____error: (error as any)?.list });
      thunkApi.dispatch(requestActions.beforeRejected(getOrder.typePrefix));
      return thunkApi.rejectWithValue({ error });
    }
  }
);

const updateOrderStatus = createAsyncThunk(
  "order/update-status",
  async (payload: UpdateOrderStatusRequest, thunkApi) => {
    thunkApi.dispatch(requestActions.started(updateOrderStatus.typePrefix));
    try {
      const response = await API.client.put<
        any,
        AxiosResponse<UpdateOrderStatusRequest>
      >(`/admin/orders/${payload.orderId}/update-status`, {
        status: payload.status,
      });
      console.log({ response: response.data });
      thunkApi.dispatch(
        requestActions.beforeFulfilled(updateOrderStatus.typePrefix)
      );

      return response.data;
    } catch (error) {
      console.log({ ____error: (error as any)?.list });
      thunkApi.dispatch(
        requestActions.beforeRejected(updateOrderStatus.typePrefix)
      );
      return thunkApi.rejectWithValue({ error });
    }
  }
);

const orderAsyncActions = {
  getOrder,
  updateOrderStatus,
  // deleteProduct,
};

export default orderAsyncActions;
