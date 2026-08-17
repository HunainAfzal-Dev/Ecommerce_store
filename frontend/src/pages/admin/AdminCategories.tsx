import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Loader from '../../components/Loader';
import { categoryApi } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import type { Category } from '../../types';

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryApi.getAll();
      setCategories(res.data.data.categories || []);
    } catch (err) {
      console.error('Failed to load categories', err);
      showToast('Failed to load categories.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setName('');
    setDescription('');
    setEditingId(null);
    setError('');
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setName(category.name);
    setDescription(category.description || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (editingId) {
        await categoryApi.update(editingId, { name, description: description || undefined });
        showToast(`Category "${name}" updated.`, 'success');
      } else {
        await categoryApi.create({ name, description: description || undefined });
        showToast(`Category "${name}" created.`, 'success');
      }
      resetForm();
      await fetchCategories();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save category';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Delete category "${catName}"? Products in it will be affected.`)) return;
    try {
      await categoryApi.remove(id);
      showToast(`Category "${catName}" deleted.`, 'info');
      await fetchCategories();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to delete category', 'error');
    }
  };

  return (
    <AdminLayout
      title="Departments & Categories"
      subtitle="Define garment classifications and collection departments."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Category Form */}
        <div className="lg:col-span-5">
          <form onSubmit={handleSubmit} className="bg-white border border-stone-200 p-6 sm:p-8 space-y-5 sticky top-28">
            <h2 className="font-serif text-xl text-stone-950 font-normal pb-4 border-b border-stone-200">
              {editingId ? 'Edit Department' : 'Create Department'}
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-xs">
                {error}
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                  Department Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 text-stone-900 focus:outline-none focus:border-stone-950 rounded-none"
                  placeholder="e.g. Kurtas & Tunics, Outerwear, Trousers"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-stone-700 mb-1.5">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 text-stone-900 focus:outline-none focus:border-stone-950 rounded-none"
                  placeholder="Brief narrative for this collection department..."
                />
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-stone-950 hover:bg-stone-800 disabled:opacity-50 text-white text-xs uppercase tracking-widest font-semibold px-6 py-3 transition"
              >
                {saving ? 'Saving...' : editingId ? 'Update' : 'Add Department'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="border border-stone-300 text-stone-700 text-xs uppercase tracking-wider font-semibold px-4 py-3 hover:bg-stone-50 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right: Categories Table */}
        <div className="lg:col-span-7">
          {loading ? (
            <Loader message="Loading categories..." />
          ) : categories.length === 0 ? (
            <div className="bg-white border border-stone-200 p-12 text-center space-y-2">
              <p className="font-serif text-xl text-stone-400">No Departments Found</p>
              <p className="text-xs text-stone-500 font-light">
                Use the form on the left to add your first garment category.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-stone-200 overflow-x-auto">
              <table className="min-w-full divide-y divide-stone-200 text-xs text-left">
                <thead className="bg-[#faf9f6] text-stone-500 uppercase tracking-widest text-[10px] font-semibold">
                  <tr>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 font-light text-stone-800">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-stone-50/70 transition">
                      <td className="px-6 py-4 font-medium text-stone-950">
                        {category.name}
                      </td>
                      <td className="px-6 py-4 text-stone-500 max-w-xs truncate">
                        {category.description || '—'}
                      </td>
                      <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-stone-900 hover:text-stone-600 font-semibold uppercase tracking-wider text-[11px]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category.id, category.name)}
                          className="text-red-600 hover:text-red-800 font-semibold uppercase tracking-wider text-[11px]"
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
      </div>
    </AdminLayout>
  );
}
