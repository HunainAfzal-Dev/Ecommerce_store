import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Loader from '../../components/Loader';
import { userApi } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import type { User } from '../../types';

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const { showToast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userApi.getAll();
      setUsers(res.data.data.users || []);
    } catch (err) {
      console.error('Failed to load users', err);
      showToast('Failed to retrieve user accounts.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id: string, role: string, userName: string) => {
    if (id === currentUser?.id && role === 'customer') {
      showToast('You cannot demote your own administrator account.', 'error');
      return;
    }
    setSaving(id);
    try {
      await userApi.updateRole(id, role);
      showToast(`User "${userName}" role updated to "${role}".`, 'success');
      await fetchUsers();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update user role', 'error');
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (user: User) => {
    if (user.id === currentUser?.id) {
      showToast('You cannot delete your own active account.', 'error');
      return;
    }
    if (
      !confirm(
        `Permanently delete account for "${user.name}" (${user.email})? This action cannot be undone.`
      )
    )
      return;
    try {
      await userApi.remove(user.id);
      showToast(`Account for "${user.name}" deleted.`, 'info');
      await fetchUsers();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to delete user', 'error');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      u.email.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <AdminLayout
      title="User Accounts & Permissions"
      subtitle="Manage registered clients and assign administrator privileges."
    >
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-stone-200 p-4">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by client name or email..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 rounded-none"
            />
            <svg
              className="w-4 h-4 text-stone-400 absolute left-3 top-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <span className="text-xs text-stone-500 font-light">
            Showing {filteredUsers.length} of {users.length} accounts
          </span>
        </div>

        {/* Users Table */}
        {loading ? (
          <Loader message="Loading accounts..." />
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white border border-stone-200 p-16 text-center space-y-3">
            <p className="font-serif text-2xl text-stone-400">No Accounts Found</p>
            <p className="text-xs text-stone-500 font-light">
              No registered users match your search query.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-stone-200 overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-200 text-xs text-left">
              <thead className="bg-[#faf9f6] text-stone-500 uppercase tracking-widest text-[10px] font-semibold">
                <tr>
                  <th className="px-6 py-4">Account Member</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role Permission</th>
                  <th className="px-6 py-4">Registration</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 font-light text-stone-800">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50/70 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center font-serif text-xs font-semibold shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="font-medium text-stone-950 flex items-center gap-2">
                          <span>{u.name}</span>
                          {u.id === currentUser?.id && (
                            <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold bg-stone-100 text-stone-800 border border-stone-200">
                              You
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-stone-600">
                      {u.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={u.role}
                        disabled={saving === u.id || u.id === currentUser?.id}
                        onChange={(e) => handleRoleChange(u.id, e.target.value, u.name)}
                        className="px-2.5 py-1.5 bg-white border border-stone-300 text-stone-900 text-xs focus:outline-none focus:border-stone-950 rounded-none disabled:opacity-50"
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Administrator</option>
                      </select>
                      {saving === u.id && (
                        <span className="ml-2 text-[10px] text-stone-400 animate-pulse">
                          Saving...
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-stone-500 whitespace-nowrap">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(u)}
                        disabled={u.id === currentUser?.id}
                        className="text-red-600 hover:text-red-800 font-semibold uppercase tracking-wider text-[11px] disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
