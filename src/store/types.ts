import { PayloadAction } from "@reduxjs/toolkit";
import Order from "../models/Order";
import Product from "../models/Product";
import User from "../models/User";

export interface AuthenticationState {
  isAuthenticated: boolean;
  accessToken: string;
  expiryAt: number;
}

export interface UIState {
  isCartVisible: boolean;
  isProfileVisible: boolean;
}

export interface ProductsState {
  list: Array<Product>;
}

export interface OrdersState {
  list: Array<Order>;
}

export interface IncomeState {
  amount: number;
}
export interface UsersState {
  list: Array<User>;
}

export type CPA<T = any> = PayloadAction<T> & { dispatch: Function };
