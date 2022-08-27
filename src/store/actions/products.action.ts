import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import API from "../../constants/api";
import Product from "../../models/Product";
import { requestActions } from "../slices/request.slice";

const index = createAsyncThunk("products/index", async (_, thunkApi) => {
  thunkApi.dispatch(requestActions.started(index.typePrefix));
  try {
    const response = await API.client.get<any, AxiosResponse<Array<Product>>>(
      "/products"
    );

    // console.log({ d: response.data[0] });
    thunkApi.dispatch(requestActions.beforeFulfilled(index.typePrefix));
    return response.data;
  } catch (error) {
    console.log({ error });
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
      // console.log({response: response.data})
      thunkApi.dispatch(requestActions.beforeFulfilled(getProduct.typePrefix));

      return response.data;
    } catch (error) {
      console.log({ error: error });
      thunkApi.dispatch(requestActions.beforeRejected(getProduct.typePrefix));
      return thunkApi.rejectWithValue({ error });
    }
  }
);

const productsAsyncActions = {
  index,
  getProduct,
};

export default productsAsyncActions;
