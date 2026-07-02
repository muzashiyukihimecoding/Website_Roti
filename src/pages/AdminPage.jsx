import React, { useState, useEffect, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');

const CATEGORIES = [
  { label: 'All Product', value: 'all_product' },
  { label: 'Best Seller', value: 'best_seller' },
  { label: 'Roti Manis', value: 'roti_manis' },
  { label: 'Roti Gurih', value: 'roti_gurih' },
  { label: 'Roti Box', value: 'roti_box' },
];

const EMPTY_FORM = { name: '', price: '', old_price: '', image: '', category: 'roti_manis' };
const EMPTY_PROMO_FORM = { title: '', type: 'news', image: '' };

// ─── Format Rupiah ────────────────────────────────────────────────────────────
const formatRp = (val) =>
  val ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val).replace(/\s/g, '') : '-';

// ─── Login Screen ─────────────────────────────────────────────────────────────
const LoginScreen = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        onLogin(data.token);
      } else {
        setError(data.error || 'Password salah.');
      }
    } catch {
      setError('Tidak bisa terhubung ke server. Pastikan backend berjalan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5C2D0A] to-[#985827] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-brand-dark">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-1">D'Bakery — Kelola Website</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password Admin</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-primary hover:bg-brand-dark text-white font-semibold py-3 rounded-lg transition-colors duration-300 disabled:opacity-60"
          >
            {loading ? 'Memverifikasi...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ─── Product Form Modal ───────────────────────────────────────────────────────
const ProductModal = ({ token, product, onClose, onSaved }) => {
  const isEdit = !!product;
  const [form, setForm] = useState(isEdit
    ? { name: product.name, price: product.price, old_price: product.old_price || '', image: product.image, category: product.category }
    : EMPTY_FORM
  );
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let imageUrl = form.image;
      
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        
        const uploadRes = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || 'Gagal mengupload gambar.');
        imageUrl = uploadData.url;
      } else if (!imageUrl) {
        throw new Error('Pilih gambar produk terlebih dahulu.');
      }

      const payload = { ...form, image: imageUrl };

      const url = isEdit ? `${API_URL}/api/products/${product.id}` : `${API_URL}/api/products`;
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Terjadi kesalahan.');
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-brand-dark">
            {isEdit ? '✏️ Edit Produk' : '➕ Tambah Produk Baru'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk *</label>
            <input name="name" value={form.name} onChange={handleChange}
              placeholder="Contoh: Roti Sobek Keju"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
            <select name="category" value={form.category} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
              required>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp) *</label>
              <input name="price" type="number" value={form.price} onChange={handleChange}
                placeholder="Contoh: 25000"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harga Coret (Rp)</label>
              <input name="old_price" type="number" value={form.old_price} onChange={handleChange}
                placeholder="Opsional"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Foto Baru dari Komputer</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white mb-2"
            />
            
            <div className="flex items-center gap-2 my-2">
               <hr className="flex-1 border-gray-200" />
               <span className="text-xs text-gray-400 font-medium uppercase">ATAU</span>
               <hr className="flex-1 border-gray-200" />
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-1">Paste URL Foto (Supabase / Internet)</label>
            <input name="image" value={form.image} onChange={handleChange}
              placeholder="Kosongkan jika Anda sudah memilih file upload di atas"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />

            {(file || form.image) && (
              <img src={file ? URL.createObjectURL(file) : form.image} alt="preview"
                className="mt-3 h-28 w-full object-cover rounded-lg border border-gray-200"
                onError={(e) => { e.target.style.display = 'none'; }} />
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
              ⚠️ {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Batal
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 bg-brand-primary hover:bg-brand-dark text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-60">
              {loading ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Produk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Promo Form Modal ─────────────────────────────────────────────────────────
const PromoModal = ({ token, promo, onClose, onSaved }) => {
  const isEdit = !!promo;
  const [form, setForm] = useState(isEdit
    ? { title: promo.title, type: promo.type, image: promo.image }
    : EMPTY_PROMO_FORM
  );
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let imageUrl = form.image;
      
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        
        const uploadRes = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || 'Gagal mengupload gambar.');
        imageUrl = uploadData.url;
      } else if (!imageUrl) {
        throw new Error('Pilih gambar promo terlebih dahulu.');
      }

      const payload = { ...form, image: imageUrl };

      const url = isEdit ? `${API_URL}/api/promos/${promo.id}` : `${API_URL}/api/promos`;
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Terjadi kesalahan.');
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-brand-dark">
            {isEdit ? '✏️ Edit News/Promo' : '➕ Tambah News/Promo'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul *</label>
            <input name="title" value={form.title} onChange={handleChange}
              placeholder="Contoh: Promo Akhir Tahun"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipe *</label>
            <select name="type" value={form.type} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
              required>
              <option value="news">News</option>
              <option value="promo">Promo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Foto Baru dari Komputer</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white mb-2"
            />
            
            <div className="flex items-center gap-2 my-2">
               <hr className="flex-1 border-gray-200" />
               <span className="text-xs text-gray-400 font-medium uppercase">ATAU</span>
               <hr className="flex-1 border-gray-200" />
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-1">Paste URL Foto (Supabase / Internet)</label>
            <input name="image" value={form.image} onChange={handleChange}
              placeholder="Kosongkan jika Anda sudah memilih file upload di atas"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />

            {(file || form.image) && (
              <img src={file ? URL.createObjectURL(file) : form.image} alt="preview"
                className="mt-3 h-28 w-full object-cover rounded-lg border border-gray-200"
                onError={(e) => { e.target.style.display = 'none'; }} />
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
              ⚠️ {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Batal
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 bg-brand-primary hover:bg-brand-dark text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-60">
              {loading ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Admin Page ──────────────────────────────────────────────────────────
const AdminPage = () => {
  const [token, setToken] = useState(() => sessionStorage.getItem('admin_token') || '');
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'promos'
  const [products, setProducts] = useState([]);
  const [promos, setPromos] = useState([]);
  const [orders, setOrders] = useState([]);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null); // null | {type: 'product', mode: 'add'|object} | {type: 'promo', mode: 'add'|object}
  const [deleteData, setDeleteData] = useState(null); // { id: 1, type: 'product'|'promo' }
  const [toast, setToast] = useState('');
  const [search, setSearch] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [prodRes, promoRes, ordersRes, histRes] = await Promise.all([
        fetch(`${API_URL}/api/products`),
        fetch(`${API_URL}/api/promos`),
        fetch(`${API_URL}/api/orders`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/api/history`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      const prodData = await prodRes.json();
      const promoData = await promoRes.json();
      const ordersData = await ordersRes.json();
      const histData = await histRes.json();
      setProducts(Array.isArray(prodData) ? prodData : []);
      setPromos(Array.isArray(promoData) ? promoData : []);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setHistoryLogs(Array.isArray(histData) ? histData : []);
    } catch {
      showToast('❌ Gagal memuat data.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) loadData();
  }, [token, loadData]);

  const handleLogin = (t) => {
    sessionStorage.setItem('admin_token', t);
    setToken(t);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    setToken('');
    setProducts([]);
    setPromos([]);
    setOrders([]);
    setHistoryLogs([]);
  };

  const handleDelete = async () => {
    try {
      const url = deleteData.type === 'product' 
        ? `${API_URL}/api/products/${deleteData.id}` 
        : `${API_URL}/api/promos/${deleteData.id}`;
      const res = await fetch(url, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast('🗑️ Data berhasil dihapus.');
      loadData();
    } catch (err) {
      showToast(`❌ ${err.message}`);
    } finally {
      setDeleteData(null);
    }
  };

  const handleUpdateOrderStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Gagal mengupdate status pesanan.');
      showToast('✅ Status pesanan diperbarui.');
      loadData();
    } catch (err) {
      showToast(`❌ ${err.message}`);
    }
  };

  const handleSaved = () => {
    setModal(null);
    showToast('✅ Data berhasil disimpan!');
    loadData();
  };

  const filteredHistory = (historyLogs || []).filter(h =>
    h.details?.toLowerCase().includes(search.toLowerCase()) ||
    h.action_type?.toLowerCase().includes(search.toLowerCase()) ||
    h.entity?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredOrders = (orders || []).filter(o =>
    o.order_details?.toLowerCase().includes(search.toLowerCase()) ||
    o.status?.toLowerCase().includes(search.toLowerCase())
  );

  if (!token) return <LoginScreen onLogin={handleLogin} />;

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPromos = promos.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.type?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-brand-dark text-white px-6 py-4 flex items-center justify-between shadow-lg sticky top-0 z-40">
        <div>
          <h1 className="text-lg font-bold">🛠️ D'Bakery Admin Panel</h1>
          <p className="text-xs text-white/60 mt-0.5">Kelola data website</p>
        </div>
        <button onClick={handleLogout}
          className="text-xs text-white/70 hover:text-white border border-white/30 hover:border-white px-3 py-1.5 rounded-lg transition-colors">
          Keluar
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'products' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
          >
            Manajemen Produk
          </button>
          <button 
            onClick={() => setActiveTab('promos')}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'promos' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
          >
            News & Promo
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'orders' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
          >
            Pesanan
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'history' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
          >
            Histori
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder={activeTab === 'products' ? "🔍 Cari produk atau kategori..." : activeTab === 'promos' ? "🔍 Cari judul atau tipe promo..." : activeTab === 'orders' ? "🔍 Cari pesanan..." : "🔍 Cari histori aktivitas..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white shadow-sm"
          />
          {activeTab !== 'orders' && activeTab !== 'history' && (
            <button
              onClick={() => setModal({ type: activeTab === 'products' ? 'product' : 'promo', mode: 'add' })}
              className="bg-brand-primary hover:bg-brand-dark text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm"
            >
              <span className="text-lg leading-none">+</span> 
              Tambah {activeTab === 'products' ? 'Produk' : 'News/Promo'}
            </button>
          )}
        </div>

        {/* Stats */}
        {activeTab === 'products' ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Produk', value: products.length, color: 'text-brand-primary' },
              { label: 'Hasil Pencarian', value: filteredProducts.length, color: 'text-blue-600' },
              { label: 'Ada Diskon', value: products.filter(p => p.old_price).length, color: 'text-green-600' },
              { label: 'Kategori', value: [...new Set(products.map(p => p.category))].length, color: 'text-purple-600' },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        ) : activeTab === 'promos' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total News/Promo', value: promos.length, color: 'text-brand-primary' },
              { label: 'Total News', value: promos.filter(p => p.type === 'news').length, color: 'text-blue-600' },
              { label: 'Total Promo', value: promos.filter(p => p.type === 'promo').length, color: 'text-green-600' },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        ) : activeTab === 'orders' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Pesanan', value: (orders || []).length, color: 'text-brand-primary' },
              { label: 'Pesanan Pending', value: (orders || []).filter(o => o.status === 'pending').length, color: 'text-orange-600' },
              { label: 'Pesanan Lunas', value: (orders || []).filter(o => o.status === 'lunas').length, color: 'text-green-600' },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Log', value: (historyLogs || []).length, color: 'text-brand-primary' },
              { label: 'Aktivitas Hari Ini', value: (historyLogs || []).filter(h => new Date(h.created_at).toDateString() === new Date().toDateString()).length, color: 'text-blue-600' },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Content Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mr-3"></div>
              Memuat data...
            </div>
          ) : (
            <>
              {/* Products Table */}
              {activeTab === 'products' && (
                filteredProducts.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">
                    <p className="text-4xl mb-3">📭</p>
                    <p className="text-sm">Tidak ada produk ditemukan.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          <th className="px-5 py-4">Produk</th>
                          <th className="px-4 py-4">Kategori</th>
                          <th className="px-4 py-4">Harga</th>
                          <th className="px-4 py-4">Harga Coret</th>
                          <th className="px-4 py-4 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredProducts.map(product => (
                          <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <img src={product.image} alt={product.name}
                                  className="w-12 h-12 object-cover rounded-lg border border-gray-100 flex-shrink-0"
                                  onError={(e) => { e.target.src = 'https://via.placeholder.com/48x48?text=?'; }} />
                                <span className="font-medium text-gray-800 leading-snug max-w-[200px]">{product.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className="bg-brand-light text-brand-primary text-xs font-semibold px-2.5 py-1 rounded-full capitalize">
                                {product.category}
                              </span>
                            </td>
                            <td className="px-4 py-4 font-semibold text-brand-primary">{formatRp(product.price)}</td>
                            <td className="px-4 py-4 text-gray-400 line-through text-xs">{formatRp(product.old_price)}</td>
                            <td className="px-4 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => setModal({ type: 'product', mode: product })}
                                  className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => setDeleteData({ id: product.id, type: 'product' })}
                                  className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                                >
                                  Hapus
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}

              {/* Promos Table */}
              {activeTab === 'promos' && (
                filteredPromos.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">
                    <p className="text-4xl mb-3">📭</p>
                    <p className="text-sm">Tidak ada promo/news ditemukan.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          <th className="px-5 py-4">Judul</th>
                          <th className="px-4 py-4">Tipe</th>
                          <th className="px-4 py-4">Gambar</th>
                          <th className="px-4 py-4 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredPromos.map(promo => (
                          <tr key={promo.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-5 py-4">
                              <span className="font-medium text-gray-800 leading-snug">{promo.title}</span>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${promo.type === 'news' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                                {promo.type}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <img src={promo.image} alt={promo.title}
                                className="w-16 h-10 object-cover rounded border border-gray-100"
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/64x40?text=?'; }} />
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => setModal({ type: 'promo', mode: promo })}
                                  className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => setDeleteData({ id: promo.id, type: 'promo' })}
                                  className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                                >
                                  Hapus
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}

              {/* Orders Table */}
              {activeTab === 'orders' && (
                filteredOrders.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">
                    <p className="text-4xl mb-3">📭</p>
                    <p className="text-sm">Tidak ada pesanan ditemukan.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          <th className="px-5 py-4">ID / Tanggal</th>
                          <th className="px-4 py-4">Detail Pesanan</th>
                          <th className="px-4 py-4">Total</th>
                          <th className="px-4 py-4">Status</th>
                          <th className="px-4 py-4 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredOrders.map(order => (
                          <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-5 py-4 align-top">
                              <span className="font-bold text-gray-800">#{order.id}</span>
                              <div className="text-xs text-gray-400 mt-1">
                                {new Date(order.created_at).toLocaleDateString('id-ID')}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <pre className="text-xs text-gray-600 whitespace-pre-wrap font-sans leading-relaxed">
                                {order.order_details}
                              </pre>
                            </td>
                            <td className="px-4 py-4 align-top font-semibold text-brand-primary">
                              {formatRp(order.total_amount)}
                            </td>
                            <td className="px-4 py-4 align-top">
                              {order.status === 'pending' ? (
                                <span className="bg-orange-50 text-orange-600 text-xs font-semibold px-2.5 py-1 rounded-full uppercase">Pending</span>
                              ) : (
                                <span className="bg-green-50 text-green-600 text-xs font-semibold px-2.5 py-1 rounded-full uppercase">Lunas</span>
                              )}
                            </td>
                            <td className="px-4 py-4 align-top text-center">
                              {order.status === 'pending' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'lunas')}
                                  className="px-3 py-1.5 text-xs font-medium bg-green-500 text-white hover:bg-green-600 rounded-lg transition-colors whitespace-nowrap shadow-sm"
                                >
                                  Tandai Lunas
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}

              {/* History Table */}
              {activeTab === 'history' && (
                filteredHistory.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">
                    <p className="text-4xl mb-3">📭</p>
                    <p className="text-sm">Tidak ada histori ditemukan.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          <th className="px-5 py-4">Waktu</th>
                          <th className="px-4 py-4">Aksi</th>
                          <th className="px-4 py-4">Modul</th>
                          <th className="px-4 py-4">Rincian</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredHistory.map(log => (
                          <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-5 py-4 align-top">
                              <span className="font-medium text-gray-800">
                                {new Date(log.created_at).toLocaleString('id-ID')}
                              </span>
                            </td>
                            <td className="px-4 py-4 align-top">
                              <span className={`text-[11px] font-bold px-2 py-1 rounded uppercase tracking-wide
                                ${log.action_type === 'CREATE' ? 'bg-green-100 text-green-700' : 
                                  log.action_type === 'UPDATE' ? 'bg-blue-100 text-blue-700' : 
                                  'bg-red-100 text-red-700'}`
                              }>
                                {log.action_type}
                              </span>
                            </td>
                            <td className="px-4 py-4 align-top font-semibold text-gray-700">
                              {log.entity}
                            </td>
                            <td className="px-4 py-4 align-top text-gray-600">
                              {log.details}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>

      {/* Add/Edit Modals */}
      {modal && modal.type === 'product' && (
        <ProductModal
          token={token}
          product={modal.mode === 'add' ? null : modal.mode}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}
      
      {modal && modal.type === 'promo' && (
        <PromoModal
          token={token}
          promo={modal.mode === 'add' ? null : modal.mode}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}

      {/* Delete Confirm */}
      {deleteData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="text-5xl mb-4">🗑️</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Hapus Data?</h3>
            <p className="text-sm text-gray-500 mb-6">Tindakan ini tidak bisa dibatalkan. Data akan dihapus permanen dari database.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteData(null)}
                className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Batal
              </button>
              <button onClick={handleDelete}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-6 py-3 rounded-full shadow-2xl z-50 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
