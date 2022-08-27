import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import API from "../../constants/api";
import Product from "../../models/Product";
import OkResponse from "../../network/responses/OkResponse";
import { requestActions } from "../slices/request.slice";

const index = createAsyncThunk("products/index", async (_, thunkApi) => {
  thunkApi.dispatch(requestActions.started(index.typePrefix));
  try {
    const response = await API.client.get<any, AxiosResponse<Array<Product>>>(
      "/products"
    );

    thunkApi.dispatch(requestActions.beforeFulfilled(index.typePrefix));
    return response.data;
  } catch (error) {
    thunkApi.dispatch(requestActions.beforeRejected(index.typePrefix));
    return thunkApi.rejectWithValue({ error });
  }
});

const getProduct = createAsyncThunk(
  "products/get",
  async (productId: string, thunkApi) => {
    thunkApi.dispatch(requestActions.started(getProduct.typePrefix));
    try {
      const response = await API.client.get<any, AxiosResponse<Product>>(
        `/products/${productId}`
      );
      thunkApi.dispatch(requestActions.beforeFulfilled(getProduct.typePrefix));

      return response.data;
    } catch (error) {
      thunkApi.dispatch(requestActions.beforeRejected(getProduct.typePrefix));
      return thunkApi.rejectWithValue({ error });
    }
  }
);

const deleteProduct = createAsyncThunk(
  "products/delete",
  async (productId: string, thunkApi) => {
    thunkApi.dispatch(requestActions.started(deleteProduct.typePrefix));
    try {
      const response = await API.client.delete<any, AxiosResponse<OkResponse>>(
        `/admin/products/${productId}`
      );

      thunkApi.dispatch(
        requestActions.beforeFulfilled(deleteProduct.typePrefix)
      );
      return { ...response.data, productId };
    } catch (error) {
      // console.log({ error });
      thunkApi.dispatch(
        requestActions.beforeRejected(deleteProduct.typePrefix)
      );
      return thunkApi.rejectWithValue({ error });
    }
  }
);

const productsAsyncActions = {
  index,
  getProduct,
  deleteProduct,
};

export default productsAsyncActions;
