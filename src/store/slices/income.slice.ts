import { CPA, IncomeState, OrdersState } from "../types";
import { createSlice } from "@reduxjs/toolkit";
import postRequest from "../postRequest";
import postErrorRequest from "../postErrorRequest";
import incomeAsyncActions from "../actions/income.action";
import Income from "../../models/Income";

const initialState: IncomeState = {
  total: 0,
};

const slice = createSlice({
  name: "income",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: {
    [incomeAsyncActions.index.fulfilled.type]: (state, action: CPA<Income>) => {
      state.total = action.payload.total;
      postRequest(action);
    },
    [incomeAsyncActions.index.rejected.type]: (_, action: CPA<any>) => {
      postErrorRequest(action, action, initialState);
    },
  },
});

export const incomeActions = slice.actions;

export default slice.reducer;
