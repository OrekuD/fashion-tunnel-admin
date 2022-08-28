namespace OrderStatus {
  export enum Status {
    PENDING = 0,
    ACCEPTED = 1,
    PREPARING = 2,
    READY_FOR_DELIVERY = 3,
    DISPATCHED = 4,
    DELIVERED = 5,
    REJECTED = 6,
    REFUNDED = 7,
    CANCELLED = 8,
  }
  export class State {
    private static TEXT: Record<Status, string> = {
      [Status.PENDING]: "Pending approval",
      [Status.ACCEPTED]: "Order accepted",
      [Status.PREPARING]: "Preparing order",
      [Status.READY_FOR_DELIVERY]: "Order ready for delivery",
      [Status.DISPATCHED]: "Order dispatched",
      [Status.DELIVERED]: "Order completed",
      [Status.REJECTED]: "Order rejected",
      [Status.REFUNDED]: "Order refunded",
      [Status.CANCELLED]: "Order cancelled",
    };

    private static DESCRIPTION: Record<Status, string> = {
      [Status.PENDING]:
        "Your Order has been placed successfully, it will be accepted by a Staff Member shortly.",
      [Status.ACCEPTED]:
        "Your order at the dispensary has been placed, please wait as they begin to prepare the order and deliver it to you.",
      [Status.PREPARING]:
        "The dispensary is gathering all the items that you’ve ordered and is preparing to send them for delivery to your location.",
      [Status.READY_FOR_DELIVERY]:
        "Your order is packaged and ready for delivery",
      [Status.DISPATCHED]:
        "Your order is packaged and has been sent out to be delivered to your location from the driver.",
      [Status.DELIVERED]:
        "How did everything go? Feel free to review your order by tapping the button below.",
      [Status.REJECTED]:
        "We’re sorry but your order has been declined by the dispensary",
      [Status.REFUNDED]: "Order refunded",
      [Status.CANCELLED]:
        "We’re sorry but your order has been declined by the dispensary",
    };

    public static text = (status: Status) => State.TEXT[status];

    public static description = (status: Status) => State.DESCRIPTION[status];

    public static list = () =>
      Object.values(Status).filter(
        (item) => typeof item === "number"
      ) as Array<Status>;
  }
}

export default OrderStatus;
