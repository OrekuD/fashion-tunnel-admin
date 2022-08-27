import { AxiosResponse } from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { Button } from "..";
import OkResponse from "../../network/responses/OkResponse";
import { authenticationActions } from "../../store/slices/authentication.slice";
import { userActions } from "../../store/slices/user.slice";
import API from "../../constants/api";
import classes from "./index.module.scss";
import {
  DashboardFilledIcon,
  DashboardIcon,
  LogoutIcon,
  OrdersFilledIcon,
  OrdersIcon,
  SettingsIcon,
  UserFilledIcon,
  UserIcon,
} from "../Icons";
import colors from "../../constants/colors";
import Loader from "../Loader";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import authenticationAsyncActions from "../../store/actions/authentication.action";

const Layout = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const signOut = async () => {
    if (isSigningOut) {
      return;
    }
    setIsSigningOut(true);
    dispatch(authenticationAsyncActions.signout());
  };

  const menu = React.useMemo(
    () => [
      {
        icon: DashboardIcon,
        filledIcon: DashboardFilledIcon,
        label: "Dashboard",
        to: "/dashboard",
      },
      {
        icon: OrdersIcon,
        filledIcon: OrdersFilledIcon,
        label: "Orders",
        to: "/orders",
      },
      {
        icon: UserIcon,
        filledIcon: UserFilledIcon,
        label: "Users",
        to: "/users",
      },
      {
        icon: DashboardIcon,
        filledIcon: DashboardFilledIcon,
        label: "Products",
        to: "/products",
      },
    ],
    []
  );

  return (
    <div className={classes["container"]}>
      <div className={classes["left-content"]}>
        {menu.map(({ icon: Icon, filledIcon: FilledIcon, label, to }) => {
          const isActive = location.pathname === to;
          return (
            <button
              className={classes["row-item"]}
              onClick={() => {
                navigate(to);
              }}
              key={to}
              style={{
                backgroundColor: isActive ? colors.lightpurple : "",
              }}
            >
              {isActive ? (
                <FilledIcon width={24} height={24} color={colors.purple} />
              ) : (
                <Icon width={24} height={24} color={colors.darkgrey} />
              )}
              <p
                style={{
                  color: isActive ? colors.purple : colors.darkgrey,
                }}
              >
                {label}
              </p>
            </button>
          );
        })}
        <div className={classes["footer"]}>
          {/* <button
            className={classes["row-item"]}
            onClick={() => {
              navigate("/dashboard/account");
            }}
            style={{
              backgroundColor:
                location.pathname === "/dashboard/account"
                  ? colors.lightpurple
                  : "",
            }}
          >
            {location.pathname === "/dashboard/account" ? (
              <UserIcon width={24} height={24} color={colors.purple} />
            ) : (
              <UserIcon width={24} height={24} color={colors.darkgrey} />
            )}
            <p
              style={{
                color:
                  location.pathname === "/dashboard/account"
                    ? colors.purple
                    : colors.darkgrey,
              }}
            >
              Account
            </p>
          </button> */}
          <button className={classes["row-item"]} onClick={signOut}>
            <LogoutIcon width={24} height={24} color={colors.darkgrey} />
            {isSigningOut ? (
              <div style={{ marginLeft: "0.75rem", marginTop: "0.25rem" }}>
                <Loader color={colors.primary} />
              </div>
            ) : (
              <p>Logout</p>
            )}
          </button>
        </div>
      </div>
      <div className={classes["right-content"]}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
