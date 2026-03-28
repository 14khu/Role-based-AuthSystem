import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * RoleRoute component that restricts access based on user roles
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The component to render if access is granted
 * @param {string|string[]} props.allowedRoles - Single role or array of roles that can access this route
 */
const RoleRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            margin: '0 auto 16px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #5b8fc7',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#718096', fontSize: '14px' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Normalize allowedRoles to an array
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  // Get user's role (default to 'user' if not set)
  const userRole = user?.role || 'user';

  // Check if user's role is in the allowed roles
  const hasAccess = rolesArray.includes(userRole);

  // Redirect to unauthorized if role doesn't match
  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render the protected content if role matches
  return children;
};

export default RoleRoute;

