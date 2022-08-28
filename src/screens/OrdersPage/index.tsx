import React from "react";
import classes from "./index.module.scss";
import { useDispatch } from "react-redux";
import { useSelectState } from "../../store/selectors";
import RequestManager from "../../store/request-manager";
import OrderItem from "./OrderItem";
import ordersAsyncActions from "../../store/actions/orders.action";

const OrdersPage = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const dispatch = useDispatch();
  const { request, orders } = useSelectState();

  React.useEffect(() => {
    dispatch(ordersAsyncActions.index());
  }, []);

  React.useEffect(() => {
    console.log({ orders: orders.list[0] });
  }, [orders]);

  const [updatedAt] = React.useState(request.updatedAt);

  // React.useEffect(() => {
  //   if (updatedAt === request.updatedAt) {
  //     return;
  //   }
  //   const RM = new RequestManager(request, dispatch);

  //   if (RM.isFulfilled(productsAsyncActions.index.typePrefix)) {
  //     RM.consume(productsAsyncActions.index.typePrefix);
  //     setIsLoading(false);
  //     return;
  //   }

  //   if (RM.isRejected(productsAsyncActions.index.typePrefix)) {
  //     RM.consume(productsAsyncActions.index.typePrefix);
  //     setIsLoading(false);
  //     return;
  //   }
  // }, [updatedAt, request.updatedAt]);

  return (
    <div className={classes["container"]}>
      <p className={classes["title"]}>Products</p>
      <div className={classes["header"]}>
        <div className={classes["col"]}>
          <p>Order #</p>
        </div>
        <div className={classes["col"]}>
          <p>Total</p>
        </div>
        <div className={classes["col"]}>
          <p># of products</p>
        </div>
        <div className={classes["col"]}>
          <p>Created at</p>
        </div>
        <div className={classes["col"]}>
          <p>User</p>
        </div>
        <div className={classes["actions"]}>
          <p>Actions</p>
        </div>
      </div>
      <div className={classes["list"]}>
        {orders.list.map((order) => (
          <OrderItem order={order} key={order.id} />
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
