import { Navigate } from "react-router";
import useRole from "../hooks/useRole";

const AdminRoute = ({ children }) => {
  const { role, isLoading } = useRole();

  if (isLoading) return <div>Loading...</div>;
  if (role !== "admin") return <Navigate to="/unauthorized" replace />;

  return children;
};

export default AdminRoute;
