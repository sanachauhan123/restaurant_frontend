import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element }) => {
  // Check if the user is authenticated (Example: Using localStorage)
  const isAuthenticated = localStorage.getItem("loginuser") !== null;

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
