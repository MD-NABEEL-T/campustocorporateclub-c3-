import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Loader } from '../components/ui/Loader';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, refreshUser } = useAuth();
  const location = useLocation();
  const { addToast } = useToast();

  const isRoleForbidden = Boolean(user && allowedRoles && !allowedRoles.includes(user.role));

  useEffect(() => {
    // If accessing a privileged route (admin/staff), verify permissions in the background
    if (user && allowedRoles && (allowedRoles.includes('admin') || allowedRoles.includes('coordinator'))) {
      refreshUser();
    }
  }, [location.pathname, allowedRoles, refreshUser]);

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

  // Force user to change temporary password before accessing portal routes
  if (user.mustChangePassword && location.pathname !== '/set-new-password') {
    return <Navigate to="/set-new-password" replace />;
  }

  if (isRoleForbidden) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;