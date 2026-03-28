import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';

/**
 * Dashboard wrapper: renders a role-specific dashboard component
 */
const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', margin: '0 auto 16px', border: '4px solid #e2e8f0', borderTop: '4px solid #5b8fc7', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ color: '#718096', fontSize: '14px' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Safely read role from user object
  const role = user?.role || (user?._doc?.role) || 'user';

  if (role === 'admin') return <AdminDashboard />;
  return <UserDashboard />;
};

export default Dashboard;
