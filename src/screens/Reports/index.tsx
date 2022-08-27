import { AxiosResponse } from "axios";
import React from "react";
import classes from "./index.module.scss";
import API from "../../constants/api";
import { useDispatch } from "react-redux";
import { useSelectState } from "../../store/selectors";
import { Link } from "react-router-dom";

const Reports = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const dispatch = useDispatch();
  // const { reports } = useSelectState();

  return (
    <div className={classes["container"]}>
      <p className={classes["title"]}>Reports</p>
      <div className={classes["scans"]}>
        {/* {reports.data.map(({ _id, image_url }) => (
          <Link
            to={`/dashboard/report/${_id}`}
            className={classes["scan"]}
            key={_id}
          >
            <img src={image_url} />
          </Link>
        ))} */}
      </div>
    </div>
  );
};

export default Reports;
