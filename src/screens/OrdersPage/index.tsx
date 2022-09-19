import React from "react";
import classes from "./index.module.scss";
import { useDispatch } from "react-redux";
import { useSelectState } from "../../store/selectors";
import RequestManager from "../../store/request-manager";
import OrderItem from "./OrderItem";
import ordersAsyncActions from "../../store/actions/orders.action";
import orderAsyncActions from "../../store/actions/order.action";
import { ChevronRightIcon } from "../../components/Icons";
import colors from "../../constants/colors";

const OrdersPage = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isScrollTop, setIsScrollTop] = React.useState(true);
  const dispatch = useDispatch();
  const { request, orders } = useSelectState();

  React.useEffect(() => {
    dispatch(ordersAsyncActions.index({ page: 1, size: 25 }));
  }, []);

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

  const fetchOrders = (page: number) => {
    setIsLoading(true);
    dispatch(ordersAsyncActions.index({ page, size: 25 }));
  };

  return (
    <div className={classes["container"]}>
      <p className={classes["title"]}>Orders</p>
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
          {/* <div className={classes["actions"]}>
            <p>Actions</p>
          </div> */}
        </div>
        {orders.list.length === 0 ? (
          <div className={classes["no-orders"]}>
            <p>You have no orders</p>
          </div>
        ) : (
          <>
            {orders.list.map((order) => (
              <OrderItem order={order} key={order.id} />
            ))}
          </>
        )}
      </div>
      {orders.list.length > 0 && (
        <div className={classes["pagination"]}>
          <button
            className={classes["button"]}
            disabled={orders.meta.currentPage === 1}
            onClick={() =>
              fetchOrders(
                orders.meta.currentPage === 1 ? 1 : orders.meta.currentPage - 1
              )
            }
          >
            <ChevronRightIcon
              width={24}
              height={24}
              color={colors.deepgrey}
              style={{
                transform: "rotate(180deg)",
              }}
            />
          </button>
          <button className={classes["button"]} onClick={() => fetchOrders(1)}>
            <p
              style={{
                fontWeight: orders.meta.currentPage === 1 ? 600 : 400,
                color:
                  orders.meta.currentPage === 1 ? colors.deepgrey : undefined,
              }}
            >
              1
            </p>
          </button>
          {orders.meta.totalPages > 1 && (
            <button
              className={classes["button"]}
              onClick={() => fetchOrders(2)}
            >
              <p
                style={{
                  fontWeight: orders.meta.currentPage === 2 ? 600 : 400,
                  color:
                    orders.meta.currentPage === 2 ? colors.deepgrey : undefined,
                }}
              >
                2
              </p>
            </button>
          )}
          {orders.meta.currentPage > 2 &&
            orders.meta.currentPage !== orders.meta.totalPages && (
              <button
                className={classes["button"]}
                onClick={() => fetchOrders(orders.meta.currentPage)}
              >
                <p
                  style={{
                    fontWeight: 600,
                    color: colors.deepgrey,
                  }}
                >
                  {orders.meta.currentPage}
                </p>
              </button>
            )}
          {orders.meta.totalPages > 3 && <p className={classes["dots"]}>...</p>}

          {orders.meta.totalPages > 3 && (
            <button
              className={classes["button"]}
              onClick={() => fetchOrders(orders.meta.totalPages)}
            >
              <p
                style={{
                  fontWeight:
                    orders.meta.currentPage === orders.meta.totalPages
                      ? 600
                      : 400,
                  color:
                    orders.meta.currentPage === orders.meta.totalPages
                      ? colors.deepgrey
                      : undefined,
                }}
              >
                {orders.meta.totalPages}
              </p>
            </button>
          )}

          <button
            className={classes["button"]}
            disabled={orders.meta.nextPage === orders.meta.currentPage}
            onClick={() => fetchOrders(orders.meta.nextPage)}
          >
            <ChevronRightIcon width={24} height={24} color={colors.deepgrey} />
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
