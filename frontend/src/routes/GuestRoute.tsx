import { Navigate, Outlet } from 'react-router';
import { useAppSelector } from '../app/hooks';

export default function GuestRoute() {
  const token = useAppSelector((state) => state.auth.token);

  return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
