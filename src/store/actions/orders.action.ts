import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import API from "../../constants/api";
import Order from "../../models/Order";
import PaginatedRequest from "../../network/requests/PaginatedRequest";
import OrdersResponse from "../../network/responses/OrdersResponse";
import { requestActions } from "../slices/request.slice";

const index = createAsyncThunk(
  "orders/index",
  async (payload: PaginatedRequest, thunkApi) => {
    thunkApi.dispatch(requestActions.started(index.typePrefix));
    try {
      const response = await API.client.get<any, AxiosResponse<OrdersResponse>>(
        `/admin/orders?page=${payload.page}&size=${payload.size}`
      );

      // console.log({ data: response.data });
      thunkApi.dispatch(requestActions.beforeFulfilled(index.typePrefix));
      return response.data;
    } catch (error) {
      // console.log({ ____error: error });
      thunkApi.dispatch(requestActions.beforeRejected(index.typePrefix));
      return thunkApi.rejectWithValue({ error });
    }
  }
);

const getOrder = createAsyncThunk(
  "orders/get",
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

// const deleteProduct = createAsyncThunk(
//   "orders/delete",
//   async (orderId: string, thunkApi) => {
//     thunkApi.dispatch(requestActions.started(deleteProduct.typePrefix));
//     try {
//       const response = await API.client.delete<any, AxiosResponse<OkResponse>>(
//         `/admin/orders/${orderId}`
//       );

//       thunkApi.dispatch(
//         requestActions.beforeFulfilled(deleteProduct.typePrefix)
//       );
//       return { ...response.data, productId: orderId };
//     } catch (error) {
//       // console.log({ error });
//       thunkApi.dispatch(
//         requestActions.beforeRejected(deleteProduct.typePrefix)
//       );
//       return thunkApi.rejectWithValue({ error });
//     }
//   }
// );

const ordersAsyncActions = {
  index,
  getOrder,
  // deleteProduct,
};

export default ordersAsyncActions;
