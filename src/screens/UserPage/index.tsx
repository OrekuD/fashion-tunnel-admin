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
      <p className={classes["title"]}>User page</p>
      <p>{user.user.email}</p>
    </div>
  );
};

export default UserPage;
