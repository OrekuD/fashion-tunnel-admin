import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { EditIcon, TrashIcon } from "../../components/Icons";
import Loader from "../../components/Loader";
import { cedi } from "../../constants";
import colors from "../../constants/colors";
import ProductCategories from "../../namespace/ProductCategories";
import ProductGender from "../../namespace/ProductGender";
import productsAsyncActions from "../../store/actions/products.action";
import RequestManager from "../../store/request-manager";
import { useSelectState } from "../../store/selectors";
import classes from "./index.module.scss";

const ProductPage = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

    if (RM.isFulfilled(productsAsyncActions.deleteProduct.typePrefix)) {
      RM.consume(productsAsyncActions.deleteProduct.typePrefix);
      setIsDeleting(false);
      navigate(-1);
      return;
    }

    if (RM.isRejected(productsAsyncActions.deleteProduct.typePrefix)) {
      RM.consume(productsAsyncActions.deleteProduct.typePrefix);
      setIsDeleting(false);
      return;
    }
  }, [updatedAt, request.updatedAt]);

  if (isLoading) return <p>Fetching ....</p>;

  if (!product?.product?.id) return <p>No product found bro ....</p>;

  return (
    <div className={classes["container"]}>
      <div className={classes["content"]}>
        <p className={classes["title"]}>Product page</p>

        <div className={classes["section"]}>
          <p className={classes["label"]}>Product name</p>
          <p className={classes["value"]}>{product.product.name}</p>
        </div>
        <div className={classes["section"]}>
          <p className={classes["label"]}>Product price</p>
          <p
            className={classes["value"]}
          >{`${cedi} ${product.product.price.toFixed(2)}`}</p>
        </div>
        <div className={classes["section"]}>
          <p className={classes["label"]}>Product images</p>
          <div className={classes["images"]}>
            {product.product.images.map((image) => (
              <img
                src={image}
                key={image}
                alt={image}
                className={classes["image"]}
              />
            ))}
          </div>
        </div>
        <div className={classes["section"]}>
          <p className={classes["label"]}>Product category</p>
          <p className={classes["value"]}>
            {ProductCategories.State.text(product.product.productCategory)}
          </p>
        </div>
        <div className={classes["section"]}>
          <p className={classes["label"]}>Product quantity</p>
          <p className={classes["value"]}>{product.product.productQuantity}</p>
        </div>
        <div className={classes["section"]}>
          <p className={classes["label"]}>Product gender</p>
          <p className={classes["value"]}>
            {ProductGender.State.text(product.product.gender)}
          </p>
        </div>
        <div className={classes["section"]}>
          <p className={classes["label"]}>Product description</p>
          <p className={classes["value"]}>{product.product.description}</p>
        </div>
        <div className={classes["section"]}>
          <p className={classes["label"]}>Product size type</p>
          <p className={classes["value"]}>{product.product.sizeType}</p>
        </div>
        <div className={classes["section"]}>
          <p className={classes["label"]}>Extra info</p>
          {Array(5)
            .fill("9")
            .map((p, index) => (
              <div className={classes["row"]} key={index}>
                <div className={classes["dot"]} />
                <p className={classes["value"]}>
                  {product?.product?.description}
                </p>
              </div>
            ))}
        </div>
        <div className={classes["section"]}>
          <p className={classes["label"]}>Actions</p>
          <div className={classes["actions"]}>
            <button
              className={classes["button"]}
              onClick={(e) => {
                navigate(`/products/${product.product!.id}/edit`);
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
                dispatch(
                  productsAsyncActions.deleteProduct(product.product!.id)
                );
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
      </div>
    </div>
  );
};

export default ProductPage;
