import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../data/products';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { label: 'All Product', value: 'all_product' },
  { label: 'Best Seller', value: 'best_seller' },
  { label: 'Roti Manis', value: 'roti_manis' },
  { label: 'Roti Gurih', value: 'roti_gurih' },
  { label: 'Roti Box', value: 'roti_box' },
];

const SORT_OPTIONS = [
  { label: 'Available Product', value: 'available' },
  { label: 'A-Z', value: 'a-z' },
  { label: 'Z-A', value: 'z-a' },
  { label: 'Recomended', value: 'recommended' },
];

const MenuPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all_product';
  
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState('available');

  const { data: products = [], isLoading: loading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Sync state if URL changes directly
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  const handleCategoryChange = (val) => {
    setSelectedCategory(val);
    setSearchParams({ category: val });
  };

  const processedProducts = useMemo(() => {
    if (!products) return [];
    
    // Filter
    let result = products;
    if (selectedCategory !== 'all_product') {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    // Sort
    result = [...result]; // create a copy for sorting
    if (sortBy === 'a-z') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'z-a') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }
    
    return result;
  }, [products, selectedCategory, sortBy]);

  const SkeletonCard = () => (
    <div className="bg-white border border-gray-100 flex flex-col items-center animate-pulse">
      <div className="aspect-square bg-slate-100 w-full mb-3"></div>
      <div className="h-4 bg-slate-200 rounded w-2/3 mb-2"></div>
      <div className="h-3 bg-slate-200 rounded w-1/3 mb-1"></div>
      <div className="h-3 bg-slate-200 rounded w-5/12 mb-3"></div>
      <div className="h-8 bg-slate-200 w-full mt-auto"></div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">

        {/* Page Title & Breadcrumb */}
        <div className="mb-8">
          <h1 className="text-[26px] font-normal text-brand-primary tracking-wide mb-1 font-sans">What We Serve</h1>
          <div className="text-[12px] text-gray-500 font-medium flex gap-2">
            <span className="text-gray-800 cursor-pointer">Home</span>
            <span>/</span>
            <span>Menu</span>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-6 mb-20">

          {/* Sidebar */}
          <aside className="w-full lg:w-[260px] flex-shrink-0 space-y-5">
            {/* Sorted By */}
            <div className="border border-gray-200 p-5 bg-[#fafafa]">
              <h3 className="text-[14px] font-bold text-brand-dark mb-3">Sorted By</h3>
              <ul className="space-y-[6px] text-[13px]">
                {SORT_OPTIONS.map(opt => (
                  <li 
                    key={opt.value}
                    onClick={() => setSortBy(opt.value)}
                    className={`cursor-pointer transition-[color] ${sortBy === opt.value ? 'text-brand-primary font-medium' : 'text-gray-800 hover:text-brand-primary'}`}
                  >
                    {opt.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Category */}
            <div className="border border-gray-200 p-5 bg-[#fafafa]">
              <h3 className="text-[14px] font-bold text-brand-dark mb-3">Category</h3>
              <ul className="space-y-3 text-[13px]">
                {CATEGORIES.map(cat => (
                  <li 
                    key={cat.value}
                    onClick={() => handleCategoryChange(cat.value)}
                    className={`cursor-pointer font-medium transition-[color] ${selectedCategory === cat.value ? 'text-brand-primary' : 'text-gray-800 hover:text-brand-primary'}`}
                  >
                    {cat.label}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch">
                {Array.from({ length: 8 }).map((_, index) => <SkeletonCard key={index} />)}
              </div>
            ) : processedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <p className="text-4xl mb-4">🍽️</p>
                <p className="text-lg">Tidak ada produk di kategori ini.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch">
                {processedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default MenuPage;
