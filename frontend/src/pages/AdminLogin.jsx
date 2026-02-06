import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { healthCheck } from '../services/api';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');
  const { login } = useAuth();
  const navigate = useNavigate();

  // Check backend connection on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await healthCheck();
        if (response.data?.status === 'OK') {
          setBackendStatus('connected');
          return;
        }
        setBackendStatus('disconnected');
      } catch (error) {
        console.error('Backend check failed:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url
        });
        setBackendStatus('disconnected');
      }
    };
    checkBackend();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setError(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to connect to server. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-primary-blue mb-2">
          🔐 Admin Login
        </h1>
        <p className="text-center text-gray-600 mb-8">
          HKids Content Management
        </p>

        {/* Backend Status Indicator */}
        {backendStatus === 'checking' && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-xl text-sm">
            Checking backend connection...
          </div>
        )}
        {backendStatus === 'disconnected' && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm">
            ⚠️ Cannot connect to backend server. Please check:
            <ul className="list-disc list-inside mt-2 ml-2">
              <li>API routes are deployed correctly</li>
              <li>MongoDB connection is configured</li>
              <li>Environment variables are set in Vercel</li>
              <li>Check browser console (F12) for error details</li>
            </ul>
            <p className="mt-2 text-xs">
              Try visiting: <code className="bg-red-200 px-1 rounded">/api/health</code> directly
            </p>
          </div>
        )}
        {backendStatus === 'connected' && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-xl text-sm">
            ✅ Backend connected
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-lg font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-primary-blue focus:outline-none"
              placeholder="admin@hkids.com"
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-primary-blue focus:outline-none"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-large bg-primary-blue text-white disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-primary-blue hover:underline">
            ← Back to Home
          </a>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-xl">
          <p className="text-sm text-gray-600">
            <strong>Demo Credentials:</strong><br />
            Email: admin@hkids.com<br />
            Password: admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
