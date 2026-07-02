import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../data/products';
import ProductCard from '../components/ProductCard';

const MomentPage = () => {
  const [selectedMoment, setSelectedMoment] = useState(null);
  const recommendationsRef = useRef(null);

  const { data: products = [], isLoading: loading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
  });

  const moments = [
    {
      id: 'birthday',
      title: 'BIRTHDAY',
      image: '/assets/birthday_moment.png',
      categories: ['best_seller', 'roti_box']
    },
    {
      id: 'dessert',
      title: 'DESSERT',
      image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800',
      categories: ['roti_manis']
    },
    {
      id: 'snacks',
      title: 'SNACKS',
      image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&q=80&w=800',
      categories: ['roti_gurih', 'roti_manis']
    },
    {
      id: 'gathering',
      title: 'GATHERING',
      image: '/assets/gathering_moment.png',
      categories: ['roti_box', 'best_seller']
    },
    {
      id: 'coffee_break',
      title: 'COFFEE BREAK',
      image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800',
      categories: ['roti_manis', 'roti_gurih']
    },
    {
      id: 'breakfast',
      title: 'BREAKFAST',
      image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&q=80&w=800',
      categories: ['roti_gurih', 'all_product']
    }
  ];

  const processedProducts = React.useMemo(() => {
    if (!products) return [];
    if (!selectedMoment) return products.slice(0, 8); // show some default

    const momentConfig = moments.find(m => m.id === selectedMoment);
    if (!momentConfig) return products;

    return products.filter(p => momentConfig.categories.includes(p.category) || p.category === 'all_product');
  }, [products, selectedMoment]);

  const handleMomentClick = (id) => {
    setSelectedMoment(id);
    if (recommendationsRef.current) {
      recommendationsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Page Title & Breadcrumb */}
        <div className="mb-12">
          <h1 className="text-[26px] font-medium text-brand-primary tracking-wide mb-1 font-sans">
            Choose Your Moment
          </h1>
          <div className="text-[12px] text-gray-800 font-medium flex gap-2">
            <Link to="/" className="cursor-pointer hover:text-brand-primary">
              Home
            </Link>
            <span>/</span>
            <span>Choose Your Moment</span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {moments.map((moment, index) => (
            <div
              key={index}
              onClick={() => handleMomentClick(moment.id)}
              className={`aspect-square relative overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 ${selectedMoment === moment.id ? 'ring-4 ring-brand-primary ring-offset-2' : ''}`}
            >
              {/* Background Image */}
              <img 
                src={moment.image} 
                alt={moment.title} 
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${selectedMoment === moment.id ? 'scale-110' : 'group-hover:scale-110'}`} 
              />

              {/* Orange Color Overlay */}
              <div className={`absolute inset-0 transition-colors duration-500 ${selectedMoment === moment.id ? 'bg-[#985827]/40' : 'bg-[#985827]/60 mix-blend-multiply group-hover:bg-[#985827]/40'}`}></div>
              
              {/* Text */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <h2 className="text-white text-[24px] font-bold tracking-wide drop-shadow-md px-4 text-center">
                  {moment.title}
                </h2>
              </div>
            </div>
          ))}
        </div>

        {/* Product Recommendations */}
        <div ref={recommendationsRef} className="mt-20 mb-8 max-w-[1400px] mx-auto scroll-mt-24">
          <h2 className="text-[24px] font-medium text-brand-dark mb-6 text-center">
            {selectedMoment 
              ? `Recommended For ${moments.find(m => m.id === selectedMoment)?.title}`
              : 'Recommended For You'}
          </h2>
          {processedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <p className="text-4xl mb-4">🍽️</p>
              <p className="text-lg">Tidak ada rekomendasi untuk momen ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch">
              {loading
                ? Array.from({ length: 8 }).map((_, index) => <SkeletonCard key={index} />)
                : processedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MomentPage;
