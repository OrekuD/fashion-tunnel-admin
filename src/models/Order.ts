import OrderStatus from "../namespace/OrderStatus";
import { DetailedOrderProduct, OrderStatusTimeStamp } from "../types";
import User from "./User";

export default interface Order {
  id: string;
  total: number;
  subtotal: number;
  discount: number;
  products: Array<DetailedOrderProduct>;
  user: User;
  orderNumber: number;
  status: OrderStatus.Status;
  createdAt: string;
  statusTimeStamps: Array<OrderStatusTimeStamp>;
}
