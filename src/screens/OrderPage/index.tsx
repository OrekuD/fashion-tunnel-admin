import React from "react";
import { useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import ordersAsyncActions from "../../store/actions/orders.action";
import RequestManager from "../../store/request-manager";
import { useSelectState } from "../../store/selectors";
import { orderActions } from "../../store/slices/order.slice";
import classes from "./index.module.scss";

const OrderPage = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const dispatch = useDispatch();
  const { request, order } = useSelectState();
  const { orderId } = useParams<{ orderId: string }>();

  React.useEffect(() => {
    if (!orderId) return;
    dispatch(ordersAsyncActions.getOrder(orderId));
  }, [orderId]);

  const [updatedAt] = React.useState(request.updatedAt);

  React.useEffect(() => {
    if (updatedAt === request.updatedAt) {
      return;
    }
    const RM = new RequestManager(request, dispatch);

    if (RM.isFulfilled(ordersAsyncActions.getOrder.typePrefix)) {
      RM.consume(ordersAsyncActions.getOrder.typePrefix);
      setIsLoading(false);
      return;
    }

    if (RM.isRejected(ordersAsyncActions.getOrder.typePrefix)) {
      RM.consume(ordersAsyncActions.getOrder.typePrefix);
      setIsLoading(false);
      return;
    }
  }, [updatedAt, request.updatedAt]);

  if (isLoading) return <p>Fetching ....</p>;

  if (!order?.order?.id) return <p>No order found bro ....</p>;

  return (
    <div className={classes["container"]}>
      <p className={classes["title"]}>Order page</p>
      <p>{order.order.id}</p>
    </div>
  );
};

export default OrderPage;
