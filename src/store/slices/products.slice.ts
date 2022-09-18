import { CPA, ProductsState } from "./../types";
import { createSlice } from "@reduxjs/toolkit";
import productsAsyncActions from "../actions/products.action";
import Product from "../../models/Product";
import postRequest from "../postRequest";
import postErrorRequest from "../postErrorRequest";
import OkResponse from "../../network/responses/OkResponse";

const initialState: ProductsState = {
  list: [],
  meta: {
    currentPage: -1,
    nextPage: -1,
    totalPages: -1,
    pageSize: -1,
  },
};

const slice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: {
    [productsAsyncActions.index.fulfilled.type]: (
      state,
      action: CPA<Array<Product>>
    ) => {
      state.list = action.payload;
      postRequest(action);
    },
    [productsAsyncActions.index.rejected.type]: (_, action: CPA<any>) => {
      postErrorRequest(action, action, initialState);
    },
    [productsAsyncActions.createProduct.fulfilled.type]: (
      state,
      action: CPA<Product>
    ) => {
      state.list.unshift(action.payload);
      postRequest(action);
    },
    [productsAsyncActions.createProduct.rejected.type]: (
      _,
      action: CPA<any>
    ) => {
      postErrorRequest(action, action, initialState);
    },
    [productsAsyncActions.getProduct.fulfilled.type]: (
      state,
      action: CPA<Product>
    ) => {
      const productIndex = state.list.findIndex(
        ({ id }) => id === action.payload.id
      );
      if (productIndex < 0) {
        state.list.unshift(action.payload);
        return;
      }
    },
    [productsAsyncActions.getProduct.rejected.type]: (_, action: CPA<any>) => {
      postErrorRequest(action, action, initialState);
    },
    [productsAsyncActions.deleteProduct.fulfilled.type]: (
      state,
      action: CPA<OkResponse & { productId: string }>
    ) => {
      const productIndex = state.list.findIndex(
        ({ id }) => id === action.payload.productId
      );
      if (productIndex < 0) {
        postRequest(action);
        return;
      }
      state.list.splice(productIndex, 1);
      postRequest(action);
    },
    [productsAsyncActions.deleteProduct.rejected.type]: (
      _,
      action: CPA<any>
    ) => {
      postErrorRequest(action, action, initialState);
    },
    [productsAsyncActions.updateProduct.fulfilled.type]: (
      state,
      action: CPA<Product>
    ) => {
      const productIndex = state.list.findIndex(
        ({ id }) => id === action.payload.id
      );
      if (productIndex < 0) {
        postRequest(action);
        return;
      }
      state.list.splice(productIndex, 1, action.payload);
      postRequest(action);
    },
    [productsAsyncActions.updateProduct.rejected.type]: (
      _,
      action: CPA<any>
    ) => {
      postErrorRequest(action, action, initialState);
    },
  },
});

export const productsActions = slice.actions;

export default slice.reducer;
