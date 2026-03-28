import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminStats = [
    {
      title: 'Total Users',
      value: '1,234',
      color: '#5b8fc7',
    },
    {
      title: 'Active Sessions',
      value: '567',
      color: '#68a085',
    },
    {
      title: 'System Health',
      value: '98%',
      color: '#5b9a8f',
    },
  ];

  const personalStats = [
    {
      title: 'My Tasks',
      value: '12',
      color: '#c99a6a',
    },
    {
      title: 'Completed',
      value: '45',
      color: '#68a085',
    },
    {
      title: 'In Progress',
      value: '8',
      color: '#5b8fc7',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px', background: '#d4e3f0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          background: '#f0f5fa',
          borderRadius: '12px',
          padding: '24px 32px',
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '600', color: '#2d3748', margin: 0 }}>Admin Dashboard</h1>
            <p style={{ fontSize: '14px', color: '#718096', margin: 0 }}>Welcome back, {user?.name || 'Administrator'}!</p>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ width: 'auto', padding: '10px 20px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {adminStats.concat(personalStats).map((stat, index) => (
            <div key={index} className="stat-card" style={{ background: '#f0f5fa', borderRadius: '12px', padding: '24px', borderLeft: `4px solid ${stat.color}` }}>
              <div style={{ fontSize: '14px', color: '#718096', fontWeight: '500', marginBottom: '12px' }}>{stat.title}</div>
              <div style={{ fontSize: '32px', fontWeight: '600', color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#f0f5fa', borderRadius: '12px', padding: '32px' }}>
          <h2 style={{ marginTop: 0 }}>{'System Overview'}</h2>
          <p style={{ color: '#718096' }}>You have full access to system-wide metrics and user management.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
