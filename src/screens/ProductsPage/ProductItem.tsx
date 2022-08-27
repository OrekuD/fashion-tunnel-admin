import { format } from "date-fns";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { EditIcon, TrashIcon } from "../../components/Icons";
import Loader from "../../components/Loader";
import { cedi } from "../../constants";
import colors from "../../constants/colors";
import Product from "../../models/Product";
import User from "../../models/User";
import ProductCategories from "../../namespace/ProductCategories";
import ProductGender from "../../namespace/ProductGender";
import productsAsyncActions from "../../store/actions/products.action";
import usersAsyncActions from "../../store/actions/users.action";
import RequestManager from "../../store/request-manager";
import { useSelectState } from "../../store/selectors";
import classes from "./index.module.scss";

interface Props {
  product: Product;
}

const ProductItem = (props: Props) => {
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
        navigate(`/products/${props.product.id}`);
      }}
    >
      <img
        src={props.product.images[0]}
        alt={props.product.name}
        className={classes["image"]}
      />
      <div className={classes["col"]}>
        <p>{props.product.name}</p>
      </div>
      <div className={classes["col"]}>
        <p>{`${cedi} ${props.product.price.toFixed(2)}`}</p>
      </div>
      <div className={classes["col"]}>
        <p>{ProductCategories.State.text(props.product.productCategory)}</p>
      </div>
      <div className={classes["col"]}>
        <p>{props.product.productQuantity}</p>
      </div>
      <div className={classes["col"]}>
        <p>{ProductGender.State.text(props.product.gender)}</p>
      </div>
      <div className={classes["actions"]}>
        <button
          className={classes["button"]}
          onClick={(e) => {
            navigate(`/products/${props.product.id}/edit`);
            // console.log(`/products/${props.product.id}/edit`);
            e.stopPropagation();
          }}
        >
          <EditIcon width={18} height={18} color={colors.white} />
        </button>
        <button
          className={classes["button"]}
          disabled={isDeleting}
          onClick={(e) => {
            e.stopPropagation();
            setIsDeleting(true);
            dispatch(productsAsyncActions.deleteProduct(props.product.id));
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

export default ProductItem;
