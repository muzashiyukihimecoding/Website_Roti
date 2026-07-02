import React from "react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Page Title & Breadcrumb */}
        <div className="mb-12">
          <h1 className="text-[26px] font-medium text-brand-primary tracking-wide mb-1 font-sans">
            About Us
          </h1>
          <div className="text-[12px] text-gray-800 font-medium flex gap-2">
            <Link to="/" className="cursor-pointer hover:text-brand-primary">
              Home
            </Link>
            <span>/</span>
            <span>About Us</span>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start max-w-6xl">
          {/* Left Text Content */}
          <div className="flex-1 max-w-3xl">
            <h2 className="text-[28px] font-bold text-gray-900 mb-6 tracking-tight">
              One Stop Bakery Store
            </h2>

            <div className="text-[14px] text-gray-800 leading-[1.8] space-y-6">
              <p>
                d'Bakery berawal dari usaha rumahan mandiri, toko roti kami
                terus tumbuh dan kini memiliki beberapa outlet yang tersebar di
                wilayah Purwokerto Selatan dan Banyumas Kota. Dengan semangat
                untuk selalu berkembang, kami berkomitmen menghadirkan produk
                berkualitas tanpa meninggalkan cita rasa khas yang telah
                dipercaya pelanggan.
              </p>

              <p>
                Sejak berdiri pada tahun 2018, kami senantiasa menjaga kualitas
                bahan dan proses pembuatan agar setiap produk tetap halal,
                nikmat, sehat, serta kaya nutrisi. Didukung harga yang sangat
                terjangkau, roti kami cocok dinikmati oleh semua kalangan, mulai
                dari anak-anak hingga orang dewasa.
              </p>
            </div>
          </div>

          {/* Right Image */}
          <div className="w-full lg:w-[480px] shrink-0">
            <div className="bg-white p-4 shadow-xl border border-gray-100 rounded-sm transform transition duration-500 hover:scale-105">
              <img
                src="/assets/about_building.png"
                alt="d'Bakery Building"
                className="w-full h-auto object-cover rounded-sm"
              />
            </div>
          </div>
        </div>

        {/* Second Row: Image Left, Vision Right */}
        <div className="flex flex-col-reverse lg:flex-row gap-12 lg:gap-20 items-center max-w-6xl mt-24 relative">
          {/* Floral Background Ornament */}
          <div className="absolute -right-[150px] top-1/2 -translate-y-1/2 opacity-20 pointer-events-none hidden lg:block overflow-hidden">
            <svg
              width="400"
              height="400"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Petal layers mimicking a floral mandala */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <path
                  key={i}
                  d="M50 50 C 30 20, 70 20, 50 50"
                  fill={i % 2 === 0 ? "#E07A5F" : "#F4A261"}
                  transform={`rotate(${angle} 50 50) translate(0 -20) scale(1.5)`}
                />
              ))}
              <circle cx="50" cy="50" r="5" fill="#E07A5F" />
            </svg>
          </div>

          {/* Left Image */}
          <div className="w-full lg:w-[420px] shrink-0 z-10">
            <div className="bg-white p-4 shadow-xl border border-gray-100 rounded-sm transform transition duration-500 hover:-scale-x-105">
              <img
                src="/assets/vision_bread.png"
                alt="d'Bakery Vision"
                className="w-full h-auto object-cover rounded-sm"
              />
            </div>
          </div>

          {/* Right Text Content */}
          <div className="flex-1 max-w-3xl z-10 py-6">
            <h2 className="text-[28px] font-bold text-gray-900 mb-6 tracking-tight">
              Our Vision and Mission
            </h2>

            <div className="text-[14px] text-gray-800 leading-[1.8] space-y-6">
              <p>
                Our vision is to make d'Bakery's products a preferred staple
                food choice for Indonesian people.
              </p>

              <div>
                <p className="mb-2">Our missions are:</p>
                <ul className="list-disc pl-6 space-y-3">
                  <li>
                    Continuously develop high quality, nutritious and healthy
                    products to adapt Indonesian taste.
                  </li>
                  <li>
                    Continuously open new stores to be accessible nationwide.
                  </li>
                  <li>
                    Continuously improve human resources quality by increasing
                    welfare and competence to provide excellent service to
                    customers.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
