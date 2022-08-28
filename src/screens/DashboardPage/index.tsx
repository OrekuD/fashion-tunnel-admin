import { format } from "date-fns";
import React from "react";
import { useNavigate } from "react-router-dom";
import { FilterIcon } from "../../components/Icons";
import { cedi } from "../../constants";
import colors from "../../constants/colors";
import { useSelectState } from "../../store/selectors";
import formatOrderNumber from "../../utils/formatOrderNumber";
import classes from "./index.module.scss";

const DashboardPage = () => {
  const { request, orders, users } = useSelectState();
  const navigate = useNavigate();

  return (
    <div className={classes["container"]}>
      <div className={classes["top-content"]}>
        <p>ok</p>
        <p>ok</p>
      </div>
      <div className={classes["grid"]}>
        <div className={classes["section"]}>
          <div className={classes["first-wrapper"]} />
          <div className={classes["wrapper"]}>
            <div className={classes["second-wrapper"]} />
            <div className={classes["third-wrapper"]} />
          </div>
        </div>
        <div className={classes["section"]}>
          <div className={classes["fourth-wrapper"]}>
            <div className={classes["header"]}>
              <p className={classes["title"]}>Recent orders</p>
              <button className={classes["button"]}>
                <FilterIcon width={16} height={16} color={colors.deepgrey} />
                <p>Filters</p>
              </button>
            </div>
            <div className={classes["content"]}>
              <div className={classes["row-labels"]}>
                <div className={classes["image"]}>
                  <p>placeholder</p>
                </div>
                <div className={classes["col"]}>
                  <p>Order #</p>
                </div>
                <div className={classes["col"]}>
                  <p>Total</p>
                </div>
                <div className={`${classes["col"]} ${classes["sm"]}`}>
                  <p>QTY</p>
                </div>
                <div className={classes["col"]}>
                  <p>Created at</p>
                </div>
                <div className={`${classes["col"]} ${classes["last"]}`}>
                  <p>User</p>
                </div>
              </div>
              <div className={classes["list"]}>
                {orders.list.slice(0, 3).map((order) => {
                  return (
                    <div
                      className={classes["item"]}
                      onClick={() => {
                        navigate(`/orders/${order.id}`);
                      }}
                    >
                      <button
                        className={classes["image"]}
                        onClick={(e) => {
                          navigate(`/users/${order.user.id}`);
                          e.stopPropagation();
                        }}
                      >
                        <img
                          src={
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bW9kZWx8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
                          }
                          alt={order.user.firstname}
                          // className={classes["image"]}
                        />
                      </button>
                      <div className={classes["col"]}>
                        <p>#{formatOrderNumber(order.orderNumber + "", 5)}</p>
                      </div>
                      <div className={classes["col"]}>
                        <p>{`${cedi} ${order.total.toFixed(2)}`}</p>
                      </div>
                      <div className={`${classes["col"]} ${classes["sm"]}`}>
                        <p>{order.products.length}</p>
                      </div>
                      <div className={classes["col"]}>
                        <p>{format(new Date(order.createdAt), "dd/MM/yyyy")}</p>
                      </div>
                      <div className={`${classes["col"]} ${classes["last"]}`}>
                        <div
                          onClick={(e) => {
                            navigate(`/users/${order.user.id}`);
                            e.stopPropagation();
                          }}
                        >
                          <p>{`${order.user.email}`}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className={classes["fifth-wrapper"]}>
            <div className={classes["header"]}>
              <p className={classes["title"]}>Recent users</p>
              <button className={classes["button"]}>
                <FilterIcon width={16} height={16} color={colors.deepgrey} />
                <p>Filters</p>
              </button>
            </div>
            <div className={classes["content"]}>
              <div className={classes["row-labels"]}>
                <div className={classes["image"]}>
                  <p>placeholder</p>
                </div>
                {/* <div className={`${classes["col"]} ${classes["last"]}`}>
                  <p>Full name</p>
                </div> */}
                <div className={`${classes["col"]} ${classes["last"]}`}>
                  <p>Email</p>
                </div>
                <div className={classes["col"]}>
                  <p>Device type</p>
                </div>
                <div className={classes["col"]}>
                  <p>Created at</p>
                </div>
              </div>
              <div className={classes["list"]}>
                {users.list.slice(0, 3).map((user) => {
                  return (
                    <div
                      className={classes["item"]}
                      onClick={() => {
                        navigate(`/users/${user.id}`);
                      }}
                    >
                      <button
                        className={classes["image"]}
                        onClick={(e) => {
                          navigate(`/users/${user.id}`);
                          e.stopPropagation();
                        }}
                      >
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bW9kZWx8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
                          alt={user.firstname}
                          // className={classes["image"]}
                        />
                      </button>
                      {/* <div className={`${classes["col"]} ${classes["last"]}`}>
                        <p>{`${user.firstname} ${user.lastname}`}</p>
                      </div> */}
                      <div className={`${classes["col"]} ${classes["last"]}`}>
                        <div
                          onClick={(e) => {
                            navigate(`/users/${user.id}`);
                            e.stopPropagation();
                          }}
                        >
                          <p>{`${user.email}`}</p>
                        </div>
                      </div>
                      <div className={classes["col"]}>
                        <p>{user.deviceType}</p>
                      </div>
                      <div className={classes["col"]}>
                        <p>{format(new Date(user.createdAt), "dd/MM/yyyy")}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
