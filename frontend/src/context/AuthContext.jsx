import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// API base URL - adjust if your backend runs on a different port
// Use the auth base so callers can use /login, /register, /me directly
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/auth';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load token from localStorage and verify with /me endpoint on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        
        if (storedToken) {
          // Set token in state
          setToken(storedToken);
          
          // Verify token by calling /api/auth/me
          try {
            const response = await axios.get(`${API_URL}/me`, {
              headers: {
                Authorization: `Bearer ${storedToken}`
              }
            });
            
            if (response.data.success && response.data.user) {
              // Token is valid, set user
              setUser(response.data.user);
              // Ensure token is stored consistently
              localStorage.setItem('token', storedToken);
              localStorage.setItem('user', JSON.stringify(response.data.user));
            } else {
              // Invalid response, clear storage
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setToken(null);
              setUser(null);
            }
          } catch (error) {
            // Token is invalid or expired, clear storage
            console.error('Token verification failed:', error.message || error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error.message || error);
        // Clear any corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // Call login API
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      });

      if (response.data.success && response.data.token && response.data.user) {
        const { token: newToken, user: userData } = response.data;

        // Store in state
        setToken(newToken);
        setUser(userData);

        // Store in localStorage (use consistent keys)
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));

        return { success: true, user: userData, token: newToken };
      } else {
        const msg = response.data?.message || 'Login failed';
        return { success: false, message: msg };
      }
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || error.message || 'Login failed. Please try again.';
      return { success: false, message };
    }
  };

  const register = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/register`, data);

      // If backend returned token/user (auto-login), set state/storage
      if (response.data && response.data.success && response.data.token && response.data.user) {
        const { token: newToken, user: userData } = response.data;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true, token: newToken, user: userData };
      }

      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Registration failed',
      };
    }
  };
  

  const logout = () => {
    // Clear state
    setToken(null);
    setUser(null);

    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export default AuthProvider;