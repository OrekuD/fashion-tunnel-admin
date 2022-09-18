import React from "react";
import classes from "./index.module.scss";
import { useDispatch } from "react-redux";
import { useSelectState } from "../../store/selectors";
import { useNavigate } from "react-router-dom";
import productsAsyncActions from "../../store/actions/products.action";
import RequestManager from "../../store/request-manager";
import ProductItem from "./ProductItem";
import { ChevronRightIcon, PlusIcon } from "../../components/Icons";
import colors from "../../constants/colors";

const ProductsPage = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isScrollTop, setIsScrollTop] = React.useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { request, products } = useSelectState();

  React.useEffect(() => {
    dispatch(productsAsyncActions.index({ page: 1, size: 25 }));
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

  const fetchProducts = (page: number) => {
    setIsLoading(true);
    dispatch(productsAsyncActions.index({ page, size: 25 }));
  };

  return (
    <div className={classes["container"]}>
      <div className={classes["title-header"]}>
        <p className={classes["title"]}>Products</p>
        <button
          className={classes["create-button"]}
          onClick={() => navigate("/products/create")}
        >
          <PlusIcon width={24} height={24} color={colors.white} />
          <p>Create new product</p>
        </button>
      </div>
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
        {products.list.length === 0 ? (
          <div className={classes["no-products"]}>
            <p>You have no products</p>
          </div>
        ) : (
          <>
            {products.list.map((product) => (
              <ProductItem product={product} key={product.id} />
            ))}
          </>
        )}
      </div>
      {products.list.length > 0 && (
        <div className={classes["pagination"]}>
          <button
            className={classes["button"]}
            disabled={products.meta.currentPage === 1}
            onClick={() =>
              fetchProducts(
                products.meta.currentPage === 1
                  ? 1
                  : products.meta.currentPage - 1
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
          <button
            className={classes["button"]}
            onClick={() => fetchProducts(1)}
          >
            <p
              style={{
                fontWeight: products.meta.currentPage === 1 ? 600 : 400,
                color:
                  products.meta.currentPage === 1 ? colors.deepgrey : undefined,
              }}
            >
              1
            </p>
          </button>
          {products.meta.totalPages > 1 && (
            <button
              className={classes["button"]}
              onClick={() => fetchProducts(2)}
            >
              <p
                style={{
                  fontWeight: products.meta.currentPage === 2 ? 600 : 400,
                  color:
                    products.meta.currentPage === 2
                      ? colors.deepgrey
                      : undefined,
                }}
              >
                2
              </p>
            </button>
          )}
          {products.meta.currentPage > 2 &&
            products.meta.currentPage !== products.meta.totalPages && (
              <button
                className={classes["button"]}
                onClick={() => fetchProducts(products.meta.currentPage)}
              >
                <p
                  style={{
                    fontWeight: 600,
                    color: colors.deepgrey,
                  }}
                >
                  {products.meta.currentPage}
                </p>
              </button>
            )}
          {products.meta.totalPages > 3 && (
            <p className={classes["dots"]}>...</p>
          )}
          {products.meta.totalPages > 3 && (
            <button
              className={classes["button"]}
              onClick={() => fetchProducts(products.meta.totalPages)}
            >
              <p
                style={{
                  fontWeight:
                    products.meta.currentPage === products.meta.totalPages
                      ? 600
                      : 400,
                  color:
                    products.meta.currentPage === products.meta.totalPages
                      ? colors.deepgrey
                      : undefined,
                }}
              >
                {products.meta.totalPages}
              </p>
            </button>
          )}
          <button
            className={classes["button"]}
            disabled={products.meta.nextPage === products.meta.currentPage}
            onClick={() => {
              fetchProducts(products.meta.nextPage);
            }}
          >
            <ChevronRightIcon width={24} height={24} color={colors.deepgrey} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
