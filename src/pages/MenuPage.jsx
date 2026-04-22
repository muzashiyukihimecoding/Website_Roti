import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../data/products';
import ProductCard from '../components/ProductCard';

const MenuPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

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
                <li className="text-gray-800 cursor-pointer hover:text-brand-primary transition-[color]">Available Product</li>
                <li className="text-brand-primary font-medium cursor-pointer">A-Z</li>
                <li className="text-gray-800 cursor-pointer hover:text-brand-primary transition-[color]">Z-A</li>
                <li className="text-gray-800 cursor-pointer hover:text-brand-primary transition-[color]">Recomended</li>
              </ul>
            </div>



            {/* Category */}
            <div className="border border-gray-200 p-5 bg-[#fafafa]">
              <h3 className="text-[14px] font-bold text-brand-dark mb-3">Category</h3>
              <ul className="space-y-3 text-[13px]">
                <li className="text-gray-800 cursor-pointer font-medium hover:text-brand-primary transition-[color]">All Product</li>
                <li className="text-gray-800 cursor-pointer font-medium hover:text-brand-primary transition-[color]">Favourite</li>
                <li className="text-gray-800 cursor-pointer font-medium hover:text-brand-primary transition-[color]">Breads</li>
                <li className="text-gray-800 cursor-pointer font-medium hover:text-brand-primary transition-[color]">Traditional Snacks</li>
                <li className="text-gray-800 cursor-pointer font-medium hover:text-brand-primary transition-[color]">Chiffon & Roll Cakes</li>
                <li className="text-gray-800 cursor-pointer font-medium hover:text-brand-primary transition-[color]">Donuts</li>
                <li className="text-gray-800 cursor-pointer font-medium hover:text-brand-primary transition-[color]">Pastry And Danish</li>
                <li className="text-gray-800 cursor-pointer font-medium hover:text-brand-primary transition-[color]">Pudding</li>
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch">
              {loading
                ? Array.from({ length: 8 }).map((_, index) => <SkeletonCard key={index} />)
                : products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))
              }
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
