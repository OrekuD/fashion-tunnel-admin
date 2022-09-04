import React from "react";
import { useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { Button } from "../../components";
import OrderStatus from "../../namespace/OrderStatus";
import orderAsyncActions from "../../store/actions/order.action";
import RequestManager from "../../store/request-manager";
import { useSelectState } from "../../store/selectors";
import { orderActions } from "../../store/slices/order.slice";
import classes from "./index.module.scss";

const OrderPage = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const dispatch = useDispatch();
  const { request, order } = useSelectState();
  const { orderId } = useParams<{ orderId: string }>();

  React.useEffect(() => {
    if (!orderId) return;
    dispatch(orderAsyncActions.getOrder(orderId));
  }, [orderId]);

  const [updatedAt] = React.useState(request.updatedAt);

  React.useEffect(() => {
    if (updatedAt === request.updatedAt) {
      return;
    }
    const RM = new RequestManager(request, dispatch);

    if (RM.isFulfilled(orderAsyncActions.getOrder.typePrefix)) {
      RM.consume(orderAsyncActions.getOrder.typePrefix);
      setIsLoading(false);
      return;
    }

    if (RM.isRejected(orderAsyncActions.getOrder.typePrefix)) {
      RM.consume(orderAsyncActions.getOrder.typePrefix);
      setIsLoading(false);
      return;
    }

    if (RM.isFulfilled(orderAsyncActions.updateOrderStatus.typePrefix)) {
      RM.consume(orderAsyncActions.updateOrderStatus.typePrefix);
      setIsUpdating(false);
      return;
    }

    if (RM.isRejected(orderAsyncActions.updateOrderStatus.typePrefix)) {
      RM.consume(orderAsyncActions.updateOrderStatus.typePrefix);
      setIsUpdating(false);
      return;
    }
  }, [updatedAt, request.updatedAt]);

  const nextStage = () => {
    if (!order?.order) return;
    if (isUpdating) return;

    let nextStage = order.order.status;

    switch (nextStage) {
      case OrderStatus.Status.PENDING:
        nextStage = OrderStatus.Status.ACCEPTED;
        break;
      case OrderStatus.Status.ACCEPTED:
        nextStage = OrderStatus.Status.PROCESSING;
        break;
      case OrderStatus.Status.PROCESSING:
        nextStage = OrderStatus.Status.DISPATCHED;
        break;
      case OrderStatus.Status.DISPATCHED:
        nextStage = OrderStatus.Status.DELIVERED;
        break;
      default:
        break;
    }

    setIsUpdating(true);

    dispatch(
      orderAsyncActions.updateOrderStatus({
        orderId: order.order.id,
        status: nextStage,
      })
    );
  };

  if (isLoading) return <p>Fetching ....</p>;

  if (!order?.order?.id) return <p>No order found bro ....</p>;

  return (
    <div className={classes["container"]}>
      <p className={classes["title"]}>Order page</p>
      <p>{order.order.id}</p>
      <p>{OrderStatus.State.text(order.order.status)}</p>
      <Button
        label="Next stage"
        onClick={nextStage}
        isDisabled={isUpdating}
        isLoading={isUpdating}
      />
    </div>
  );
};

export default OrderPage;
