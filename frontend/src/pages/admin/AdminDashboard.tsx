import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import Loader from '../../components/Loader';
import { productApi, categoryApi, orderApi, userApi } from '../../api/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    productsCount: 0,
    categoriesCount: 0,
    ordersCount: 0,
    usersCount: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [prodRes, catRes, ordRes, userRes] = await Promise.all([
          productApi.getAll(),
          categoryApi.getAll(),
          orderApi.getAll(),
          userApi.getAll()
        ]);

        const products = prodRes.data.data.products || [];
        const categories = catRes.data.data.categories || [];
        const orders = ordRes.data.data.orders || [];
        const users = userRes.data.data.users || [];

        const revenue = orders.reduce((sum: number, ord: any) => sum + Number(ord.total_amount || 0), 0);

        setStats({
          productsCount: products.length,
          categoriesCount: categories.length,
          ordersCount: orders.length,
          usersCount: users.length,
          totalRevenue: revenue
        });
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Overview" subtitle="Loading analytics...">
        <Loader message="Compiling store metrics..." />
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: 'Active Products',
      value: stats.productsCount,
      description: 'Garments in catalog',
      link: '/admin/products',
      linkText: 'Manage Products'
    },
    {
      title: 'Departments',
      value: stats.categoriesCount,
      description: 'Product classifications',
      link: '/admin/categories',
      linkText: 'Manage Categories'
    },
    {
      title: 'Total Orders',
      value: stats.ordersCount,
      description: 'Orders placed',
      link: '/admin/orders',
      linkText: 'Review Orders'
    },
    {
      title: 'Registered Users',
      value: stats.usersCount,
      description: 'Clients & Administrators',
      link: '/admin/users',
      linkText: 'Manage Roles'
    }
  ];

  return (
    <AdminLayout
      title="Atelier Overview"
      subtitle="Comprehensive performance metrics and management shortcuts."
    >
      <div className="space-y-8">
        {/* Total Revenue Highlight */}
        <div className="bg-[var(--color-primary)] text-white p-8 sm:p-10 rounded-2xl border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-[var(--color-accent-border)] font-bold">
              Gross Store Revenue
            </span>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Rs. {stats.totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-stone-400 font-normal pt-1">
              Calculated across all processed customer orders.
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-xs uppercase tracking-wider font-bold px-6 py-3.5 rounded-lg text-center shrink-0 shadow-sm transition"
          >
            Inspect Orders &rarr;
          </Link>
        </div>

        {/* 4 Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((card) => (
            <div
              key={card.title}
              className="bg-white border border-stone-200/90 rounded-xl p-6 flex flex-col justify-between space-y-4 hover:border-stone-400 shadow-xs transition"
            >
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider font-bold text-stone-400">
                  {card.title}
                </span>
                <p className="text-3xl font-extrabold text-stone-950 tracking-tight">
                  {card.value}
                </p>
                <p className="text-xs text-stone-500 font-normal">
                  {card.description}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100">
                <Link
                  to={card.link}
                  className="text-xs uppercase tracking-wider font-bold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition flex items-center justify-between"
                >
                  <span>{card.linkText}</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Management Shortcuts */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-6 sm:p-8 space-y-6 shadow-xs">
          <h2 className="text-lg font-bold text-stone-950 pb-3 border-b border-stone-100">
            Management Hub
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Link
              to="/admin/products"
              className="p-5 bg-[var(--color-surface-subtle)] border border-stone-200/80 rounded-xl hover:border-[var(--color-primary)] transition block space-y-2 group"
            >
              <p className="font-bold text-sm text-stone-900 group-hover:text-[var(--color-accent)] transition-colors">
                Product Catalog
              </p>
              <p className="text-xs text-stone-500 font-normal leading-relaxed">
                Add new garments, update prices, manage stock quantities, or toggle visibility.
              </p>
            </Link>

            <Link
              to="/admin/categories"
              className="p-5 bg-[var(--color-surface-subtle)] border border-stone-200/80 rounded-xl hover:border-[var(--color-primary)] transition block space-y-2 group"
            >
              <p className="font-bold text-sm text-stone-900 group-hover:text-[var(--color-accent)] transition-colors">
                Departments & Tags
              </p>
              <p className="text-xs text-stone-500 font-normal leading-relaxed">
                Organize your catalog by creating new garment departments and seasonal tags.
              </p>
            </Link>

            <Link
              to="/admin/orders"
              className="p-5 bg-[var(--color-surface-subtle)] border border-stone-200/80 rounded-xl hover:border-[var(--color-primary)] transition block space-y-2 group"
            >
              <p className="font-bold text-sm text-stone-900 group-hover:text-[var(--color-accent)] transition-colors">
                Fulfillment Pipeline
              </p>
              <p className="text-xs text-stone-500 font-normal leading-relaxed">
                Track pending customer orders, update dispatch status, and review delivery details.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
