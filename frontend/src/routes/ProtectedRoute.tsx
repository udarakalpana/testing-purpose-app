import { Navigate, Outlet } from 'react-router';
import { useAppSelector } from '../app/hooks';

export default function ProtectedRoute() {
  const token = useAppSelector((state) => state.auth.token);

  return token ? <Outlet /> : <Navigate to="/" replace />;
}
