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
      <AdminLayout title="Overview" subtitle="Loading atelier analytics...">
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
      <div className="space-y-10">
        {/* Total Revenue Highlight */}
        <div className="bg-stone-950 text-white p-8 sm:p-10 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-semibold">
              Gross Store Revenue
            </p>
            <p className="font-serif text-3xl sm:text-4xl font-normal text-white">
              Rs. {stats.totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-stone-400 font-light pt-1">
              Calculated across all processed customer orders.
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="bg-white hover:bg-stone-100 text-stone-950 text-xs uppercase tracking-widest font-semibold px-6 py-3.5 text-center shrink-0 transition"
          >
            Inspect Orders &rarr;
          </Link>
        </div>

        {/* 4 Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => (
            <div
              key={card.title}
              className="bg-white border border-stone-200 p-6 flex flex-col justify-between space-y-4 hover:border-stone-400 transition"
            >
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-stone-400">
                  {card.title}
                </p>
                <p className="font-serif text-3xl text-stone-950 font-normal">
                  {card.value}
                </p>
                <p className="text-xs text-stone-500 font-light">
                  {card.description}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100">
                <Link
                  to={card.link}
                  className="text-xs uppercase tracking-wider font-semibold text-stone-900 hover:text-stone-600 transition flex items-center justify-between"
                >
                  <span>{card.linkText}</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Management Shortcuts */}
        <div className="bg-white border border-stone-200 p-8 space-y-6">
          <h2 className="font-serif text-xl text-stone-950 font-normal pb-4 border-b border-stone-200">
            Management Hub
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Link
              to="/admin/products"
              className="p-5 bg-[#faf9f6] border border-stone-200 hover:border-stone-950 transition block space-y-2 group"
            >
              <p className="font-semibold text-sm text-stone-900 group-hover:text-stone-600">
                Product Catalog
              </p>
              <p className="text-xs text-stone-500 font-light">
                Add new garments, update prices, manage stock quantities, or toggle visibility.
              </p>
            </Link>

            <Link
              to="/admin/categories"
              className="p-5 bg-[#faf9f6] border border-stone-200 hover:border-stone-950 transition block space-y-2 group"
            >
              <p className="font-semibold text-sm text-stone-900 group-hover:text-stone-600">
                Departments & Tags
              </p>
              <p className="text-xs text-stone-500 font-light">
                Organize your catalog by creating new garment departments and seasonal tags.
              </p>
            </Link>

            <Link
              to="/admin/orders"
              className="p-5 bg-[#faf9f6] border border-stone-200 hover:border-stone-950 transition block space-y-2 group"
            >
              <p className="font-semibold text-sm text-stone-900 group-hover:text-stone-600">
                Fulfillment Pipeline
              </p>
              <p className="text-xs text-stone-500 font-light">
                Track pending customer orders, update dispatch status, and review delivery details.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
