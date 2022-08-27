import { AxiosResponse } from "axios";
import React from "react";
import classes from "./index.module.scss";
import API from "../../constants/api";
import { useDispatch } from "react-redux";
import { useSelectState } from "../../store/selectors";
import { Link, useNavigate } from "react-router-dom";
import productsAsyncActions from "../../store/actions/products.action";
import RequestManager from "../../store/request-manager";
import ProductGender from "../../namespace/ProductGender";
import { cedi } from "../../constants";
import ProductCategories from "../../namespace/ProductCategories";
import usersAsyncActions from "../../store/actions/users.action";
import { format } from "date-fns";
import { EditIcon, TrashIcon } from "../../components/Icons";
import colors from "../../constants/colors";
import Loader from "../../components/Loader";
import UserItem from "./UserItem";

const UsersPage = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const dispatch = useDispatch();
  const { request, products, users } = useSelectState();
  const navigate = useNavigate();

  React.useEffect(() => {
    dispatch(usersAsyncActions.index());
  }, []);

  const [updatedAt] = React.useState(request.updatedAt);

  React.useEffect(() => {
    if (updatedAt === request.updatedAt) {
      return;
    }
    const RM = new RequestManager(request, dispatch);

    if (RM.isFulfilled(usersAsyncActions.index.typePrefix)) {
      RM.consume(usersAsyncActions.index.typePrefix);
      setIsLoading(false);
      return;
    }

    if (RM.isRejected(usersAsyncActions.index.typePrefix)) {
      RM.consume(usersAsyncActions.index.typePrefix);
      setIsLoading(false);
      return;
    }
  }, [updatedAt, request.updatedAt]);

  return (
    <div className={classes["container"]}>
      <p className={classes["title"]}>Users</p>
      <div className={classes["header"]}>
        <div className={classes["col"]}>
          <p>First name</p>
        </div>
        <div className={classes["col"]}>
          <p>Last name</p>
        </div>
        <div className={classes["col"]}>
          <p>Email</p>
        </div>
        <div className={classes["col"]}>
          <p>Device type</p>
        </div>
        <div className={classes["col"]}>
          <p>Joined on</p>
        </div>
        <div className={classes["actions"]}>
          <p>Actions</p>
        </div>
      </div>
      <div className={classes["list"]}>
        {users.list.map((user) => (
          <UserItem key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
