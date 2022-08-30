import { CPA, IncomeState, OrdersState } from "../types";
import { createSlice } from "@reduxjs/toolkit";
import postRequest from "../postRequest";
import postErrorRequest from "../postErrorRequest";
import incomeAsyncActions from "../actions/income.action";

const initialState: IncomeState = {
  amount: 0,
};

const slice = createSlice({
  name: "income",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: {
    [incomeAsyncActions.index.fulfilled.type]: (
      state,
      action: CPA<{ amount: number }>
    ) => {
      state.amount = action.payload.amount;
      postRequest(action);
    },
    [incomeAsyncActions.index.rejected.type]: (_, action: CPA<any>) => {
      postErrorRequest(action, action, initialState);
    },
  },
});

export const incomeActions = slice.actions;

export default slice.reducer;
