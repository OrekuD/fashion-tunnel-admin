import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import API from "../../constants/api";
import Product from "../../models/Product";
import CreateProductRequest from "../../network/requests/CreateProductRequest";
import PaginatedRequest from "../../network/requests/PaginatedRequest";
import UpdateProductRequest from "../../network/requests/UpdateProductRequest";
import OkResponse from "../../network/responses/OkResponse";
import ProductsResponse from "../../network/responses/ProductsResponse";
import { requestActions } from "../slices/request.slice";

const index = createAsyncThunk(
  "products/index",
  async (payload: PaginatedRequest, thunkApi) => {
    thunkApi.dispatch(requestActions.started(index.typePrefix));
    try {
      const response = await API.client.get<
        any,
        AxiosResponse<ProductsResponse>
      >(`/admin/products?page=${payload.page}&size=${payload.size}`);

      thunkApi.dispatch(requestActions.beforeFulfilled(index.typePrefix));
      return response.data;
    } catch (error) {
      thunkApi.dispatch(requestActions.beforeRejected(index.typePrefix));
      return thunkApi.rejectWithValue({ error });
    }
  }
);

const getProduct = createAsyncThunk(
  "products/get",
  async (productId: string, thunkApi) => {
    thunkApi.dispatch(requestActions.started(getProduct.typePrefix));
    try {
      const response = await API.client.get<any, AxiosResponse<Product>>(
        `/admin/products/${productId}`
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

const createProduct = createAsyncThunk(
  "products/create",
  async (payload: CreateProductRequest, thunkApi) => {
    thunkApi.dispatch(requestActions.started(createProduct.typePrefix));
    try {
      const response = await API.client.post<
        CreateProductRequest,
        AxiosResponse<Product>
      >(`/admin/products`, payload);
      thunkApi.dispatch(
        requestActions.beforeFulfilled(createProduct.typePrefix)
      );

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        requestActions.beforeRejected(createProduct.typePrefix)
      );
      return thunkApi.rejectWithValue({ error });
    }
  }
);

const updateProduct = createAsyncThunk(
  "products/update",
  async (payload: UpdateProductRequest, thunkApi) => {
    thunkApi.dispatch(requestActions.started(updateProduct.typePrefix));
    const { id, ...body } = payload;

    try {
      const response = await API.client.put<
        UpdateProductRequest,
        AxiosResponse<Product>
      >(`/admin/products/${id}`, body);
      thunkApi.dispatch(
        requestActions.beforeFulfilled(updateProduct.typePrefix)
      );

      return response.data;
    } catch (error) {
      thunkApi.dispatch(
        requestActions.beforeRejected(updateProduct.typePrefix)
      );
      return thunkApi.rejectWithValue({ error });
    }
  }
);

const productsAsyncActions = {
  index,
  getProduct,
  deleteProduct,
  createProduct,
  updateProduct,
};

export default productsAsyncActions;
