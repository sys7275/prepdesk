import { Navigate, useLocation } from "react-router-dom";

function hasActiveSession() {
  try {
    const token = localStorage.getItem("prepdesk_token");
    const rawUser = localStorage.getItem("prepdesk_user");
    const user = rawUser ? JSON.parse(rawUser) : null;
    return Boolean(token && user);
  } catch {
    return false;
  }
}

function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!hasActiveSession()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default ProtectedRoute;