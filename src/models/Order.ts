import OrderStatus from "../namespace/OrderStatus";
import { DetailedOrderProduct, OrderProduct } from "../types";
import User from "./User";

export default interface Order {
  id: string;
  total: number;
  subtotal: number;
  discount: number;
  products: Array<DetailedOrderProduct>;
  user: User;
  orderNumber: number;
  orderStatus: OrderStatus.Status;
  createdAt: string;
}
