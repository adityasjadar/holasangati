import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

// roles: array of allowed role strings, e.g. ['owner'] or ['admin']
export default function RequireRole({ roles, children }) {
  const { role, loading } = useAuth();
  if (loading) return null;
  if (!role || !roles.includes(role)) return <Navigate to="/" replace />;
  return children;
}
