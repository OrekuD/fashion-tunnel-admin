import { AxiosResponse } from "axios";
import React from "react";
import classes from "./index.module.scss";
import API from "../../constants/api";
import { useDispatch } from "react-redux";
import { useSelectState } from "../../store/selectors";
import { Link } from "react-router-dom";
import productsAsyncActions from "../../store/actions/products.action";
import RequestManager from "../../store/request-manager";
import ProductGender from "../../namespace/ProductGender";
import { cedi } from "../../constants";
import ProductCategories from "../../namespace/ProductCategories";

const ProductsPage = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const dispatch = useDispatch();
  const { request, products } = useSelectState();

  React.useEffect(() => {
    dispatch(productsAsyncActions.index());
  }, []);

  const [updatedAt] = React.useState(request.updatedAt);

  React.useEffect(() => {
    if (updatedAt === request.updatedAt) {
      return;
    }
    const RM = new RequestManager(request, dispatch);

    if (RM.isFulfilled(productsAsyncActions.index.typePrefix)) {
      RM.consume(productsAsyncActions.index.typePrefix);
      setIsLoading(false);
      return;
    }

    if (RM.isRejected(productsAsyncActions.index.typePrefix)) {
      RM.consume(productsAsyncActions.index.typePrefix);
      setIsLoading(false);
      return;
    }
  }, [updatedAt, request.updatedAt]);

  return (
    <div className={classes["container"]}>
      <p className={classes["title"]}>Products</p>
      <div className={classes["header"]}>
        <div className={classes["col"]}>
          <p>Name</p>
        </div>
        <div className={classes["col"]}>
          <p>Price</p>
        </div>
        <div className={classes["col"]}>
          <p>Category</p>
        </div>
        <div className={classes["col"]}>
          <p>Quantity</p>
        </div>
        <div className={classes["col"]}>
          <p>Gender</p>
        </div>
      </div>
      <div className={classes["products"]}>
        {products.list.map(
          ({
            name,
            id,
            price,
            productQuantity,
            images,
            gender,
            productCategory,
          }) => (
            <Link to={`/products/${id}`} key={id}>
              <div className={classes["item"]}>
                <img src={images[0]} alt={name} className={classes["image"]} />
                <div className={classes["col"]}>
                  <p>{name}</p>
                </div>
                <div className={classes["col"]}>
                  <p>{`${cedi} ${price.toFixed(2)}`}</p>
                </div>
                <div className={classes["col"]}>
                  <p>{ProductCategories.State.text(productCategory)}</p>
                </div>
                <div className={classes["col"]}>
                  <p>{productQuantity}</p>
                </div>
                <div className={classes["col"]}>
                  <p>{ProductGender.State.text(gender)}</p>
                </div>
              </div>
            </Link>
          )
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
