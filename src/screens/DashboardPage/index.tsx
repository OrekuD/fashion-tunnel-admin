import { format } from "date-fns";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FilterIcon } from "../../components/Icons";
import { cedi } from "../../constants";
import colors from "../../constants/colors";
import incomeAsyncActions from "../../store/actions/income.action";
import RequestManager from "../../store/request-manager";
import { useSelectState } from "../../store/selectors";
import formatOrderNumber from "../../utils/formatOrderNumber";
import Chart from "./Chart";
import classes from "./index.module.scss";
import API from "../../constants/api";
import { AxiosResponse } from "axios";

const DashboardPage = () => {
  const { request, orders, users, income } = useSelectState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isFetchingIncome, setIsFetchingIncome] = React.useState(true);

  React.useEffect(() => {
    dispatch(incomeAsyncActions.index());
  }, []);

  const [updatedAt] = React.useState(request.updatedAt);

  React.useEffect(() => {
    if (updatedAt === request.updatedAt) {
      return;
    }
    const RM = new RequestManager(request, dispatch);

    if (RM.isFulfilled(incomeAsyncActions.index.typePrefix)) {
      RM.consume(incomeAsyncActions.index.typePrefix);
      setIsFetchingIncome(false);
      return;
    }

    if (RM.isRejected(incomeAsyncActions.index.typePrefix)) {
      RM.consume(incomeAsyncActions.index.typePrefix);
      setIsFetchingIncome(false);
      return;
    }
  }, [updatedAt, request.updatedAt]);

  const test = async () => {
    try {
      const response = await API.client.get<any, AxiosResponse<any>>(
        `/admin/socket/630e2daa9e58fcc002a5057a`
      );

      console.log({ data: response.data });
      return response.data;
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <div className={classes["container"]}>
      <div className={classes["top-content"]}>
        <p className={classes["name"]}>Hello, David</p>
        <p className={classes["label"]}>Your analytics for today</p>
        <button onClick={test}>test</button>
      </div>
      <div className={classes["grid"]}>
        <div className={classes["section"]}>
          <div className={classes["first-wrapper"]}>
            <Chart />
          </div>
          <div className={classes["wrapper"]}>
            <div className={classes["second-wrapper"]}>
              <p className={classes["title"]}>Available balance</p>
              <p
                className={classes["amount"]}
              >{`${cedi} ${income?.total?.toFixed(2)}`}</p>
            </div>
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
                          alt={order.user.email}
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
                        <p>{order.numberOfProducts}</p>
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
