import OrderStatus from "../namespace/OrderStatus";
import { OrderProduct } from "../types";
import User from "./User";

export default interface Order {
  id: string;
  total: number;
  subtotal: number;
  discount: number;
  products: Array<OrderProduct>;
  user: User;
  orderNumber: number;
  orderStatus: OrderStatus.Status;
  createdAt: string;
}
