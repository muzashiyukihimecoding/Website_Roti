require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const originalProducts = [
  {
    name: "Almond Pastry",
    price: 12000,
    old_price: 13200,
    image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&q=80&w=400",
    category: 'pastry'
  },
  {
    name: "American Cheese Roll (isi 3 Pcs)",
    price: 28700,
    old_price: 31500,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400",
    category: 'pastry'
  },
  {
    name: "Apple Pie",
    price: 16600,
    old_price: 18200,
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80&w=400",
    category: 'pastry'
  },
  {
    name: "Arem-arem (lontong)",
    price: 9500,
    old_price: null,
    image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&q=80&w=400",
    category: 'traditional'
  },
  {
    name: "Banana Cake",
    price: 45000,
    old_price: 48000,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400",
    category: 'cake'
  },
  {
    name: "Choco Muffin",
    price: 11000,
    old_price: 13000,
    image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80&w=400",
    category: 'muffin'
  },
  {
    name: "Sosis Brood",
    price: 15000,
    old_price: 16500,
    image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=400",
    category: 'savory'
  },
  {
    name: "Cheese Tart",
    price: 22000,
    old_price: 24500,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400",
    category: 'pastry'
  }
];

async function fixProducts() {
  // 1. Delete all existing wrong products
  const { error: delError } = await supabase.from('products').delete().neq('id', 0);
  if (delError) {
    console.error('Failed to clear old products:', delError);
    return;
  }

  // 2. Insert original accurate products
  const { error: insError } = await supabase.from('products').insert(originalProducts);
  
  if (insError) {
    console.error('Failed to insert accurate products:', insError);
  } else {
    console.log('Successfully fixed database products layout!');
  }
}

fixProducts();
