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
import ProductItem from "./ProductItem";

const ProductsPage = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isScrollTop, setIsScrollTop] = React.useState(true);
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
          <div className={classes["actions"]}>
            <p>Actions</p>
          </div>
        </div>
        {products.list.map((product) => (
          <ProductItem product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
