require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function seed() {
  const { error } = await supabase.from('promos').insert([
    { title: 'HALAL CERTIFICATE BY LPPOM MUI PUSAT', image: '/assets/halal_cert.png', type: 'news' },
    { title: 'Katalog Imlek 2026', image: '/assets/cny_promo.png', type: 'news' },
    { title: 'Katalog Lebaran 2026', image: '/assets/lebaran_promo.png', type: 'news' },
    { title: 'Grand Opening Promotion Holland Bakery Pondok Ungu', image: '/assets/promo_grand_opening.png', type: 'promo' },
  ]);

  if (error) {
    console.error('Seeding failed:', error);
  } else {
    console.log('Seeding successful!');
  }
}

seed();
