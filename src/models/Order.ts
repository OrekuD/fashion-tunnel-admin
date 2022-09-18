import OrderStatus from "../namespace/OrderStatus";
import { DetailedOrderProduct, OrderStatusTimeStamp } from "../types";
import User from "./User";
import UserAddress from "./UserAddress";

export default interface Order {
  id: string;
  total: number;
  subtotal: number;
  discount: number;
  products: Array<DetailedOrderProduct>;
  deliveryAddress: UserAddress;
  user: User;
  orderNumber: number;
  status: OrderStatus.Status;
  createdAt: string;
  statusTimeStamps: Array<OrderStatusTimeStamp>;
}
