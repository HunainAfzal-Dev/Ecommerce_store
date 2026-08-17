import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function RegisterPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      const msg = 'Passwords do not match. Please verify.';
      setError(msg);
      showToast(msg, 'error');
      return;
    }

    setSubmitting(true);
    try {
      await signup(form.name, form.email, form.password);
      showToast('Welcome to Garments Store! Your account is active.', 'success');
      navigate('/');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
      showToast(msg, 'error');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="bg-white border border-stone-200/90 rounded-2xl p-8 sm:p-10 w-full max-w-md space-y-6 shadow-xs">
        {/* Header */}
        <div className="text-center space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
            Join the Atelier
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight">
            Create Account
          </h1>
          <p className="text-xs text-stone-500 font-normal">
            Enjoy personalized shopping, order tracking, and private drops.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[var(--color-primary)] transition"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[var(--color-primary)] transition"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[var(--color-primary)] transition"
              placeholder="At least 6 characters"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1">
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[var(--color-primary)] transition"
              placeholder="Repeat your password"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] disabled:opacity-50 text-white text-xs uppercase tracking-wider font-bold py-3.5 rounded-lg shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Register</span>
              )}
            </button>
          </div>
        </form>

        <div className="pt-3 border-t border-stone-100 text-center text-xs text-stone-500 font-normal">
          Already have an account?{' '}
          <Link to="/login" className="text-[var(--color-accent)] font-bold hover:underline underline-offset-4">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
