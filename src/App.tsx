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

const App = () => {
  const { authentication } = useSelectState();

  return (
    <div className={"app-main-container"}>
      <Routes>
        {authentication.isAuthenticated ? (
          <>
            <Route path="" element={<Layout />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="orders" element={<ProfilePage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route
                path="products/:productId/edit"
                element={<EditProductPage />}
              />
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
