const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const multer = require('multer');
require('dotenv').config();

const app = express();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 } // 4MB limit (Vercel max 4.5MB)
});

// CORS: izinkan frontend dari Vercel dan localhost
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.FRONTEND_URL, // URL Vercel kamu (set di Railway env vars)
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true,
}));

app.use(express.json());

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ─── Helper: Log Activity ─────────────────────────────────────────────────────
const logActivity = async (action_type, entity, details) => {
  try {
    await supabase.from('audit_logs').insert([{ action_type, entity, details }]);
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
};

// Health check endpoint (untuk Railway)
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: "D'Bakery API is running!" });
});

// GET all products
app.get('/api/products', async (req, res) => {
  const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  
  // Transform data (parsing numbers)
  const products = data.map(p => ({
    ...p,
    price: Number(p.price),
    oldPrice: p.old_price ? Number(p.old_price) : null
  }));
  res.json(products);
});

// GET all promos/news
app.get('/api/promos', async (req, res) => {
  const { data, error } = await supabase.from('promos').select('*').order('id', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ─── Admin Auth Middleware ────────────────────────────────────────────────────
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'dbakery2024';

const adminAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: 'Unauthorized: password salah atau tidak ada.' });
  }
  next();
};

// POST /api/admin/login — verifikasi password
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, token: ADMIN_PASSWORD });
  } else {
    res.status(401).json({ success: false, error: 'Password salah.' });
  }
});

// POST /api/upload — upload gambar ke supabase storage
app.post('/api/upload', adminAuth, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'File tidak ditemukan.' });
  
  try {
    const file = req.file;
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { error } = await supabase.storage
      .from('images')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    res.json({ url: publicUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products — tambah produk baru
app.post('/api/products', adminAuth, async (req, res) => {
  const { name, price, old_price, image, category } = req.body;
  if (!name || !price || !image || !category) {
    return res.status(400).json({ error: 'Field name, price, image, category wajib diisi.' });
  }
  const { data, error } = await supabase
    .from('products')
    .insert([{ name, price: Number(price), old_price: old_price ? Number(old_price) : null, image, category }])
    .select();
  if (error) return res.status(500).json({ error: error.message });
  await logActivity('CREATE', 'PRODUCT', `Menambahkan produk baru: ${name}`);
  res.status(201).json(data[0]);
});

// PUT /api/products/:id — edit produk
app.put('/api/products/:id', adminAuth, async (req, res) => {
  const { id } = req.params;
  const { name, price, old_price, image, category } = req.body;
  const { data, error } = await supabase
    .from('products')
    .update({ name, price: Number(price), old_price: old_price ? Number(old_price) : null, image, category })
    .eq('id', id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0) return res.status(404).json({ error: 'Produk tidak ditemukan.' });
  await logActivity('UPDATE', 'PRODUCT', `Mengubah data produk ID #${id} (${name})`);
  res.json(data[0]);
});

// DELETE /api/products/:id — hapus produk
app.delete('/api/products/:id', adminAuth, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  await logActivity('DELETE', 'PRODUCT', `Menghapus produk ID #${id}`);
  res.json({ success: true, message: `Produk #${id} berhasil dihapus.` });
});

// POST /api/promos — tambah promo/news baru
app.post('/api/promos', adminAuth, async (req, res) => {
  const { title, type, image } = req.body;
  if (!title || !type || !image) {
    return res.status(400).json({ error: 'Field title, type, image wajib diisi.' });
  }
  const { data, error } = await supabase
    .from('promos')
    .insert([{ title, type, image }])
    .select();
  if (error) return res.status(500).json({ error: error.message });
  await logActivity('CREATE', 'PROMO', `Menambahkan promo/news baru: ${title}`);
  res.status(201).json(data[0]);
});

// PUT /api/promos/:id — edit promo/news
app.put('/api/promos/:id', adminAuth, async (req, res) => {
  const { id } = req.params;
  const { title, type, image } = req.body;
  const { data, error } = await supabase
    .from('promos')
    .update({ title, type, image })
    .eq('id', id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0) return res.status(404).json({ error: 'Promo/News tidak ditemukan.' });
  await logActivity('UPDATE', 'PROMO', `Mengubah promo/news ID #${id} (${title})`);
  res.json(data[0]);
});

// DELETE /api/promos/:id — hapus promo/news
app.delete('/api/promos/:id', adminAuth, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('promos').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  await logActivity('DELETE', 'PROMO', `Menghapus promo/news ID #${id}`);
  res.json({ success: true, message: `Promo/News #${id} berhasil dihapus.` });
});

// ─── Orders API ─────────────────────────────────────────────────────────────

// GET /api/orders — lihat semua pesanan (Admin Only)
app.get('/api/orders', adminAuth, async (req, res) => {
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /api/orders — buat pesanan baru
app.post('/api/orders', async (req, res) => {
  const { order_details, total_amount } = req.body;
  if (!order_details || !total_amount) {
    return res.status(400).json({ error: 'Field order_details dan total_amount wajib diisi.' });
  }
  const { data, error } = await supabase
    .from('orders')
    .insert([{ order_details, total_amount: Number(total_amount), status: 'pending' }])
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// PUT /api/orders/:id/status — ubah status pesanan (Admin Only)
app.put('/api/orders/:id/status', adminAuth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Field status wajib diisi.' });
  
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0) return res.status(404).json({ error: 'Pesanan tidak ditemukan.' });
  await logActivity('UPDATE', 'ORDER', `Mengubah status pesanan ID #${id} menjadi ${status}`);
  res.json(data[0]);
});

// ─── History API ────────────────────────────────────────────────────────────

// GET /api/history — lihat semua histori aktivitas (Admin Only)
app.get('/api/history', adminAuth, async (req, res) => {
  const { data, error } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Untuk development lokal
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}

// Ekspor app untuk Vercel Serverless Functions
module.exports = app;
