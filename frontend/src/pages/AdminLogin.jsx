import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Mail,
  Lock,
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
  Library
} from 'lucide-react';
import { useAuth } from '../services/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setError(result.message || 'Invalid email or password.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to sign in right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-ink-50">
      {/* Brand panel */}
      <aside className="relative hidden lg:flex flex-col justify-between p-10 text-white overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(145deg, rgba(8, 145, 178, 0.92), rgba(15, 118, 110, 0.88)), url(/images/hkids-kids-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">
              <Library className="w-5 h-5" />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight">HKids</span>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="font-display text-4xl xl:text-5xl font-bold leading-tight mb-4">
            Manage your digital library with clarity.
          </h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Sign in to publish books, organize age groups, and keep reading experiences polished for every learner.
          </p>
        </div>

        <p className="relative z-10 text-sm text-white/65">
          Secure admin access for content editors
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[420px]">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-brand-700 mb-8 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="mb-8">
            <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center mb-5 shadow-soft lg:hidden">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink-900 tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-ink-500 text-base">
              Sign in to the HKids admin workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-2xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="admin-email" className="block text-sm font-semibold text-ink-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-ink-300 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="field-input pl-11"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-sm font-semibold text-ink-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-ink-300 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="field-input pl-11 pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl text-ink-400 hover:text-ink-700 hover:bg-ink-100 flex items-center justify-center transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary btn-large disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Sign in
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;
