import { PayloadAction } from "@reduxjs/toolkit";
import Order from "../models/Order";
import Product from "../models/Product";
import SimpleOrder from "../models/SimpleOrder";
import User from "../models/User";
import { DetailedOrderProduct } from "../types";

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
  list: Array<SimpleOrder>;
}

export interface IncomeState {
  total: number;
}
export interface UsersState {
  list: Array<User>;
}

export interface OrderState {
  order: Order | null;
}

export interface ProductState {
  product: Product | null;
}

export interface UserState {
  user: User | null;
}

export type CPA<T = any> = PayloadAction<T> & { dispatch: Function };
