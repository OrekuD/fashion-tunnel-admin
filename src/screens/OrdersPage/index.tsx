import React from "react";
import classes from "./index.module.scss";
import { useDispatch } from "react-redux";
import { useSelectState } from "../../store/selectors";
import RequestManager from "../../store/request-manager";
import OrderItem from "./OrderItem";
import ordersAsyncActions from "../../store/actions/orders.action";

const OrdersPage = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isScrollTop, setIsScrollTop] = React.useState(true);
  const dispatch = useDispatch();
  const { request, orders } = useSelectState();

  React.useEffect(() => {
    dispatch(ordersAsyncActions.index());
  }, []);

  // React.useEffect(() => {
  //   console.log({ ____orders: orders.list[0] });
  // }, [orders]);

  const [updatedAt] = React.useState(request.updatedAt);

  React.useEffect(() => {
    if (updatedAt === request.updatedAt) {
      return;
    }
    const RM = new RequestManager(request, dispatch);

    if (RM.isFulfilled(ordersAsyncActions.index.typePrefix)) {
      RM.consume(ordersAsyncActions.index.typePrefix);
      setIsLoading(false);
      return;
    }

    if (RM.isRejected(ordersAsyncActions.index.typePrefix)) {
      RM.consume(ordersAsyncActions.index.typePrefix);
      setIsLoading(false);
      return;
    }
  }, [updatedAt, request.updatedAt]);

  return (
    <div className={classes["container"]}>
      <p className={classes["title"]}>Products</p>
      <div
        className={classes["list"]}
        onScroll={(e) => {
          if ((e.target as any)?.scrollTop === 0) {
            setIsScrollTop(true);
          } else {
            setIsScrollTop(false);
          }
        }}
      >
        <div
          className={`${classes["item"]} ${classes["header"]}`}
          style={{
            boxShadow: isScrollTop
              ? undefined
              : " 6.7px 6.7px 5.3px rgba(0, 0, 0, 0.028), 22.3px 22.3px 17.9px rgba(0, 0, 0, 0.042), 100px 100px 80px rgba(0, 0, 0, 0.07)",
          }}
        >
          <div className={classes["image"]} />
          <div className={classes["col"]}>
            <p>Order #</p>
          </div>
          <div className={classes["col"]}>
            <p>Total</p>
          </div>
          <div className={classes["col"]}>
            <p>QTY</p>
          </div>
          <div className={classes["col"]}>
            <p>Status</p>
          </div>
          <div className={classes["col"]}>
            <p>Created at</p>
          </div>
          <div className={`${classes["col"]} ${classes["lg"]}`}>
            <p>User</p>
          </div>
          <div className={classes["actions"]}>
            <p>Actions</p>
          </div>
        </div>
        {orders.list.map((order) => (
          <OrderItem order={order} key={order.id} />
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
