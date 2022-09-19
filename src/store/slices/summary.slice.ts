import { CPA, SummaryState } from "../types";
import { createSlice } from "@reduxjs/toolkit";
import postRequest from "../postRequest";
import postErrorRequest from "../postErrorRequest";
import Summary from "../../models/Summary";
import summaryAsyncActions from "../actions/summary.action";

const initialState: SummaryState = {
  customers: 0,
  income: 0,
  orders: 0,
  products: 0,
  chart: [],
};

const slice = createSlice({
  name: "summary",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: {
    [summaryAsyncActions.index.fulfilled.type]: (
      state,
      action: CPA<Summary>
    ) => {
      state.customers = action.payload.customers;
      state.income = action.payload.income;
      state.orders = action.payload.orders;
      state.products = action.payload.products;
      state.chart = action.payload.chart;
      postRequest(action);
    },
    [summaryAsyncActions.index.rejected.type]: (_, action: CPA<any>) => {
      postErrorRequest(action, action, initialState);
    },
  },
});

export const incomeActions = slice.actions;

export default slice.reducer;
