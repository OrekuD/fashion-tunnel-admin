import OrderStatus from "../namespace/OrderStatus";
import { OrderProduct, OrderStatusTimeStamp } from "../types";
import User from "./User";

export default interface SimpleOrder {
  id: string;
  total: number;
  orderNumber: number;
  numberOfProducts: number;
  status: OrderStatus.Status;
  statusTimeStamps: Array<OrderStatusTimeStamp>;
  user: {
    id: string;
    email: string;
    profilePicture: string;
  };
  createdAt: string;
}
