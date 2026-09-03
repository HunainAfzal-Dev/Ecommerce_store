import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

// Public pages
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductDetailPage from './pages/ProductDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

// Protected pages
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminCategories from './pages/admin/AdminCategories'
import AdminOrders from './pages/admin/AdminOrders'
import AdminUsers from './pages/admin/AdminUsers'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
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
              <div className="text-center py-20">
                <p className="text-6xl mb-4">404</p>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Page Not Found
                </h1>
                <a href="/" className="text-indigo-600 hover:text-indigo-800">
                  Back to Home
                </a>
              </div>
            }
          />
        </Routes>
      </main>
      <footer className="bg-gray-900 text-white text-center py-6 mt-12">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} Garments Store. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

export default App

