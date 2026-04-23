const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();

// CORS: izinkan frontend dari Vercel dan localhost
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.FRONTEND_URL, // URL Vercel kamu (set di Railway env vars)
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Izinkan request tanpa origin (misal: curl, Postman) atau dari allowedOrigins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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

// Railway otomatis mengisi process.env.PORT, fallback ke 5000 untuk dev lokal
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
