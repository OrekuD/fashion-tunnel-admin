import format from "date-fns/format";
import React from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import usersAsyncActions from "../../store/actions/users.action";
import RequestManager from "../../store/request-manager";
import { useSelectState } from "../../store/selectors";
import classes from "./index.module.scss";

const UserPage = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const dispatch = useDispatch();
  const { request, user } = useSelectState();
  const { userId } = useParams<{ userId: string }>();

  React.useEffect(() => {
    if (!userId) return;
    dispatch(usersAsyncActions.getUser(userId));
  }, [userId]);

  const [updatedAt] = React.useState(request.updatedAt);

  React.useEffect(() => {
    if (updatedAt === request.updatedAt) {
      return;
    }
    const RM = new RequestManager(request, dispatch);

    if (RM.isFulfilled(usersAsyncActions.getUser.typePrefix)) {
      RM.consume(usersAsyncActions.getUser.typePrefix);
      setIsLoading(false);

      return;
    }

    if (RM.isRejected(usersAsyncActions.getUser.typePrefix)) {
      RM.consume(usersAsyncActions.getUser.typePrefix);
      setIsLoading(false);
      return;
    }
  }, [updatedAt, request.updatedAt]);

  if (isLoading) return <p>Fetching ....</p>;

  if (!user?.user?.id) return <p>No user found bro ....</p>;

  return (
    <div className={classes["container"]}>
      <div className={classes["content"]}>
        <p className={classes["title"]}>User details</p>
        <div className={classes["section"]}>
          <p className={classes["label"]}>First name</p>
          <p className={classes["value"]}>{user.user.firstname}</p>
        </div>
        <div className={classes["section"]}>
          <p className={classes["label"]}>Last name</p>
          <p className={classes["value"]}>{user.user.lastname}</p>
        </div>
        <div className={classes["section"]}>
          <p className={classes["label"]}>Avatar</p>
          <img
            src={user.user.profilePicture}
            alt={user.user.email}
            className={classes["avatar"]}
          />
        </div>
        <div className={classes["section"]}>
          <p className={classes["label"]}>E-mail</p>
          <p className={classes["value"]}>{user.user.email}</p>
        </div>
        <div className={classes["section"]}>
          <p className={classes["label"]}>Device type</p>
          <p className={classes["value"]}>{user.user.deviceType}</p>
        </div>
        <div className={classes["section"]}>
          <p className={classes["label"]}>Created on</p>
          <p className={classes["value"]}>
            {format(new Date(user.user.createdAt), "dd/MM/yyyy - hh:mm a")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
