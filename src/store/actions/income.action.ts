import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import API from "../../constants/api";
import { requestActions } from "../slices/request.slice";

const index = createAsyncThunk("icome/index", async (_, thunkApi) => {
  thunkApi.dispatch(requestActions.started(index.typePrefix));
  try {
    const response = await API.client.get<
      any,
      AxiosResponse<{ amount: number }>
    >("/admin/income");

    // console.log({ data: response.data });
    thunkApi.dispatch(requestActions.beforeFulfilled(index.typePrefix));
    return response.data;
  } catch (error) {
    thunkApi.dispatch(requestActions.beforeRejected(index.typePrefix));
    return thunkApi.rejectWithValue({ error });
  }
});

const incomeAsyncActions = {
  index,
};

export default incomeAsyncActions;
