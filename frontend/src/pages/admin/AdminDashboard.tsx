import { Link } from 'react-router-dom';

const statCards = [
  {
    title: 'Products',
    description: 'Manage your product catalog',
    icon: '👕',
    link: '/admin/products',
    color: 'bg-indigo-50 hover:bg-indigo-100'
  },
  {
    title: 'Categories',
    description: 'Organize products by category',
    icon: '🏷️',
    link: '/admin/categories',
    color: 'bg-purple-50 hover:bg-purple-100'
  },
  {
    title: 'Orders',
    description: 'View and manage customer orders',
    icon: '📦',
    link: '/admin/orders',
    color: 'bg-green-50 hover:bg-green-100'
  },
  {
    title: 'Users',
    description: 'Manage users and assign roles',
    icon: '👥',
    link: '/admin/users',
    color: 'bg-amber-50 hover:bg-amber-100'
  }
];

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Manage your store's products, categories, and orders.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className={`${card.color} rounded-lg p-8 text-center transition`}
          >
            <span className="text-4xl">{card.icon}</span>
            <h2 className="text-xl font-bold text-gray-900 mt-3">{card.title}</h2>
            <p className="text-gray-600 text-sm mt-1">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

