import { CPA, ProductState } from "../types";
import { createSlice } from "@reduxjs/toolkit";
import postRequest from "../postRequest";
import postErrorRequest from "../postErrorRequest";
import productsAsyncActions from "../actions/products.action";
import Product from "../../models/Product";

const initialState: ProductState = {
  product: null,
};

const slice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: {
    [productsAsyncActions.getProduct.fulfilled.type]: (
      state,
      action: CPA<Product>
    ) => {
      state.product = action.payload;
      postRequest(action);
    },
    [productsAsyncActions.getProduct.rejected.type]: (
      state,
      action: CPA<any>
    ) => {
      state.product = null;
      postErrorRequest(action, action, initialState);
    },
    [productsAsyncActions.updateProduct.fulfilled.type]: (
      state,
      action: CPA<Product>
    ) => {
      const isProduct = state.product?.id === action.payload.id;
      if (isProduct) {
        state.product = action.payload;
        return;
      }
    },
  },
});

export const productActions = slice.actions;

export default slice.reducer;
