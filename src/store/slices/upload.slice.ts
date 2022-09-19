import { createSlice } from "@reduxjs/toolkit";
import ErrorResponse from "../../network/responses/ErrorResponse";
import ImageUploadResponse from "../../network/responses/ImageUploadResponse";
import productsAsyncActions from "../actions/products.action";
import uploadAsyncActions from "../actions/upload.action";
import postErrorRequest from "../postErrorRequest";
import postRequest from "../postRequest";
import { CPA, UploadState } from "../types";

const initialState: UploadState = {
  images: [],
};

const slice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: {
    [uploadAsyncActions.index.fulfilled.type]: (
      state,
      action: CPA<ImageUploadResponse>
    ) => {
      state.images = action.payload.images;
      postRequest(action);
    },
    [uploadAsyncActions.index.rejected.type]: (
      state,
      action: CPA<ErrorResponse>
    ) => {
      postErrorRequest(state, action, initialState);
    },
    [productsAsyncActions.createProduct.fulfilled.type]: () => initialState,
  },
});

export const uiActions = slice.actions;

export default slice.reducer;
