import { PayloadAction } from "@reduxjs/toolkit";
import Order from "../models/Order";
import Product from "../models/Product";
import SimpleOrder from "../models/SimpleOrder";
import User from "../models/User";
import { Chart, DetailedOrderProduct } from "../types";

export interface AuthenticationState {
  isAuthenticated: boolean;
  accessToken: string;
  expiryAt: number;
}

export interface UIState {
  isCartVisible: boolean;
  isProfileVisible: boolean;
}
export interface UploadState {
  images: Array<string>;
}

export interface ProductsState {
  list: Array<Product>;
  meta: PaginatedMeta;
}

export interface PaginatedMeta {
  totalPages: number;
  currentPage: number;
  nextPage: number;
  pageSize: number;
}

export interface OrdersState {
  list: Array<SimpleOrder>;
  meta: PaginatedMeta;
}

export interface IncomeState {
  total: number;
}

export interface SummaryState {
  income: number;
  customers: number;
  orders: number;
  products: number;
  chart: Array<Chart>;
}

export interface UsersState {
  list: Array<User>;
  meta: PaginatedMeta;
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
