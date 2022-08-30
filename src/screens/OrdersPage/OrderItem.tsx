import { format } from "date-fns";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { EditIcon, TrashIcon } from "../../components/Icons";
import Loader from "../../components/Loader";
import { cedi } from "../../constants";
import colors from "../../constants/colors";
import Order from "../../models/Order";
import Product from "../../models/Product";
import SimpleOrder from "../../models/SimpleOrder";
import User from "../../models/User";
import ProductCategories from "../../namespace/ProductCategories";
import ProductGender from "../../namespace/ProductGender";
import productsAsyncActions from "../../store/actions/products.action";
import usersAsyncActions from "../../store/actions/users.action";
import RequestManager from "../../store/request-manager";
import { useSelectState } from "../../store/selectors";
import formatOrderNumber from "../../utils/formatOrderNumber";
import classes from "./index.module.scss";

interface Props {
  order: SimpleOrder;
}

const OrderItem = (props: Props) => {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const dispatch = useDispatch();
  const { request } = useSelectState();
  const navigate = useNavigate();
  const [updatedAt] = React.useState(request.updatedAt);

  React.useEffect(() => {
    if (updatedAt === request.updatedAt) {
      return;
    }
    const RM = new RequestManager(request, dispatch);

    if (RM.isFulfilled(productsAsyncActions.deleteProduct.typePrefix)) {
      RM.consume(productsAsyncActions.deleteProduct.typePrefix);
      setIsDeleting(false);
      return;
    }

    if (RM.isRejected(productsAsyncActions.deleteProduct.typePrefix)) {
      RM.consume(productsAsyncActions.deleteProduct.typePrefix);
      setIsDeleting(false);
      return;
    }
  }, [updatedAt, request.updatedAt]);

  return (
    <div
      className={classes["item"]}
      onClick={() => {
        navigate(`/orders/${props.order.id}`);
      }}
    >
      <button
        className={classes["image"]}
        onClick={(e) => {
          navigate(`/users/${props.order.user?.id}`);
          e.stopPropagation();
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bW9kZWx8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
          alt={props.order.user.email}
          // className={classes["image"]}
        />
      </button>
      <div className={classes["col"]}>
        <p>#{formatOrderNumber(props.order.orderNumber + "", 5)}</p>
      </div>
      <div className={classes["col"]}>
        <p>{`${cedi} ${props.order.total.toFixed(2)}`}</p>
      </div>
      <div className={classes["col"]}>
        <p>{props.order.numberOfProducts}</p>
      </div>
      <div className={classes["col"]}>
        <p>{props.order.orderStatus}</p>
      </div>
      <div className={classes["col"]}>
        <p>{format(new Date(props.order.createdAt), "dd/MM/yyyy")}</p>
      </div>
      <div className={`${classes["col"]} ${classes["lg"]}`}>
        <button
          onClick={(e) => {
            navigate(`/users/${props.order.user.id}`);
            e.stopPropagation();
          }}
        >
          <p>{`${props.order.user.email}`}</p>
        </button>
      </div>
      <div className={classes["actions"]}>
        <button
          className={classes["button"]}
          disabled
          onClick={(e) => {
            // navigate(`/orders/${props.order.id}/edit`);
            // e.stopPropagation();
          }}
        >
          <EditIcon width={18} height={18} color={colors.white} />
        </button>
        <button
          className={classes["button"]}
          disabled
          // disabled={isDeleting}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {isDeleting ? (
            <Loader color={colors.white} />
          ) : (
            <TrashIcon width={18} height={18} color={colors.white} />
          )}
        </button>
      </div>
    </div>
  );
};

export default OrderItem;
