import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Loader } from '../components/ui/Loader';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { addToast } = useToast();

  const isRoleForbidden = Boolean(user && allowedRoles && !allowedRoles.includes(user.role));

  useEffect(() => {
    if (isRoleForbidden) {
      addToast('Access denied: Staff privileges required', 'warning');
    }
  }, [isRoleForbidden, addToast]);

  if (loading) {
    return <Loader fullScreen label="Verifying access..." />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isRoleForbidden) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;