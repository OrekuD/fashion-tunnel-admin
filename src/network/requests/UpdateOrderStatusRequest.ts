import OrderStatus from "../../namespace/OrderStatus";

export default interface UpdateOrderStatusRequest {
  orderId: string;
  status: OrderStatus.Status;
}
