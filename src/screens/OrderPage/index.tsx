import { format } from "date-fns";
import React from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Button from "../../components/Button";
import { CancelIcon, CheckIcon } from "../../components/Icons";
import Loader from "../../components/Loader";
import { cedi } from "../../constants";
import colors from "../../constants/colors";
import OrderStatus from "../../namespace/OrderStatus";
import orderAsyncActions from "../../store/actions/order.action";
import RequestManager from "../../store/request-manager";
import { useSelectState } from "../../store/selectors";
import formatOrderNumber from "../../utils/formatOrderNumber";
import classes from "./index.module.scss";

const OrderPage = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAccepting, setIsAccepting] = React.useState(false);
  const [isDeclining, setIsDeclining] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const dispatch = useDispatch();
  const {
    request,
    order: { order },
  } = useSelectState();
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
      setIsAccepting(false);
      return;
    }

    if (RM.isRejected(orderAsyncActions.updateOrderStatus.typePrefix)) {
      RM.consume(orderAsyncActions.updateOrderStatus.typePrefix);
      setIsUpdating(false);
      setIsAccepting(false);
      return;
    }
  }, [updatedAt, request.updatedAt]);

  const summary = React.useMemo(() => {
    const data = [
      {
        label: "Subtotal",
        value: `${cedi} ${order?.subtotal?.toFixed(2)}`,
      },
      {
        label: "Total",
        value: `${cedi} ${order?.total?.toFixed(2)}`,
      },
    ];

    if (order?.discount && order.discount > 0) {
      data.unshift({
        label: "Discount",
        value: `-${cedi} ${order?.discount?.toFixed(2)}`,
      });
    }

    return data;
  }, [order?.subtotal]);

  const completedOrders = React.useMemo(
    () => [
      OrderStatus.Status.DELIVERED,
      OrderStatus.Status.CANCELLED,
      OrderStatus.Status.REJECTED,
    ],
    []
  );

  const orderTracking = React.useMemo(
    () => [
      OrderStatus.Status.PENDING,
      OrderStatus.Status.ACCEPTED,
      OrderStatus.Status.PROCESSING,
      OrderStatus.Status.DISPATCHED,
      OrderStatus.Status.DELIVERED,
    ],
    []
  );

  const goToNextStage = () => {
    if (!order) return;
    if (isUpdating) return;

    let nextStage = order.status;

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
        orderId: order.id,
        status: nextStage,
      })
    );
  };

  if (isLoading) return <p>Fetching ....</p>;

  if (!order?.id) return <p>No order found bro ....</p>;

  return (
    <div className={classes["container"]}>
      <div className={classes["left-container"]}>
        <p className={classes["title"]}>
          Order{" "}
          <span>#{formatOrderNumber(order.orderNumber.toString(), 4)}</span>{" "}
        </p>

        {order.status === OrderStatus.Status.PENDING ? (
          <div className={classes["pending"]}>
            <p className={classes["label"]}>
              Do you want to accept or decline the order?
            </p>
            <div className={classes["buttons"]}>
              <button
                className={classes["button"]}
                onClick={() => {
                  setIsDeclining(true);
                  dispatch(
                    orderAsyncActions.updateOrderStatus({
                      orderId: order.id,
                      status: OrderStatus.Status.REJECTED,
                    })
                  );
                }}
                disabled={isUpdating || isDeclining || isDeclining}
              >
                <div className={classes["icon"]}>
                  <CancelIcon width={16} height={16} color={colors.white} />
                </div>
                {isDeclining ? <Loader color={colors.white} /> : <p>Decline</p>}
              </button>
              <button
                className={classes["button"]}
                onClick={() => {
                  setIsAccepting(true);
                  dispatch(
                    orderAsyncActions.updateOrderStatus({
                      orderId: order.id,
                      status: OrderStatus.Status.ACCEPTED,
                    })
                  );
                }}
                disabled={isUpdating || isAccepting || isDeclining}
              >
                <div className={classes["icon"]}>
                  <CheckIcon width={16} height={16} color={colors.white} />
                </div>
                {isAccepting ? <Loader color={colors.white} /> : <p>Accept</p>}
              </button>
            </div>
          </div>
        ) : (
          <>
            {order.status === OrderStatus.Status.REJECTED ? (
              <p className={classes["declined"]}>You delined the order</p>
            ) : (
              <>
                <p className={classes["status"]}>
                  {completedOrders.includes(order.status)
                    ? "Your order is complete"
                    : "Your order is in progress"}
                </p>
                <div className={classes["order-tracking"]}>
                  {orderTracking.map((orderStatus, index) => {
                    const timeStamp = order.statusTimeStamps.find(
                      ({ status }) => status === orderStatus
                    );
                    return (
                      <div key={index} className={classes["status-wrapper"]}>
                        <div className={classes["side-panel"]}>
                          {completedOrders.includes(order.status) ? (
                            <div className={classes["indicator-wrapper"]}>
                              <div className={classes["completed-indicator"]} />
                            </div>
                          ) : (
                            <div className={classes["indicator-wrapper"]}>
                              {orderStatus < order.status ? (
                                <div
                                  className={classes["completed-indicator"]}
                                />
                              ) : orderStatus === order.status ? (
                                <div
                                  className={classes["in-progress-indicator"]}
                                >
                                  <div className={classes["indicator"]} />
                                </div>
                              ) : (
                                <div className={classes["pending-indicator"]} />
                              )}
                            </div>
                          )}
                          <div
                            className={classes["line"]}
                            style={{
                              backgroundColor:
                                orderStatus <= order.status
                                  ? colors.green
                                  : colors.grey,
                              opacity:
                                index === orderTracking.length - 1 ? 0 : 1,
                            }}
                          />
                        </div>
                        <p>{OrderStatus.State.description(orderStatus)}</p>
                        {timeStamp?.time ? (
                          <div className={classes["row"]}>
                            <p className={classes["time"]}>
                              {format(
                                new Date(timeStamp.time),
                                "hh:mm a, dd/MM/yyy"
                              )}
                            </p>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    );
                  })}
                </div>
                {order.status === OrderStatus.Status.DELIVERED ? (
                  <></>
                ) : (
                  <Button
                    label="Next stage"
                    onClick={goToNextStage}
                    isDisabled={isUpdating}
                    isLoading={isUpdating}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
      <div className={classes["right-container"]}>
        <div className={classes["section"]}>
          <p className={classes["section-title"]}>User details</p>
          <p>{`${order.user.firstname} ${order.user.lastname}`}</p>
          <p>{order.user.email}</p>
          {/* <p>{order.user.postalCode}</p> */}
        </div>

        <div className={classes["section"]}>
          <p className={classes["section-title"]}>Order details</p>
          {order.products.map(({ count, name, total, images }, index) => (
            <div className={classes["product"]} key={index}>
              <img
                src={images[0]}
                alt={name}
                className={classes["product-image"]}
              />
              <div className={classes["content"]}>
                <p>{name}</p>
                <p>{`${cedi} ${total.toFixed(2)}`}</p>
              </div>
              <p>x {count}</p>
            </div>
          ))}
        </div>
        <div className={classes["section"]}>
          <p className={classes["section-title"]}>Order summary</p>
          {summary.map(({ label, value }, index) => (
            <div className={classes["item"]} key={index}>
              <p>{label}</p>
              <p>{value}</p>
            </div>
          ))}
        </div>
        <div className={classes["section"]}>
          <p className={classes["section-title"]}>Delivery address</p>
          <p>{order.deliveryAddress.name}</p>
          <p>{order.deliveryAddress.addressLine}</p>
          <p>{order.deliveryAddress.postalCode}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
