import OrderStatus from "../namespace/OrderStatus";
import { OrderProduct } from "../types";
import User from "./User";

export default interface SimpleOrder {
  id: string;
  total: number;
  orderNumber: number;
  numberOfProducts: number;
  orderStatus: OrderStatus.Status;
  user: {
    id: string;
    email: string;
  };
  createdAt: string;
}
