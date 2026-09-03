import React from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import FloatingWidgets from './components/FloatingWidgets';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';

// Protected Route for Authenticated Users
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

// Protected Route for Admin Users
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-text)] selection:bg-[var(--color-accent)] selection:text-white font-sans relative">
        {!isAdminRoute && <Navbar />}

        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Authenticated Customer Routes */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-confirmation/:id"
              element={
                <ProtectedRoute>
                  <OrderConfirmationPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Management Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <AdminProducts />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <AdminRoute>
                  <AdminCategories />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <AdminOrders />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              }
            />

            {/* 404 Page */}
            <Route
              path="*"
              element={
                <div className="max-w-2xl mx-auto px-4 py-24 text-center">
                  <span className="text-6xl font-extrabold text-stone-300">404</span>
                  <h1 className="text-2xl font-bold mt-2 mb-2 text-stone-900 tracking-tight">
                    Page Not Found
                  </h1>
                  <p className="text-xs text-stone-500 mb-6 max-w-sm mx-auto font-normal">
                    The collection or garment you are looking for may have been moved or is currently unavailable.
                  </p>
                  <Link
                    to="/"
                    className="inline-block bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs uppercase tracking-wider font-bold px-8 py-3.5 rounded-lg transition"
                  >
                    Return to Atelier
                  </Link>
                </div>
              }
            />
          </Routes>
        </main>

        {/* Global Floating Widgets */}
        {!isAdminRoute && <FloatingWidgets />}

        {/* Minimal Luxury Footer */}
        {!isAdminRoute && (
          <footer className="bg-stone-950 text-stone-300 border-t border-stone-900 pt-14 pb-10 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-stone-800">
                {/* Brand Philosophy */}
                <div className="space-y-3 md:col-span-1">
                  <Link to="/" className="inline-block">
                    <span className="text-lg tracking-widest font-extrabold uppercase text-white">
                      Garments Store
                    </span>
                  </Link>
                  <p className="text-xs text-stone-400 leading-relaxed font-normal">
                    Refined contemporary silhouettes crafted with purposeful minimalism, sustainable natural fabrics, and uncompromising attention to detail.
                  </p>
                </div>

                {/* Navigation */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                    Collection
                  </h3>
                  <ul className="space-y-2 text-xs text-stone-400 font-normal">
                    <li>
                      <Link to="/shop" className="hover:text-stone-100 transition">All Garments</Link>
                    </li>
                    <li>
                      <Link to="/shop" className="hover:text-stone-100 transition">New Arrivals</Link>
                    </li>
                    <li>
                      <Link to="/shop" className="hover:text-stone-100 transition">Essential Outerwear</Link>
                    </li>
                    <li>
                      <Link to="/shop" className="hover:text-stone-100 transition">Seasonal Edit</Link>
                    </li>
                  </ul>
                </div>

                {/* Customer Care */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                    Client Care
                  </h3>
                  <ul className="space-y-2 text-xs text-stone-400 font-normal">
                    <li>
                      <span className="hover:text-white cursor-pointer transition">Complimentary Shipping</span>
                    </li>
                    <li>
                      <span className="hover:text-white cursor-pointer transition">Returns & Exchanges</span>
                    </li>
                    <li>
                      <span className="hover:text-white cursor-pointer transition">Size & Fit Guide</span>
                    </li>
                    <li>
                      <span className="hover:text-white cursor-pointer transition">Fabric & Care Guide</span>
                    </li>
                  </ul>
                </div>

                {/* Editorial / Values */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                    Our Promise
                  </h3>
                  <p className="text-xs text-stone-400 leading-relaxed font-normal">
                    Every piece is tailored for longevity and versatile everyday elegance. Designed for conscious lifestyles.
                  </p>
                  <div className="pt-1 text-[11px] text-stone-400 uppercase tracking-wider font-semibold">
                    Karachi &bull; Lahore &bull; Islamabad &bull; Worldwide
                  </div>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500 font-normal">
                <p>© {new Date().getFullYear()} Garments Store. All rights reserved.</p>
                <div className="flex items-center space-x-5 text-[11px] uppercase tracking-wider">
                  <span className="hover:text-stone-400 cursor-pointer">Privacy</span>
                  <span className="hover:text-stone-400 cursor-pointer">Terms</span>
                  <span className="hover:text-stone-400 cursor-pointer">Accessibility</span>
                </div>
              </div>
            </div>
          </footer>
        )}
      </div>
    </ToastProvider>
  );
}

export default App;
