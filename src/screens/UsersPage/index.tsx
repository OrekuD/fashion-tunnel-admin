import React from "react";
import classes from "./index.module.scss";
import { useDispatch } from "react-redux";
import { useSelectState } from "../../store/selectors";
import { useNavigate } from "react-router-dom";
import RequestManager from "../../store/request-manager";
import usersAsyncActions from "../../store/actions/users.action";
import UserItem from "./UserItem";

const UsersPage = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isScrollTop, setIsScrollTop] = React.useState(true);
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
            <p>First name</p>
          </div>
          <div className={classes["col"]}>
            <p>Last name</p>
          </div>
          <div className={`${classes["col"]} ${classes["lg"]}`}>
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
        {users.list.map((user, index) => (
          <UserItem key={index} user={user} />
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
