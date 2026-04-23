import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const NewsPromoPage = () => {
  const [activeTab, setActiveTab] = useState('news');
  const [news, setNews] = useState([]);
  const [promos, setPromos] = useState([]);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(`${API_URL}/api/promos`)
      .then(res => res.json())
      .then(data => {
        setNews(data.filter(item => item.type === 'news'));
        setPromos(data.filter(item => item.type === 'promo'));
      })
      .catch(err => console.error("Error fetching promos:", err));
  }, []);

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Page Title & Breadcrumb */}
        <div className="mb-8">
          <h1 className="text-[26px] font-medium text-brand-primary tracking-wide mb-1 font-sans">News & Promo</h1>
          <div className="text-[12px] text-gray-800 font-medium flex gap-2">
             <Link to="/" className="cursor-pointer hover:text-brand-primary">Home</Link> 
             <span>/</span> 
             <span>News & Promo</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-col md:flex-row gap-4 mb-16 w-full max-w-4xl mx-auto">
          <div 
            onClick={() => setActiveTab('news')}
            className={`flex-1 text-center py-3 font-bold text-[15px] cursor-pointer rounded-sm transition-colors ${
              activeTab === 'news' 
                ? 'bg-brand-light text-brand-primary shadow-sm ring-1 ring-brand-primary/20' 
                : 'bg-[#FFF5EB] text-brand-secondary hover:bg-brand-light'
            }`}
          >
            News
          </div>
          <div 
            onClick={() => setActiveTab('promo')}
            className={`flex-1 text-center py-3 font-bold text-[15px] cursor-pointer rounded-sm transition-colors ${
               activeTab === 'promo' 
                ? 'bg-brand-light text-brand-primary shadow-sm ring-1 ring-brand-primary/20' 
                : 'bg-[#FFF5EB] text-brand-secondary hover:bg-brand-light'
            }`}
          >
            Promo
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-[1400px] mx-auto">
          
              {activeTab === 'news' && news.map(item => (
                <div key={item.id} className="flex flex-col flex-1 transform transition duration-300 hover:-translate-y-1">
                  <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100 relative border border-gray-100">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="pt-6 flex flex-col items-center flex-grow text-center px-2">
                    <h3 className="text-[14px] font-bold text-gray-800 mb-4 hover:text-brand-primary transition-colors cursor-pointer uppercase">{item.title}</h3>
                    <p className="text-[12px] text-gray-600 mb-8 leading-relaxed max-w-[280px]">
                      {item.title}
                    </p>
                    <div className="mt-auto pb-2">
                      <button className="bg-[#985827] hover:bg-[#50301B] text-white text-[13px] font-bold px-8 py-2.5 rounded shadow-sm hover:shadow-md transition-all">
                        Read More
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {activeTab === 'promo' && promos.map(item => (
                <div key={item.id} className="flex flex-col flex-1 transform transition duration-300 hover:-translate-y-1">
                  <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100 relative border border-gray-100">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="pt-6 flex flex-col items-center flex-grow text-center px-2">
                    <h3 className="text-[14px] font-bold text-gray-800 mb-4 hover:text-brand-primary transition-colors cursor-pointer uppercase">{item.title}</h3>
                    <p className="text-[12px] text-gray-600 mb-8 leading-relaxed max-w-[280px]">
                      {item.title}
                    </p>
                    <div className="mt-auto pb-2">
                      <button className="bg-[#985827] hover:bg-[#50301B] text-white text-[13px] font-bold px-8 py-2.5 rounded shadow-sm hover:shadow-md transition-all">
                        Read More
                      </button>
                    </div>
                  </div>
                </div>
              ))}

        </div>
      </div>
    </div>
  );
};

export default NewsPromoPage;

