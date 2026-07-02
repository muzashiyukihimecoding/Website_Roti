import React, { useState, useEffect } from 'react';

const fallbackImages = [
  "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1920",
  "https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&q=80&w=1920",
  "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&q=80&w=1920"
];

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState(fallbackImages);

  // Fetch promos
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');
    fetch(`${API_URL}/api/promos`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const promoImages = data
            .filter(item => item.type === 'promo')
            .map(item => item.image);
            
          if (promoImages.length > 0) {
            setImages(promoImages);
          }
        }
      })
      .catch(err => console.error("Error fetching promos:", err));
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (images.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative w-full h-[250px] md:h-[400px] lg:h-[500px] xl:h-[600px] overflow-hidden bg-gray-100 group">
      <div 
        className="flex w-full h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, index) => (
          <div key={index} className="w-full h-full flex-shrink-0">
            <img 
              src={img} 
              alt={`Holland Bakery Promo ${index + 1}`}
              className="w-full h-full object-cover object-center"
            />
          </div>
        ))}
      </div>
      
      {/* Decorative slider indicators matching Holland Bakery styling */}
      <div className="absolute bottom-4 md:bottom-8 left-0 right-0 flex justify-center space-x-2 pb-2">
        {images.map((_, index) => (
          <button 
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-[10px] h-[10px] md:w-3 md:h-3 rounded-full border border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-black/20 ${
              currentIndex === index 
                ? 'bg-brand-primary border-white shadow-[0_0_5px_rgba(0,0,0,0.5)]' 
                : 'bg-white/80 hover:bg-white shadow-[0_0_3px_rgba(0,0,0,0.3)]'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
