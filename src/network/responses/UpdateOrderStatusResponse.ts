import OrderStatus from "../../namespace/OrderStatus";

export default interface UpdateOrderStatusResponse {
  orderId: string;
  status: OrderStatus.Status;
  time: string;
}
