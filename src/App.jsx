import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import SocialPage from './pages/SocialPage';
import NewsPromoPage from './pages/NewsPromoPage';
import MomentPage from './pages/MomentPage';
import FaqPage from './pages/FaqPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage';

function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/social" element={<SocialPage />} />
          <Route path="/news-promo" element={<NewsPromoPage />} />
          <Route path="/moment" element={<MomentPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </main>
      
      {/* Footer */}
      <footer className="bg-brand-dark text-white pt-12 pb-6 mt-auto">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand & Address */}
          <div>
            <h3 className="text-[15px] font-bold mb-4 uppercase tracking-wider text-brand-light">d'Bakery</h3>
            <ul className="space-y-2 text-[13px] text-white/80">
              <li className="flex items-start gap-2">
                <span className="mt-[2px]">📍</span>
                <a
                  href="https://maps.app.goo.gl/V3oWBdWoBW8e9NFW6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-light transition-colors leading-snug"
                >
                  Lihat Lokasi Kami di Google Maps
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span>📞</span>
                <a href="https://wa.me/6285742384630" className="hover:text-brand-light transition-colors">
                  +62 857-4238-4630
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span>🕐</span>
                <span>Senin – Minggu: 07.00 – 21.00</span>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-[15px] font-bold mb-4 uppercase tracking-wider text-brand-light">Customer Care</h3>
            <ul className="space-y-2 text-[13px] text-white/80">
              <li className="hover:text-white cursor-pointer transition-colors">Panduan Pemesanan</li>
              <li className="hover:text-white cursor-pointer transition-colors">Syarat &amp; Ketentuan</li>
              <li className="hover:text-white cursor-pointer transition-colors">Kontak Kami</li>
            </ul>
          </div>

          {/* Metode Pembayaran */}
          <div>
            <h3 className="text-[15px] font-bold mb-4 uppercase tracking-wider text-brand-light">Metode Pembayaran</h3>
            <div className="flex gap-2 flex-wrap">
              {['BCA', 'Mandiri', 'GoPay', 'OVO', 'Dana'].map(method => (
                <div key={method} className="px-3 py-1 bg-white/10 border border-white/20 text-white rounded text-[11px] font-bold hover:bg-white hover:text-brand-dark transition-colors cursor-default">
                  {method}
                </div>
              ))}
            </div>
          </div>

          {/* Sosial Media */}
          <div>
            <h3 className="text-[15px] font-bold mb-4 uppercase tracking-wider text-brand-light">Ikuti Kami</h3>
            <div className="flex gap-3">
              {[
                { label: 'FB', url: 'https://facebook.com' },
                { label: 'IG', url: 'https://instagram.com' },
                { label: 'TT', url: 'https://tiktok.com' },
              ].map(({ label, url }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center text-[11px] font-bold hover:bg-brand-primary hover:border-brand-primary transition-all duration-300"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-[12px] text-white/50">© 2026 d'Bakery. All Rights Reserved.</p>
          <a
            href="https://maps.app.goo.gl/V3oWBdWoBW8e9NFW6"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] text-white/50 hover:text-brand-light transition-colors"
          >
            📍 Temukan Kami di Google Maps
          </a>
        </div>
      </footer>

    </div>
  );
}

export default App;
