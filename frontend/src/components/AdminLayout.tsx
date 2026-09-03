import { useState, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

const navItems = [
  {
    label: 'Overview',
    path: '/admin',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    )
  },
  {
    label: 'Products',
    path: '/admin/products',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    )
  },
  {
    label: 'Categories',
    path: '/admin/categories',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.386l3.35-1.97a2.25 2.25 0 00.902-1.258l1.493-6.027a2.25 2.25 0 00-.594-2.146L11.16 3.66A2.25 2.25 0 009.568 3z" />
      </svg>
    )
  },
  {
    label: 'Orders',
    path: '/admin/orders',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25V3.75m0 0A2.25 2.25 0 0012 1.5H6a2.25 2.25 0 00-2.25 2.25v13.5" />
      </svg>
    )
  },
  {
    label: 'Users',
    path: '/admin/users',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    )
  }
];

export default function AdminLayout({ children, title, subtitle, action }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('Signed out of admin portal.', 'info');
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-stone-900 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-stone-950 text-white px-4 py-3 flex items-center justify-between border-b border-stone-800">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 text-stone-400 hover:text-white"
            aria-label="Toggle admin sidebar"
          >
            <svg className="w-6 h-6 stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <span className="text-sm tracking-wider uppercase font-bold text-white">
            Admin Portal
          </span>
        </div>
        <Link to="/" className="text-xs uppercase tracking-wider text-[var(--color-accent-border)] hover:text-white font-semibold">
          Store &rarr;
        </Link>
      </div>

      {/* Sidebar Wrapper to stretch background and fill gap */}
      <div className="md:w-64 md:shrink-0 bg-stone-950">
        {/* Sidebar */}
        <aside
          className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-stone-950 text-stone-300 border-r border-stone-900 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-6">
          {/* Logo / Header */}
          <div className="flex items-center justify-between pb-6 border-b border-stone-800">
            <Link to="/" className="flex flex-col">
              <span className="text-base tracking-widest font-extrabold uppercase text-white">
                Garments
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[var(--color-accent)] font-semibold">
                Atelier Control
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-stone-400 hover:text-white p-1"
            >
              ✕
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs uppercase tracking-wider font-bold transition ${
                    active
                      ? 'bg-stone-900 text-white border-l-3 border-[var(--color-accent)] shadow-xs'
                      : 'text-stone-400 hover:bg-stone-900 hover:text-white'
                  }`}
                >
                  <span className={active ? 'text-[var(--color-accent)]' : 'text-stone-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User / Footer */}
        <div className="p-6 border-t border-stone-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="min-w-0">
              <p className="font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-[var(--color-accent)] uppercase tracking-wider font-semibold">Administrator</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs uppercase tracking-wider text-stone-400 hover:text-red-400 font-semibold"
              title="Sign Out"
            >
              Exit
            </button>
          </div>

          <div className="pt-1">
            <Link
              to="/"
              className="block text-center py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white text-xs uppercase tracking-wider font-bold rounded-lg transition"
            >
              &larr; View Storefront
            </Link>
          </div>
        </div>
      </aside>
      </div>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar header */}
        <header className="bg-white border-b border-stone-200/90 px-6 sm:px-10 py-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
                Admin Management
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight mt-0.5">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-stone-500 font-normal mt-0.5">{subtitle}</p>
              )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        </header>

        {/* Page Children */}
        <main className="p-6 sm:p-10 max-w-7xl w-full">{children}</main>
      </div>
    </div>
  );
}
