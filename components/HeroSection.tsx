"use client"
import { useState } from 'react';
import { Search, MapPin, Home, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-property.jpg';
import Image from 'next/image'

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState('dijual');
  const propertyTypes = ['Semua', 'Rumah', 'Apartemen', 'Ruko', 'Tanah', 'Villa', 'Gedung', 'Hotel'];
  const priceRanges = [
    'Semua Harga',
    '< 500 Juta',
    '500 Juta - 1 M',
    '1 M - 2 M',
    '2 M - 5 M',
    '> 5 M',
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-16 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt="Luxury Property"
          fill 
          priority
          className="hero-image"
        />
        <div className="absolute inset-0 bg-gradient-to-b
  from-[hsl(var(--victoria-navy)/0.7)]
  via-[hsl(var(--victoria-navy)/0.5)]
  to-[hsl(var(--victoria-navy)/0.8)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-victoria">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-victoria-yellow/20 backdrop-blur-sm border border-[hsl(var(--victoria-yellow))] rounded-full px-4 py-2 mb-6 animate-fade-in">
            <span className="w-2 h-2 bg-[hsl(var(--victoria-yellow))] rounded-full animate-pulse" />
            <span className="text-[hsl(var(--victoria-yellow))] text-sm font-medium">Partner Properti Terpercaya #1</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 animate-slide-up" style={{ animationDelay: '0.1s' , fontWeight: 800 }}>
            Temukan Hunian
            <span className="block text-victoria-yellow font-extrabold">Impian Anda</span>
          </h1>

          <p className="text-lg md:text-xl text-white mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Ribuan pilihan properti terbaik di seluruh Indonesia.
            Jual, beli, atau sewa dengan mudah dan aman bersama Victoria Property.
          </p>

          {/* Search Box */}

          <div
  className="bg-victoria-light backdrop-blur-md rounded-2xl p-6 shadow-victoria-xl border border-border"
  style={{ animationDelay: '0.3s' }}
>
  {/* Tabs */}
  <div className="flex gap-3 mb-6">
    <button
      onClick={() => setActiveTab('dijual')}
      className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all
        ${activeTab === 'dijual'
          ? 'bg-victoria-red text-white shadow-md'
          : 'bg-muted text-muted-foreground hover:bg-victoria-navy hover:text-white'
        }`}
    >
      Dijual
    </button>

    <button
      onClick={() => setActiveTab('disewa')}
      className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all
        ${activeTab === 'disewa'
          ? 'bg-victoria-red text-white shadow-md'
          : 'bg-muted text-muted-foreground hover:bg-victoria-navy hover:text-white'
        }`}
    >
      Disewa
    </button>
  </div>

  {/* Search Fields */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {/* Location */}
    <div className="relative">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <MapPin className="w-5 h-5 text-muted-foreground" />
      </div>

      <input
        type="text"
        placeholder="Masukkan lokasi..."
        className="h-14 w-full rounded-xl border border-border bg-white pl-14 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-victoria-red"
      />
    </div>

    {/* Property Type */}
    <div className="relative">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Home className="w-5 h-5 text-muted-foreground" />
      </div>

      <select className="h-14 w-full rounded-xl border border-border bg-white pl-14 pr-4 text-base appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-victoria-red">
        {propertyTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>

    {/* Price Range */}
    <div className="relative">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <DollarSign className="w-5 h-5 text-muted-foreground" />
      </div>

      <select className="h-14 w-full rounded-xl border border-border bg-white pl-14 pr-4 text-base appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-victoria-red">
        {priceRanges.map((range) => (
          <option key={range} value={range}>
            {range}
          </option>
        ))}
      </select>
    </div>

    {/* Search Button */}
    <Button className="h-14 w-full rounded-xl bg-victoria-red hover:bg-victoria-red/90 text-white font-semibold text-base flex items-center justify-center gap-2">
      <Search className="w-5 h-5" />
      Cari Properti
    </Button>
  </div>
</div>


          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            {[
              { value: '15,000+', label: 'Properti Tersedia' },
              { value: '8,500+', label: 'Pelanggan Puas' },
              { value: '120+', label: 'Kota di Indonesia' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-white">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
