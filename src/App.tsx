import { Routes, Route, Navigate } from "react-router-dom";
import { useSelectState } from "./store/selectors";
import SignInPage from "./screens/SignInPage";
import ProfilePage from "./screens/ProfilePage";
import DashboardPage from "./screens/DashboardPage";
import Reports from "./screens/Reports";

const App = () => {
  const { authentication } = useSelectState();

  return (
    <div className={"app-main-container"}>
      <Routes>
        {authentication.isAuthenticated ? (
          <>
            <Route path="dashboard" element={<DashboardPage />}>
              <Route path="profile" element={<ProfilePage />} />
              <Route path="reports" element={<Reports />} />
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
