import React from 'react';
import { useQuery } from '@tanstack/react-query';
import ProductCard from './ProductCard';
import { fetchProducts } from '../data/products';

const ProductList = () => {
  const { data: products = [], isLoading: loading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Skeleton Card Component matching new design
  const SkeletonCard = () => (
    <div className="bg-white shadow-md overflow-hidden flex flex-col items-center animate-pulse">
      <div className="aspect-square bg-slate-200 w-full"></div>
      <div className="p-4 flex flex-col items-center w-full flex-grow border-t border-gray-100">
        <div className="h-5 bg-slate-200 rounded w-2/3 mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
        <div className="h-5 bg-slate-200 rounded w-1/2 mb-5"></div>
        <div className="flex space-x-1 mb-5">
           {[...Array(5)].map((_, i) => (
             <div key={i} className="h-4 w-4 bg-slate-200 rounded-full"></div>
           ))}
        </div>
      </div>
      <div className="w-full h-12 mt-auto bg-slate-200"></div>
    </div>
  );

  return (
    <div className="bg-[#f8f9fa] w-full pb-20 pt-10">
      <section className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, index) => <SkeletonCard key={index} />)
            : products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
          }
        </div>
      </section>
    </div>
  );
};

export default ProductList;
