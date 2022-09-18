import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelectState } from "./store/selectors";
import SignInPage from "./screens/SignInPage";
import ProfilePage from "./screens/ProfilePage";
import DashboardPage from "./screens/DashboardPage";
import Reports from "./screens/ProductsPage";
import Layout from "./components/Layout";
import ProductsPage from "./screens/ProductsPage";
import UsersPage from "./screens/UsersPage";
import EditProductPage from "./screens/EditProductPage";
import OrdersPage from "./screens/OrdersPage";
import ProductPage from "./screens/ProductPage";
import OrderPage from "./screens/OrderPage";
import UserPage from "./screens/UserPage";
import CreateProductPage from "./screens/CreateProductPage";
import { useDispatch } from "react-redux";
import API from "./constants/api";
import { AxiosResponse } from "axios";
import authenticationAsyncActions from "./store/actions/authentication.action";

const App = () => {
  const { authentication } = useSelectState();
  const dispatch = useDispatch();

  React.useEffect(() => {
    const launch = async () => {
      API.client.interceptors.response.use(
        (response: AxiosResponse<any>): AxiosResponse<any> => response,
        (error: any) => {
          if (error.response) {
            if (error.response.status === 403) {
              dispatch(authenticationAsyncActions.signout());
            }
          } else if (error.status) {
            if (error.status === 403) {
              dispatch(authenticationAsyncActions.signout());
            }
          }

          return Promise.reject(error);
        }
      );

      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        API.addAccessToken(accessToken);
      }
    };

    launch();
  }, []);

  return (
    <div className={"app-main-container"}>
      <Routes>
        {authentication.isAuthenticated ? (
          <>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="" element={<Layout />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route
                path="products/:productId/edit"
                element={<EditProductPage />}
              />
              <Route path="products/create" element={<CreateProductPage />} />
              <Route path="products/:productId" element={<ProductPage />} />
              <Route path="orders/:orderId" element={<OrderPage />} />
              <Route path="users/:userId" element={<UserPage />} />
            </Route>
          </>
        ) : (
          <>
            <Route path="sign-in" element={<SignInPage />} />
          </>
        )}
        <Route
          path="*"
          element={
            <Navigate
              to={authentication.isAuthenticated ? "/dashboard" : "/sign-in"}
              replace
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
