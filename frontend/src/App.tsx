import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { ToastProvider } from './context/ToastContext';

// Public pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Protected pages
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';

function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-[#faf9f6] text-stone-900 selection:bg-stone-900 selection:text-white">
        <Navbar />
        
        <main className="flex-1">
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected (require login) */}
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

            {/* Admin (require admin role) */}
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

            {/* 404 */}
            <Route
              path="*"
              element={
                <div className="max-w-2xl mx-auto px-4 py-28 text-center">
                  <span className="font-serif text-6xl text-stone-300">404</span>
                  <h1 className="text-2xl font-serif mt-3 mb-3 text-stone-900 tracking-wide">
                    Page Not Found
                  </h1>
                  <p className="text-sm text-stone-500 mb-8 max-w-sm mx-auto">
                    The collection or garment you are looking for may have been moved or is currently unavailable.
                  </p>
                  <Link
                    to="/"
                    className="inline-block bg-stone-900 hover:bg-stone-800 text-white text-xs uppercase tracking-widest font-semibold px-8 py-3.5 transition"
                  >
                    Return to Atelier
                  </Link>
                </div>
              }
            />
          </Routes>
        </main>

        {/* Minimal Luxury Footer */}
        <footer className="bg-stone-950 text-stone-300 border-t border-stone-900 pt-16 pb-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
              {/* Brand Philosophy */}
              <div className="space-y-4 md:col-span-1">
                <Link to="/" className="inline-block">
                  <span className="font-serif text-xl tracking-[0.2em] font-semibold uppercase text-white">
                    Garments Store
                  </span>
                </Link>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Refined modern silhouettes crafted with purposeful minimalism, sustainable natural fabrics, and uncompromising attention to detail.
                </p>
              </div>

              {/* Navigation */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-white mb-4">
                  Collection
                </h3>
                <ul className="space-y-2.5 text-xs text-stone-400">
                  <li>
                    <Link to="/shop" className="hover:text-white transition">All Garments</Link>
                  </li>
                  <li>
                    <Link to="/shop" className="hover:text-white transition">New Arrivals</Link>
                  </li>
                  <li>
                    <Link to="/shop" className="hover:text-white transition">Essential Outerwear</Link>
                  </li>
                  <li>
                    <Link to="/shop" className="hover:text-white transition">Seasonal Edit</Link>
                  </li>
                </ul>
              </div>

              {/* Customer Care */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-white mb-4">
                  Client Care
                </h3>
                <ul className="space-y-2.5 text-xs text-stone-400">
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
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-white mb-4">
                  Our Promise
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Every piece is tailored for longevity and versatile everyday elegance. Designed for conscious lifestyles.
                </p>
                <div className="pt-2 text-[11px] text-stone-500 uppercase tracking-widest">
                  Karachi &bull; Lahore &bull; Islamabad &bull; Worldwide
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
              <p>© {new Date().getFullYear()} Garments Store Atelier. All rights reserved.</p>
              <div className="flex items-center space-x-6 text-[11px] uppercase tracking-wider">
                <span className="hover:text-stone-400 cursor-pointer">Privacy</span>
                <span className="hover:text-stone-400 cursor-pointer">Terms</span>
                <span className="hover:text-stone-400 cursor-pointer">Accessibility</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ToastProvider>
  );
}

export default App;


