import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import API from "../../constants/api";
import User from "../../models/User";
import PaginatedRequest from "../../network/requests/PaginatedRequest";
import OkResponse from "../../network/responses/OkResponse";
import UsersResponse from "../../network/responses/UsersResponse";
import { requestActions } from "../slices/request.slice";

const index = createAsyncThunk(
  "users/index",
  async (payload: PaginatedRequest, thunkApi) => {
    thunkApi.dispatch(requestActions.started(index.typePrefix));
    try {
      const response = await API.client.get<any, AxiosResponse<UsersResponse>>(
        `/admin/users?page=${payload.page}&size=${payload.size}`
      );

      thunkApi.dispatch(requestActions.beforeFulfilled(index.typePrefix));
      return response.data;
    } catch (error) {
      thunkApi.dispatch(requestActions.beforeRejected(index.typePrefix));
      return thunkApi.rejectWithValue({ error });
    }
  }
);

const getUser = createAsyncThunk(
  "users/get",
  async (userId: string, thunkApi) => {
    thunkApi.dispatch(requestActions.started(getUser.typePrefix));
    try {
      const response = await API.client.get<any, AxiosResponse<User>>(
        `/admin/users/${userId}`
      );

      thunkApi.dispatch(requestActions.beforeFulfilled(getUser.typePrefix));
      return response.data;
    } catch (error) {
      thunkApi.dispatch(requestActions.beforeRejected(getUser.typePrefix));
      return thunkApi.rejectWithValue({ error });
    }
  }
);

const deleteUser = createAsyncThunk(
  "users/delete",
  async (userId: string, thunkApi) => {
    thunkApi.dispatch(requestActions.started(deleteUser.typePrefix));
    try {
      const response = await API.client.delete<any, AxiosResponse<OkResponse>>(
        `/admin/users/${userId}`
      );

      thunkApi.dispatch(requestActions.beforeFulfilled(deleteUser.typePrefix));
      return { ...response.data, userId };
    } catch (error) {
      thunkApi.dispatch(requestActions.beforeRejected(deleteUser.typePrefix));
      return thunkApi.rejectWithValue({ error });
    }
  }
);

const usersAsyncActions = {
  index,
  getUser,
  deleteUser,
};

export default usersAsyncActions;
