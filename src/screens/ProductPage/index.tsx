import React from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import productsAsyncActions from "../../store/actions/products.action";
import RequestManager from "../../store/request-manager";
import { useSelectState } from "../../store/selectors";
import classes from "./index.module.scss";

const ProductPage = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const dispatch = useDispatch();
  const { request, product } = useSelectState();
  const { productId } = useParams<{ productId: string }>();

  React.useEffect(() => {
    if (!productId) return;
    dispatch(productsAsyncActions.getProduct(productId));
  }, [productId]);

  const [updatedAt] = React.useState(request.updatedAt);

  React.useEffect(() => {
    if (updatedAt === request.updatedAt) {
      return;
    }
    const RM = new RequestManager(request, dispatch);

    if (RM.isFulfilled(productsAsyncActions.getProduct.typePrefix)) {
      RM.consume(productsAsyncActions.getProduct.typePrefix);
      setIsLoading(false);
      return;
    }

    if (RM.isRejected(productsAsyncActions.getProduct.typePrefix)) {
      RM.consume(productsAsyncActions.getProduct.typePrefix);
      setIsLoading(false);
      return;
    }
  }, [updatedAt, request.updatedAt]);

  if (isLoading) return <p>Fetching ....</p>;

  if (!product?.product?.id) return <p>No product found bro ....</p>;

  return (
    <div className={classes["container"]}>
      <p className={classes["title"]}>Product page</p>
      <p>{product.product.name}</p>
    </div>
  );
};

export default ProductPage;
