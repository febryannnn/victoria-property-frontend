"use client"
import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Home, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-property.jpg';
import Image from 'next/image';

/* ─────────────────────────────────────────
   Counter helpers
───────────────────────────────────────── */
const heroStats = [
  { target: 15000, suffix: '+', separator: true, label: 'Properti Tersedia', cls: 'vp-stat-1' },
  { target: 8500, suffix: '+', separator: true, label: 'Pelanggan Puas', cls: 'vp-stat-2' },
  { target: 120, suffix: '+', separator: false, label: 'Kota di Indonesia', cls: 'vp-stat-3' },
];

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

function useCountUp(target: number, duration: number, active: boolean) {
  const [value, setValue] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const t0 = performance.now();
    function tick(now: number) {
      const p = Math.min((now - t0) / duration, 1);
      setValue(Math.round(easeOutQuart(p) * target));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active, target, duration]);

  return value;
}

function StatCounter({
  target, suffix, separator, label, cls, delay, globalStart,
}: {
  target: number; suffix: string; separator: boolean;
  label: string; cls: string; delay: number; globalStart: boolean;
}) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!globalStart || active) return;
    const id = setTimeout(() => setActive(true), delay);
    return () => clearTimeout(id);
  }, [globalStart, delay, active]);

  const value = useCountUp(target, 2200, active);

  const display = separator
    ? value.toLocaleString('id-ID')
    : value.toString();

  return (
    <div className={`${cls} text-center`}>
      <div className="text-2xl md:text-3xl font-bold text-white tabular-nums">
        {display}{suffix}
      </div>
      <div className="text-sm text-white">{label}</div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
const HeroSection = () => {
  const [activeTab, setActiveTab] = useState('dijual');
  const [countersStarted, setCountersStarted] = useState(false);

  // Stats animate in at ~1.4s, trigger count-up then
  useEffect(() => {
    const id = setTimeout(() => setCountersStarted(true), 1400);
    return () => clearTimeout(id);
  }, []);

  const propertyTypes = ['Semua', 'Rumah', 'Apartemen', 'Ruko', 'Tanah', 'Villa', 'Gedung', 'Hotel'];
  const priceRanges = [
    'Semua Harga', '< 500 Juta', '500 Juta - 1 M',
    '1 M - 2 M', '2 M - 5 M', '> 5 M',
  ];

  return (
    <>
      <style>{`
        /* ── Entrance keyframes (slower) ── */
        @keyframes vp-fade-up {
          from { opacity: 0; transform: translateY(36px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes vp-scale-in {
          from { opacity: 0; transform: translateY(44px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes vp-img-zoom {
          from { transform: scale(1.08); }
          to   { transform: scale(1); }
        }

        /* ── Entrance classes — longer durations, bigger delays ── */
        .vp-badge    { opacity:0; animation: vp-fade-up  1.0s cubic-bezier(0.22,1,0.36,1) 0.2s  forwards; }
        .vp-heading  { opacity:0; animation: vp-fade-up  1.1s cubic-bezier(0.22,1,0.36,1) 0.45s forwards; }
        .vp-subtitle { opacity:0; animation: vp-fade-up  1.1s cubic-bezier(0.22,1,0.36,1) 0.7s  forwards; }
        .vp-search   { opacity:0; animation: vp-scale-in 1.2s cubic-bezier(0.22,1,0.36,1) 0.95s forwards; }
        .vp-stat-1   { opacity:0; animation: vp-fade-up  0.9s cubic-bezier(0.22,1,0.36,1) 1.3s  forwards; }
        .vp-stat-2   { opacity:0; animation: vp-fade-up  0.9s cubic-bezier(0.22,1,0.36,1) 1.5s  forwards; }
        .vp-stat-3   { opacity:0; animation: vp-fade-up  0.9s cubic-bezier(0.22,1,0.36,1) 1.7s  forwards; }
        .vp-bg-img   { animation: vp-img-zoom 2.4s cubic-bezier(0.22,1,0.36,1) forwards; }

        /* ── Badge dot pulse ── */
        @keyframes vp-dot-pulse {
          0%, 100% { box-shadow: 0 0 0 0   hsl(45 92% 49% / 0.6); }
          50%       { box-shadow: 0 0 0 7px hsl(45 92% 49% / 0);   }
        }
        .vp-dot { animation: vp-dot-pulse 2.4s ease-in-out infinite; }

        /* ── Search button: shimmer + lift ── */
        .vp-btn {
          position: relative; overflow: hidden;
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1),
                      box-shadow 0.3s ease;
        }
        .vp-btn::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.22) 50%, transparent 60%);
          background-size: 200% 100%;
          background-position: 200% center;
        }
        .vp-btn:hover::after {
          animation: vp-shimmer 0.5s ease forwards;
        }
        @keyframes vp-shimmer {
          from { background-position:  200% center; }
          to   { background-position: -200% center; }
        }
        .vp-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px hsl(0 70% 37% / 0.4);
        }
        .vp-btn:active { transform: translateY(0); box-shadow: none; }

        /* ── Inputs: focus glow ── */
        .vp-field {
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .vp-field:focus {
          box-shadow: 0 0 0 3px hsl(0 70% 37% / 0.15);
        }

        /* ── Overlay slow breathe ── */
        @keyframes vp-breathe {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.88; }
        }
        .vp-overlay { animation: vp-breathe 10s ease-in-out infinite; }
      `}</style>

      <section className="relative min-h-screen flex items-center justify-center pt-32 pb-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt="Luxury Property"
            fill
            priority
            className="hero-image vp-bg-img"
          />
          <div className="vp-overlay absolute inset-0 bg-gradient-to-b 
            from-victoria-navy/70 
            via-victoria-navy/50 
            to-victoria-navy/80"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 container-victoria">
          <div className="max-w-4xl mx-auto text-center">

            {/* Badge */}
            <div className="vp-badge inline-flex items-center gap-2 
              bg-victoria-yellow/20
              backdrop-blur-sm 
              border border-victoria-yellow 
              rounded-full px-4 py-2 mb-6">
              <span className="vp-dot w-2 h-2 bg-victoria-yellow rounded-full" />
              <span className="text-victoria-yellow text-sm font-medium">Partner Properti Terpercaya #1</span>
            </div>

            {/* Heading */}
            <h1 className="vp-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6" style={{ fontWeight: 800 }}>
              Temukan Hunian
              <span className="block text-victoria-yellow font-extrabold">Impian Anda</span>
            </h1>

            <p className="vp-subtitle text-lg md:text-xl text-white mb-10 max-w-2xl mx-auto">
              Ribuan pilihan properti terbaik di seluruh Indonesia.
              Jual, beli, atau sewa dengan mudah dan aman bersama Victoria Property.
            </p>

            {/* Search Box */}
            <div className="vp-search bg-victoria-light backdrop-blur-md rounded-2xl p-6 shadow-victoria-xl border border-border">
              {/* Tabs */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setActiveTab('dijual')}
                  className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ease-in-out ${activeTab === 'dijual'
                    ? 'bg-victoria-red text-white shadow-lg scale-105'
                    : 'bg-muted text-muted-foreground hover:bg-victoria-red/50 hover:text-white hover:shadow-md hover:scale-105'
                    }`}
                >
                  Dijual
                </button>

                <button
                  onClick={() => setActiveTab('disewa')}
                  className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ease-in-out ${activeTab === 'disewa'
                    ? 'bg-victoria-red text-white shadow-lg scale-105'
                    : 'bg-muted text-muted-foreground hover:bg-victoria-red/50 hover:text-white hover:shadow-md hover:scale-105'
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
                    className="vp-field h-14 w-full rounded-xl border border-border bg-white pl-14 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-victoria-red"
                  />
                </div>

                {/* Property Type */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Home className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <select className="vp-field h-14 w-full rounded-xl border border-border bg-white pl-14 pr-4 text-base appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-victoria-red">
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <DollarSign className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <select className="vp-field h-14 w-full rounded-xl border border-border bg-white pl-14 pr-4 text-base appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-victoria-red">
                    {priceRanges.map((range) => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>

                {/* Search Button */}
                <Button className="vp-btn h-14 w-full rounded-xl bg-victoria-red hover:bg-victoria-red/90 text-white font-semibold text-base flex items-center justify-center gap-2">
                  <Search className="w-5 h-5" />
                  Cari Properti
                </Button>
              </div>
            </div>

            {/* Stats — animated counters */}
            <div className="grid grid-cols-3 gap-8 mt-12">
              {heroStats.map((stat, i) => (
                <StatCounter
                  key={stat.label}
                  target={stat.target}
                  suffix={stat.suffix}
                  separator={stat.separator}
                  label={stat.label}
                  cls={stat.cls}
                  delay={i * 200}
                  globalStart={countersStarted}
                />
              ))}
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;