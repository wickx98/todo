import { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "./services/firebase";

interface ProtectedRouteProps {
  children: ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = auth.currentUser;

  if (!user) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;