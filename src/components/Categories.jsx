import React, { useMemo } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../data/products';

const baseCategories = [
  { name: 'All Product', value: 'all_product', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600' },
  { name: 'Best Seller', value: 'best_seller', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=600' },
  { name: 'Roti Manis', value: 'roti_manis', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600' },
  { name: 'Roti Gurih', value: 'roti_gurih', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600' },
  { name: 'Roti Box', value: 'roti_box', image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&q=80&w=600' },
];

const Categories = () => {
  const navigate = useNavigate();

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
  });

  const displayCategories = useMemo(() => {
    return baseCategories.map(cat => {
      let image = cat.image;
      if (products && products.length > 0) {
        if (cat.value === 'all_product') {
           // Use the last product's image to ensure it's different from the first/best seller
           image = products[products.length - 1]?.image || cat.image;
        } else {
           const product = products.find(p => p.category === cat.value);
           if (product) {
             image = product.image;
           }
        }
      }
      return { ...cat, image };
    });
  }, [products]);

  return (
    <section className="py-12 bg-white flex flex-col items-center">
      {/* Red Cart Icon matching reference */}
      <div className="mb-4 text-brand-primary mt-4">
        <ShoppingCart size={64} strokeWidth={1.5} />
      </div>

      {/* Title */}
      <h2 className="text-[26px] font-normal text-brand-dark tracking-wide mb-10 font-sans">
        Shop By Categories
      </h2>

      {/* Grid */}
      <div className="max-w-[1100px] w-full mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {displayCategories.map((category, index) => (
            <div 
              key={index} 
              onClick={() => navigate(`/menu?category=${category.value}`)}
              className="group cursor-pointer border border-gray-200 bg-white flex flex-col hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-full aspect-square overflow-hidden bg-gray-50 flex items-center justify-center relative">
                 <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  loading="lazy"
                />
              </div>
              <div className="border-t border-gray-200 py-3 text-center bg-white">
                <h3 className="text-[14px] text-gray-800 font-medium tracking-tight">
                  {category.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
