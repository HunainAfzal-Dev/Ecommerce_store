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
      description: 'Garments in live catalog',
      link: '/admin/products',
      linkText: 'Manage Products',
      textColor: 'text-[var(--color-stat-products)]',
      bgColor: 'bg-[var(--color-stat-products-bg)]',
      borderColor: 'border-[var(--color-stat-products-border)]',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      title: 'Departments',
      value: stats.categoriesCount,
      description: 'Product classifications',
      link: '/admin/categories',
      linkText: 'Manage Categories',
      textColor: 'text-[var(--color-stat-categories)]',
      bgColor: 'bg-[var(--color-stat-categories-bg)]',
      borderColor: 'border-[var(--color-stat-categories-border)]',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.386l3.35-1.97a2.25 2.25 0 00.902-1.258l1.493-6.027a2.25 2.25 0 00-.594-2.146L11.16 3.66A2.25 2.25 0 009.568 3z" />
        </svg>
      )
    },
    {
      title: 'Total Orders',
      value: stats.ordersCount,
      description: 'Processed customer orders',
      link: '/admin/orders',
      linkText: 'Review Orders',
      textColor: 'text-[var(--color-stat-orders)]',
      bgColor: 'bg-[var(--color-stat-orders-bg)]',
      borderColor: 'border-[var(--color-stat-orders-border)]',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25V3.75m0 0A2.25 2.25 0 0012 1.5H6a2.25 2.25 0 00-2.25 2.25v13.5" />
        </svg>
      )
    },
    {
      title: 'Registered Users',
      value: stats.usersCount,
      description: 'Clients & Administrators',
      link: '/admin/users',
      linkText: 'Manage Roles',
      textColor: 'text-[var(--color-stat-users)]',
      bgColor: 'bg-[var(--color-stat-users-bg)]',
      borderColor: 'border-[var(--color-stat-users-border)]',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      )
    }
  ];

  return (
    <AdminLayout
      title="Atelier Overview"
      subtitle="Comprehensive performance metrics and management shortcuts."
    >
      <div className="space-y-8">
        {/* Total Revenue Highlight Card with Emerald Accent */}
        <div className="bg-white border border-[var(--color-stat-revenue-border)] p-8 sm:p-10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-1.5 bg-[var(--color-stat-revenue)]"></div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-stat-revenue-bg)] text-[var(--color-stat-revenue)] border border-[var(--color-stat-revenue-border)] flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs uppercase tracking-wider font-bold text-stone-500">
                Gross Store Revenue
              </span>
            </div>

            <p className="text-3xl sm:text-4xl font-extrabold text-[var(--color-stat-revenue)] tracking-tight">
              Rs. {stats.totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-stone-500 font-normal">
              Calculated across all processed customer orders.
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs uppercase tracking-wider font-bold px-6 py-3.5 rounded-lg text-center shrink-0 shadow-sm transition"
          >
            Inspect Orders &rarr;
          </Link>
        </div>

        {/* 4 Semantic KPI Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((card) => (
            <div
              key={card.title}
              className="bg-white border border-stone-200/90 rounded-xl p-6 flex flex-col justify-between space-y-4 hover:border-stone-400 shadow-xs transition group"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-stone-500">
                    {card.title}
                  </span>
                  <p className={`text-3xl font-extrabold tracking-tight ${card.textColor}`}>
                    {card.value}
                  </p>
                </div>
                <div className={`w-9 h-9 rounded-lg ${card.bgColor} ${card.textColor} border ${card.borderColor} flex items-center justify-center shrink-0`}>
                  {card.icon}
                </div>
              </div>

              <p className="text-xs text-stone-500 font-normal">
                {card.description}
              </p>

              <div className="pt-3 border-t border-stone-100">
                <Link
                  to={card.link}
                  className={`text-xs uppercase tracking-wider font-bold ${card.textColor} hover:opacity-80 transition flex items-center justify-between`}
                >
                  <span>{card.linkText}</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
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
              className="p-5 bg-[var(--color-surface-subtle)] border border-stone-200/80 rounded-xl hover:border-[var(--color-stat-products)] transition block space-y-2 group"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--color-stat-products)]"></span>
                <p className="font-bold text-sm text-stone-900 group-hover:text-[var(--color-stat-products)] transition-colors">
                  Product Catalog
                </p>
              </div>
              <p className="text-xs text-stone-500 font-normal leading-relaxed">
                Add new garments, update prices, manage stock quantities, or toggle visibility.
              </p>
            </Link>

            <Link
              to="/admin/categories"
              className="p-5 bg-[var(--color-surface-subtle)] border border-stone-200/80 rounded-xl hover:border-[var(--color-stat-categories)] transition block space-y-2 group"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--color-stat-categories)]"></span>
                <p className="font-bold text-sm text-stone-900 group-hover:text-[var(--color-stat-categories)] transition-colors">
                  Departments & Tags
                </p>
              </div>
              <p className="text-xs text-stone-500 font-normal leading-relaxed">
                Organize your catalog by creating new garment departments and seasonal tags.
              </p>
            </Link>

            <Link
              to="/admin/orders"
              className="p-5 bg-[var(--color-surface-subtle)] border border-stone-200/80 rounded-xl hover:border-[var(--color-stat-orders)] transition block space-y-2 group"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--color-stat-orders)]"></span>
                <p className="font-bold text-sm text-stone-900 group-hover:text-[var(--color-stat-orders)] transition-colors">
                  Fulfillment Pipeline
                </p>
              </div>
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
