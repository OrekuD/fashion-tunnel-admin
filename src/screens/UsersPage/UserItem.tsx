import { format } from "date-fns";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { EditIcon, TrashIcon } from "../../components/Icons";
import Loader from "../../components/Loader";
import colors from "../../constants/colors";
import User from "../../models/User";
import usersAsyncActions from "../../store/actions/users.action";
import RequestManager from "../../store/request-manager";
import { useSelectState } from "../../store/selectors";
import classes from "./index.module.scss";

interface Props {
  user: User;
}

const UserItem = (props: Props) => {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const dispatch = useDispatch();
  const { request, products, users } = useSelectState();
  const navigate = useNavigate();
  const [updatedAt] = React.useState(request.updatedAt);

  React.useEffect(() => {
    if (updatedAt === request.updatedAt) {
      return;
    }
    const RM = new RequestManager(request, dispatch);

    if (RM.isFulfilled(usersAsyncActions.deleteUser.typePrefix)) {
      RM.consume(usersAsyncActions.deleteUser.typePrefix);
      setIsDeleting(false);
      return;
    }

    if (RM.isRejected(usersAsyncActions.deleteUser.typePrefix)) {
      RM.consume(usersAsyncActions.deleteUser.typePrefix);
      setIsDeleting(false);
      return;
    }
  }, [updatedAt, request.updatedAt]);

  return (
    <div
      className={classes["item"]}
      onClick={() => {
        navigate(`/products/${props.user.id}`);
      }}
    >
      <img
        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bW9kZWx8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
        alt={props.user.firstname}
        className={classes["image"]}
      />
      <div className={classes["col"]}>
        <p>{props.user.firstname}</p>
      </div>
      <div className={classes["col"]}>
        <p>{props.user.lastname}</p>
      </div>
      <div className={classes["col"]}>
        <p>{props.user.email}</p>
      </div>
      <div className={classes["col"]}>
        <p>{props.user.deviceType}</p>
      </div>
      <div className={classes["col"]}>
        <p>{format(new Date(props.user.createdAt), "dd/MM/yyyy")}</p>
        {/* <p>{format(new Date(props.user.createdAt), "dd/MM/yyyy:hh:mm aa")}</p> */}
      </div>
      <div className={classes["actions"]}>
        <button
          className={classes["button"]}
          onClick={(e) => {
            e.stopPropagation();
          }}
          disabled
        >
          <EditIcon width={18} height={18} color={colors.white} />
        </button>
        <button
          className={classes["button"]}
          disabled={isDeleting}
          onClick={(e) => {
            e.stopPropagation();
            setIsDeleting(true);
            dispatch(usersAsyncActions.deleteUser(props.user.id));
          }}
        >
          {isDeleting ? (
            <Loader color={colors.white} />
          ) : (
            <TrashIcon width={18} height={18} color={colors.white} />
          )}
        </button>
      </div>
    </div>
  );
};

export default UserItem;
