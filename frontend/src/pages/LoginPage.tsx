import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await login(form.email, form.password);
      showToast('Welcome back to Garments Store.', 'success');
      navigate('/');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid email or password.';
      setError(msg);
      showToast(msg, 'error');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="bg-white border border-stone-200 p-8 sm:p-12 w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 font-semibold">
            Member Access
          </p>
          <h1 className="font-serif text-3xl text-stone-950 font-normal">
            Sign In
          </h1>
          <p className="text-xs text-stone-500 font-light">
            Enter your credentials to access your garments account.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white border border-stone-300 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-950 rounded-none transition"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-2">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white border border-stone-300 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-950 rounded-none transition"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-stone-950 hover:bg-stone-800 disabled:opacity-50 text-white text-xs uppercase tracking-widest font-semibold py-4 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-stone-200 text-center text-xs text-stone-500 font-light">
          Don't have an account?{' '}
          <Link to="/register" className="text-stone-950 font-semibold hover:underline underline-offset-4">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
