import React from 'react';
import { MessageCircle, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../data/products';

const InstagramIcon = ({ size, color, strokeWidth = 2, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>
);

const FacebookIcon = ({ size, color, fill = "none", strokeWidth = 2, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const SocialPage = () => {
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
  });

  const getImg = (index, fallback) => {
    if (products.length > 0) {
      return products[index % products.length].image;
    }
    return fallback;
  };

  const gridProducts = products.slice(0, 6);
  // Fallback if products are less than 6 or not loaded yet
  const displayImages = gridProducts.length === 6 
    ? gridProducts.map(p => p.image) 
    : [
        "https://images.unsplash.com/photo-1549903072-7e6e0d234247?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1509365465974-eb15c6deff6f?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=600"
      ];

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Page Title & Breadcrumb */}
        <div className="mb-12">
          <h1 className="text-[26px] font-normal text-brand-primary tracking-wide mb-1 font-sans">Social</h1>
          <div className="text-[12px] text-gray-500 font-medium flex gap-2">
             <Link to="/" className="text-gray-800 cursor-pointer hover:text-brand-primary">Home</Link> 
             <span>/</span> 
             <span>Social</span>
          </div>
        </div>

        {/* Find Us On Section */}
        <div className="mb-12">
          <h2 className="text-center text-[28px] font-medium text-brand-dark mb-10">Find Us On</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Facebook */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#F35520] rounded-xl flex items-center justify-center mb-4 shadow-sm hover:scale-105 transition-transform cursor-pointer">
                <FacebookIcon size={36} color="white" fill="white" strokeWidth={1} />
              </div>
              <p className="text-[14px] font-bold text-brand-dark mb-2">Facebook D'BAKERY INDONESIA(OFFICIAL)</p>
              <p className="text-[13px] text-gray-500 mb-1">Join our Facebook Page :</p>
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-[13px] text-brand-primary hover:underline">
                https://www.facebook.com/dbakery/
              </a>
            </div>

            {/* Instagram */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#F35520] rounded-xl flex items-center justify-center mb-4 shadow-sm hover:scale-105 transition-transform cursor-pointer">
                <InstagramIcon size={36} color="white" strokeWidth={2} />
              </div>
              <p className="text-[14px] font-bold text-brand-dark mb-2">Instagram @dbakeryindonesia</p>
              <p className="text-[13px] text-gray-500 mb-1">Follow us on Instagram:</p>
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="text-[13px] text-brand-primary hover:underline">
                https://instagram.com/dbakeryindonesia/
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Instagram Gallery Grid */}
      <div className="max-w-[1400px] mx-auto w-full mb-24 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
          {/* Main Promotional Banner */}
          <div className="col-span-1 row-span-2 relative group overflow-hidden bg-brand-light flex items-center justify-center min-h-[400px] md:min-h-full">
            <img 
              src={getImg(6, "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800")}
              alt="Background texture" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply"
            />
            <div className="relative z-10 flex flex-col items-center text-center p-6 bg-white/70 backdrop-blur-sm m-4 rounded shadow-sm">
              <div className="w-12 h-12 bg-[#F35520] rounded-lg flex items-center justify-center mb-3 shadow-md">
                 <InstagramIcon size={24} color="white" strokeWidth={2} />
              </div>
              <p className="text-[15px] font-bold text-brand-dark leading-tight">Our Instagram</p>
              <p className="text-[14px] font-bold text-brand-dark mb-3">@dbakeryindonesia</p>
              <p className="text-[11px] text-gray-800 leading-relaxed font-medium">
                One of the first pioneer in modern bakery business in Indonesia. Established in 1978 with more than 470 outlets & 25 branches.
              </p>
            </div>
          </div>

          {/* 6 Square Grid Items */}
          {displayImages.map((imgSrc, index) => (
            <div key={index} className="aspect-square relative overflow-hidden group">
              <img src={imgSrc} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={`Post ${index + 1}`}/>
            </div>
          ))}
        </div>
      </div>

      {/* What They Said Section */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-10">
          <MessageCircle size={48} className="text-[#F35520] mb-2 fill-[#F35520]" strokeWidth={1} />
          <h2 className="text-[28px] font-medium text-brand-dark mb-1">What They Said</h2>
          <p className="text-[13px] text-gray-500 font-medium">Tag us and use <span className="text-brand-primary font-bold">#DBakeryMoment</span></p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* Card 1 */}
          <div className="aspect-square relative overflow-hidden bg-gray-100 flex items-center justify-center p-6 group">
            <img src={getImg(7, "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800")} className="absolute inset-0 w-full h-full object-cover brightness-[0.7] group-hover:scale-105 transition-transform duration-700" alt="Testimonial 1"/>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white overflow-hidden mb-4 shadow-lg shrink-0 flex items-center justify-center">
                <User size={48} className="text-gray-400" />
              </div>
              <p className="text-white font-bold text-[14px] mb-2 drop-shadow-md">@heriandre1212__inst</p>
              <p className="text-white text-[12px] leading-relaxed drop-shadow-md font-medium">
                Moment Keseruan HUT @dbakeryindonesia ... terima kasih semua... sukses & jaya selalu... Tim luar kota... #dbakerymoment #dbakery #teratasbaronakualitas
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="aspect-square relative overflow-hidden bg-gray-100 flex items-center justify-center p-6 group">
            <img src={getImg(8, "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800")} className="absolute inset-0 w-full h-full object-cover brightness-[0.6] sepia-[0.3] group-hover:scale-105 transition-transform duration-700" alt="Testimonial 2"/>
            <div className="absolute inset-0 border-[16px] border-white/20"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white overflow-hidden mb-4 shadow-lg shrink-0 flex items-center justify-center">
                 <User size={48} className="text-gray-400" />
              </div>
              <p className="text-white font-bold text-[14px] mb-2 drop-shadow-md">@singiti</p>
              <p className="text-white text-[12px] leading-relaxed drop-shadow-md font-medium">
                The best part about D'Bakery... Lucky and Tia... adorable munchkins... #dogsofinstagram #dbakerymoment
              </p>
            </div>
            <p className="absolute bottom-4 right-6 text-white/50 font-serif italic text-2xl drop-shadow-sm">Djakarta 1978</p>
          </div>

          {/* Card 3 */}
          <div className="aspect-square relative overflow-hidden bg-gray-100 flex items-center justify-center p-6 group">
            <img src={getImg(9, "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800")} className="absolute inset-0 w-full h-full object-cover brightness-[0.65] group-hover:scale-105 transition-transform duration-700" alt="Testimonial 3"/>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white overflow-hidden mb-4 shadow-lg shrink-0 flex items-center justify-center">
                 <User size={48} className="text-gray-400" />
              </div>
              <p className="text-white font-bold text-[14px] mb-2 drop-shadow-md">@mylla.asmara</p>
              <p className="text-white text-[12px] leading-relaxed drop-shadow-md font-medium">
                Ulang Tahun Kayla di rumah mbah uti di Kendal - Jawa Tengah. Tetep yah cari kue ulang tahunnya di @dbakeryindonesia. #DBakeryNostalgia #DBakeryMoment
              </p>
            </div>
          </div>

        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center space-x-2">
           <div className="w-2 h-2 rounded-full bg-gray-300"></div>
           <div className="w-2 h-2 rounded-full bg-gray-300"></div>
           <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>

      </div>
    </div>
  );
};

export default SocialPage;
