import React from "react";
import classes from "./index.module.scss";
import { useDispatch } from "react-redux";
import { useSelectState } from "../../store/selectors";
import { useNavigate } from "react-router-dom";
import RequestManager from "../../store/request-manager";
import usersAsyncActions from "../../store/actions/users.action";
import UserItem from "./UserItem";
import { ChevronRightIcon } from "../../components/Icons";
import colors from "../../constants/colors";

const UsersPage = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isScrollTop, setIsScrollTop] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const dispatch = useDispatch();
  const { request, products, users } = useSelectState();
  const navigate = useNavigate();

  React.useEffect(() => {
    dispatch(usersAsyncActions.index({ page: 1, size: 25 }));
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

  const fetchUsers = (page: number) => {
    setIsLoading(true);
    dispatch(usersAsyncActions.index({ page, size: 25 }));
  };

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
        {users.list.length === 0 ? (
          <div className={classes["no-users"]}>
            <p>You have no users</p>
          </div>
        ) : (
          <>
            {users.list.map((user, index) => (
              <UserItem key={index} user={user} />
            ))}
          </>
        )}
      </div>
      {users.list.length > 0 && (
        <div className={classes["pagination"]}>
          <button
            className={classes["button"]}
            disabled={users.meta.currentPage === 1}
            onClick={() =>
              fetchUsers(
                users.meta.currentPage === 1 ? 1 : users.meta.currentPage - 1
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
          <button className={classes["button"]} onClick={() => fetchUsers(1)}>
            <p
              style={{
                fontWeight: users.meta.currentPage === 1 ? 600 : 400,
                color:
                  users.meta.currentPage === 1 ? colors.deepgrey : undefined,
              }}
            >
              1
            </p>
          </button>
          {users.meta.totalPages > 1 && (
            <button className={classes["button"]} onClick={() => fetchUsers(2)}>
              <p
                style={{
                  fontWeight: users.meta.currentPage === 2 ? 600 : 400,
                  color:
                    users.meta.currentPage === 2 ? colors.deepgrey : undefined,
                }}
              >
                2
              </p>
            </button>
          )}
          {users.meta.currentPage > 2 &&
            users.meta.currentPage !== users.meta.totalPages && (
              <button
                className={classes["button"]}
                onClick={() => fetchUsers(users.meta.currentPage)}
              >
                <p
                  style={{
                    fontWeight: 600,
                    color: colors.deepgrey,
                  }}
                >
                  {users.meta.currentPage}
                </p>
              </button>
            )}
          {users.meta.totalPages > 3 && <p className={classes["dots"]}>...</p>}
          <button
            className={classes["button"]}
            onClick={() => fetchUsers(users.meta.totalPages)}
          >
            <p
              style={{
                fontWeight:
                  users.meta.currentPage === users.meta.totalPages ? 600 : 400,
                color:
                  users.meta.currentPage === users.meta.totalPages
                    ? colors.deepgrey
                    : undefined,
              }}
            >
              {users.meta.totalPages}
            </p>
          </button>
          <button
            className={classes["button"]}
            disabled={users.meta.nextPage === users.meta.currentPage}
            onClick={() => fetchUsers(users.meta.nextPage)}
          >
            <ChevronRightIcon width={24} height={24} color={colors.deepgrey} />
          </button>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
