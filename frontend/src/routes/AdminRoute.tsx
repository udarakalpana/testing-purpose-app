import { Navigate, Outlet } from 'react-router';
import { useAppSelector } from '../app/hooks';

/**
 * Keeps regular users out of admin-only screens.
 *
 * This is presentation only. The API enforces the same rule with a policy and
 * answers 403 regardless of what the client renders.
 */
export default function AdminRoute() {
  const role = useAppSelector((state) => state.auth.user?.role);

  return role === 'admin' ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
