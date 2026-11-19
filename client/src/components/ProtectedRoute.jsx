import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function ProtectedRoute({ role }) {
  const { token, user } = useAuthStore();
  const location = useLocation();
  if (!token) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (role && user?.role !== role) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
