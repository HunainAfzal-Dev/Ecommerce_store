import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Loader from '../../components/Loader';
import { productApi, categoryApi } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import type { Product, Category } from '../../types';

const emptyForm = {
  category_id: '',
  name: '',
  description: '',
  price: '',
  image_url: '',
  stock_quantity: '',
  is_active: true
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const { showToast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productApi.getAll(),
        categoryApi.getAll()
      ]);
      setProducts(productsRes.data.data.products || []);
      setCategories(categoriesRes.data.data.categories || []);
    } catch (err) {
      console.error('Failed to load data', err);
      showToast('Failed to load catalog data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value =
      e.target.name === 'is_active'
        ? e.target.value === 'true'
        : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(false);
    setError('');
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      category_id: product.category_id,
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      image_url: product.image_url || '',
      stock_quantity: String(product.stock_quantity),
      is_active: product.is_active
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      category_id: form.category_id,
      name: form.name,
      description: form.description || undefined,
      price: Number(form.price),
      image_url: form.image_url || undefined,
      stock_quantity: Number(form.stock_quantity),
      is_active: form.is_active
    };

    try {
      if (editingId) {
        await productApi.update(editingId, payload);
        showToast(`Product "${form.name}" updated successfully.`, 'success');
      } else {
        await productApi.create(payload);
        showToast(`Product "${form.name}" created successfully.`, 'success');
      }
      resetForm();
      await fetchData();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save product';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;
    try {
      await productApi.remove(id);
      showToast(`Product "${name}" deleted.`, 'info');
      await fetchData();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to delete product', 'error');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    (p.categories?.name && p.categories.name.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  const actionButton = (
    <button
      onClick={() => {
        resetForm();
        setShowModal(true);
      }}
      className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-xs uppercase tracking-wider font-bold px-4 py-2.5 rounded-lg shadow-sm transition"
    >
      + New Garment
    </button>
  );

  return (
    <AdminLayout
      title="Product Catalog"
      subtitle="Manage garments, update inventory levels, and control catalog visibility."
      action={actionButton}
    >
      <div className="space-y-6">
        {/* Search / Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-stone-200/90 rounded-xl p-4 shadow-xs">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search products by title or department..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[var(--color-primary)]"
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
          <span className="text-xs text-stone-500 font-normal">
            Showing {filteredProducts.length} of {products.length} garments
          </span>
        </div>

        {/* Products Table */}
        {loading ? (
          <Loader message="Loading garments catalog..." />
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white border border-stone-200/90 rounded-xl p-16 text-center space-y-3 shadow-xs">
            <p className="text-2xl font-bold text-stone-400">No Garments Found</p>
            <p className="text-xs text-stone-500 font-normal">
              {searchFilter ? 'Try clearing your search query.' : 'Click "+ New Garment" to add your first product.'}
            </p>
          </div>
        ) : (
          <div className="bg-white border border-stone-200/90 rounded-xl overflow-x-auto shadow-xs">
            <table className="min-w-full divide-y divide-stone-200 text-xs text-left">
              <thead className="bg-[var(--color-surface-subtle)] text-stone-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="px-6 py-4">Garment</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 font-normal text-stone-800">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-stone-50/70 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-12 bg-[#f7f5f1] border border-stone-200 rounded-md shrink-0 overflow-hidden">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">
                              👕
                            </div>
                          )}
                        </div>
                        <span className="font-bold text-stone-950 truncate max-w-xs">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-stone-600 font-medium">
                      {product.categories?.name || '—'}
                    </td>
                    <td className="px-6 py-4 font-bold text-stone-950">
                      Rs. {product.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {product.stock_quantity <= 0 ? (
                        <span className="text-red-700 font-bold">0 (Out of stock)</span>
                      ) : product.stock_quantity <= 3 ? (
                        <span className="text-[var(--color-warning)] font-bold">{product.stock_quantity} (Low)</span>
                      ) : (
                        <span className="text-stone-700 font-medium">{product.stock_quantity}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {product.is_active ? (
                        <span className="inline-block px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold text-[var(--color-success)] bg-[var(--color-success-bg)] border border-[var(--color-success-border)] rounded-md">
                          Active
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold text-stone-600 bg-stone-100 border border-stone-200 rounded-md">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] font-bold uppercase tracking-wider text-[11px]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="text-red-600 hover:text-red-800 font-bold uppercase tracking-wider text-[11px]"
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

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-stone-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="text-xl font-bold text-stone-950">
                {editingId ? 'Edit Garment' : 'New Garment'}
              </h2>
              <button
                onClick={resetForm}
                className="text-stone-400 hover:text-stone-900 p-1 text-lg"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider font-bold text-stone-700 mb-1.5">
                  Garment Title *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-[var(--color-primary)]"
                  placeholder="e.g. Linen Relaxed Kurta"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider font-bold text-stone-700 mb-1.5">
                    Department / Category *
                  </label>
                  <select
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-[var(--color-primary)]"
                  >
                    <option value="">Select Department</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-bold text-stone-700 mb-1.5">
                    Price in PKR (Rs.) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-[var(--color-primary)]"
                    placeholder="e.g. 4500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider font-bold text-stone-700 mb-1.5">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock_quantity"
                    value={form.stock_quantity}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-[var(--color-primary)]"
                    placeholder="e.g. 25"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-bold text-stone-700 mb-1.5">
                    Visibility Status
                  </label>
                  <select
                    name="is_active"
                    value={String(form.is_active)}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-[var(--color-primary)]"
                  >
                    <option value="true">Active (Publicly Visible)</option>
                    <option value="false">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider font-bold text-stone-700 mb-1.5">
                  Garment Photography URL
                </label>
                <input
                  type="text"
                  name="image_url"
                  value={form.image_url}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-bold text-stone-700 mb-1.5">
                  Garment Narrative / Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Details regarding cut, weave, and silhouette..."
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={resetForm}
                  className="border border-stone-300 text-stone-700 uppercase tracking-wider font-bold px-4 py-2.5 rounded-lg hover:bg-stone-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 text-white uppercase tracking-wider font-bold px-5 py-2.5 rounded-lg shadow-sm transition flex items-center gap-2"
                >
                  {saving ? 'Saving...' : editingId ? 'Update Garment' : 'Create Garment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
