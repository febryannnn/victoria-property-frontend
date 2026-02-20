"use client"
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search,
  SlidersHorizontal,
  Grid3X3,
  List,
  ChevronDown,
  X,
  Filter,
  MapPin,
  Home as HomeIcon,
  DollarSign,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { getAllProperties, getPropertiesCount, PropertyFilterParams } from '@/lib/services/property.service';
import { getUserFavoriteIds } from '@/lib/services/favorites.service';

interface Property {
  id?: number;
  title: string;
  description?: string;
  price: string;
  status: 'sale' | 'rent' | 'hot';
  province?: string;
  regency?: string;
  district?: string;
  address?: string;
  building_area?: number;
  land_area?: number;
  electricity?: string;
  water_source?: string;
  bedrooms: number;
  bathrooms: number;
  floors?: number;
  garage?: number;
  carport?: number;
  certificate?: string;
  year_constructed?: number;
  sale_type?: string;
  created_at?: string;
  cover_image_url?: string | null;
  property_type_id?: number;
  user_id?: number;
  image?: string;
  location?: string;
  area?: number;
  priceLabel?: string;
  isNew?: boolean;
}

/* ─────────────────────────────────────────────
   Skeleton card for loading state
───────────────────────────────────────────── */
const SkeletonCard = ({ index }: { index: number }) => (
  <div
    className="skeleton-card bg-card rounded-xl overflow-hidden shadow-sm"
    style={{ animationDelay: `${index * 60}ms` }}
  >
    <div className="skeleton-block h-48 w-full" />
    <div className="p-4 space-y-3">
      <div className="skeleton-block h-4 w-3/4 rounded" />
      <div className="skeleton-block h-3 w-1/2 rounded" />
      <div className="skeleton-block h-5 w-1/3 rounded" />
      <div className="flex gap-3 pt-1">
        <div className="skeleton-block h-3 w-16 rounded" />
        <div className="skeleton-block h-3 w-16 rounded" />
        <div className="skeleton-block h-3 w-16 rounded" />
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Scroll-reveal hook
───────────────────────────────────────────── */
function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

const Properties = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gridKey, setGridKey] = useState(0);

  // Server returns only the current page
  const [properties, setProperties] = useState<Property[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  // Filter states (UI values)
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(''); // sent to server after delay
  const [propertyType, setPropertyType] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [bedroomsFilter, setBedroomsFilter] = useState('all');
  const [bathroomsFilter, setBathroomsFilter] = useState('all');
  const [landAreaFilter, setLandAreaFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  // Debounce search — wait 400ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // reset page on new search
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const activeFiltersCount = [
    debouncedSearch.trim() !== '',
    propertyType !== 'all',
    statusFilter !== 'all',
    priceRange !== 'all',
    bedroomsFilter !== 'all',
    bathroomsFilter !== 'all',
    landAreaFilter !== 'all',
    locationFilter !== 'all',
  ].filter(Boolean).length;

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const { ref: resultsRef, visible: resultsVisible } = useScrollReveal(0.05);
  const { ref: paginationRef, visible: paginationVisible } = useScrollReveal(0.1);

  // Build server params from current filter state
  const buildServerParams = useCallback((): PropertyFilterParams => {
    const params: PropertyFilterParams = {
      page: currentPage,
      limit: itemsPerPage,
    };

    if (debouncedSearch.trim()) params.keyword = debouncedSearch.trim();
    if (statusFilter !== 'all') params.sale_type = statusFilter === 'sale' ? 'jual' : 'sewa';
    if (propertyType !== 'all') params.property_type_id = parseInt(propertyType);
    if (locationFilter !== 'all') params.regency = locationFilter;

    // Price range → min/max
    switch (priceRange) {
      case '0-1m': params.max_price = 1_000_000_000; break;
      case '1-3m': params.min_price = 1_000_000_000; params.max_price = 3_000_000_000; break;
      case '3-5m': params.min_price = 3_000_000_000; params.max_price = 5_000_000_000; break;
      case '5-10m': params.min_price = 5_000_000_000; params.max_price = 10_000_000_000; break;
      case '10m+': params.min_price = 10_000_000_000; break;
    }

    // Land area → min/max
    switch (landAreaFilter) {
      case '0-100': params.max_land_area = 100; break;
      case '100-200': params.min_land_area = 100; params.max_land_area = 200; break;
      case '200-500': params.min_land_area = 200; params.max_land_area = 500; break;
      case '500+': params.min_land_area = 500; break;
    }

    // Sort
    switch (sortBy) {
      case 'price-low': params.sort = 'price_asc'; break;
      case 'price-high': params.sort = 'price_desc'; break;
      default: params.sort = 'newest';
    }

    return params;
  }, [currentPage, itemsPerPage, debouncedSearch, statusFilter, propertyType, locationFilter, priceRange, landAreaFilter, bathroomsFilter, bedroomsFilter, sortBy]);

  // Fetch on every filter/page change
  useEffect(() => {
    fetchProperties();
  }, [buildServerParams]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  async function fetchFavorites() {
    const ids = await getUserFavoriteIds();
    setFavoriteIds(ids);
  }

  async function fetchProperties() {
    try {
      setLoading(true);
      const params = buildServerParams();
      const res = await getAllProperties(params);
      const propertyData = res.data?.property || res.data || [];
      // Total count from server response or separate field
      const serverTotal = res.data?.total ?? res.total ?? null;

      const mapped: Property[] = propertyData.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        price: item.price,
        status: item.sale_type === 'jual' ? 'sale' : 'rent',
        province: item.province,
        regency: item.regency,
        district: item.district,
        address: item.address,
        building_area: item.building_area,
        land_area: item.land_area,
        electricity: item.electricity,
        water_source: item.water_source,
        bedrooms: item.bedrooms,
        bathrooms: item.bathrooms,
        floors: item.floors,
        garage: item.garage,
        carport: item.carport,
        certificate: item.certificate,
        year_constructed: item.year_constructed,
        sale_type: item.sale_type,
        created_at: item.created_at,
        cover_image_url: item.cover_image_url ? `http://localhost:8080${item.cover_image_url}` : null,
        property_type_id: item.property_type_id,
        user_id: item.user_id,
        image: item.cover_image_url ? `http://localhost:8080${item.cover_image_url}` : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        location: `${item.district}, ${item.regency}, ${item.province}`,
        area: item.land_area || item.building_area || 0,
        priceLabel: item.sale_type === 'sewa' ? '/bulan' : undefined,
        isNew: item.created_at ? isNewProperty(item.created_at) : false,
      }));

      setProperties(mapped);

      // Update total count: prefer server total, fallback to count endpoint
      if (serverTotal !== null) {
        setTotalCount(serverTotal);
      } else {
        // fetch count with same filters (no page/limit)
        const { page: _p, limit: _l, ...filterOnly } = params;
        const count = await getPropertiesCount(filterOnly);
        setTotalCount(count);
      }

      setGridKey(k => k + 1);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setLoading(false);
    }
  }

  function isNewProperty(createdAt: string): boolean {
    const created = new Date(createdAt);
    const now = new Date();
    const diffDays = Math.ceil(Math.abs(now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }

  function formatPrice(price: string): string {
    const numPrice = parseFloat(price);
    if (numPrice >= 1000000000) return `Rp ${(numPrice / 1000000000).toFixed(1)} M`;
    if (numPrice >= 1000000) return `Rp ${(numPrice / 1000000).toFixed(1)} Jt`;
    return `Rp ${numPrice.toLocaleString('id-ID')}`;
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push('...'); pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1); pages.push('...');
      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1); pages.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push('...'); pages.push(totalPages);
    }
    return pages;
  };





  const handleResetFilters = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setPropertyType('all'); setStatusFilter('all');
    setPriceRange('all'); setBedroomsFilter('all');
    setBathroomsFilter('all'); setLandAreaFilter('all');
    setLocationFilter('all'); setSortBy('newest');
    setCurrentPage(1);
  };

  // When non-search filters change, reset to page 1
  const handleFilterChange = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Server returns exactly the current page — no slicing needed
  const currentProperties = properties;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + properties.length, totalCount);
  const displayedCount = totalCount;

  return (
    <>
      <style>{`
        /* ── Skeleton shimmer ── */
        @keyframes skeleton-shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }
        .skeleton-block {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 800px 100%;
          animation: skeleton-shimmer 1.4s infinite linear;
        }
        .skeleton-card {
          animation: skeleton-fade-in 0.4s ease both;
        }
        @keyframes skeleton-fade-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Hero header ── */
        @keyframes hero-in {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-badge  { animation: hero-in 0.6s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
        .hero-title  { animation: hero-in 0.7s cubic-bezier(0.22,1,0.36,1) 0.15s both; }
        .hero-sub    { animation: hero-in 0.7s cubic-bezier(0.22,1,0.36,1) 0.25s both; }

        /* ── Search card ── */
        .search-card-anim {
          animation: hero-in 0.7s cubic-bezier(0.22,1,0.36,1) 0.3s both;
        }

        /* ── Property cards stagger ── */
        @keyframes card-in {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        .prop-card-anim {
          animation: card-in 0.55s cubic-bezier(0.22,1,0.36,1) both;
        }

        /* ── Filter panel ── */
        @keyframes filter-slide-in {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .filter-panel-anim {
          animation: filter-slide-in 0.35s cubic-bezier(0.22,1,0.36,1) both;
        }

        /* ── Results header reveal ── */
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .results-header-anim {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .results-header-anim.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Pagination ── */
        .pagination-anim {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s;
        }
        .pagination-anim.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Pagination ── */
        .page-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1.5px solid #e5e7eb;
          background: white;
          color: hsl(207,23%,28%);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
        }
        .page-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
          border-color: var(--color-victoria-red);
          color: var(--color-victoria-red);
        }
        .page-btn.page-btn-active {
          background: hsl(207,23%,28%);
          color: white !important;
          border-color: hsl(207,23%,28%);
          box-shadow: 0 2px 8px rgba(35,51,66,0.25);
        }
        .page-btn.page-btn-active:hover {
          background: hsl(207,23%,22%);
          border-color: hsl(207,23%,22%);
          color: white !important;
        }
        .page-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        /* ── Spinner ── */
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spinner {
          animation: spin 0.8s linear infinite;
        }

        /* ── View mode toggle ── */
        .view-btn {
          transition: all 0.2s ease;
        }
        .view-btn:hover {
          transform: scale(1.1);
        }

        /* ── Input focus lift ── */
        .search-input-wrap {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .search-input-wrap:focus-within {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(179,40,40,0.1);
        }

        /* ── Quick filter pills hover ── */
        .filter-pill {
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .filter-pill:focus-within {
          box-shadow: 0 2px 12px rgba(179,40,40,0.12);
        }

        /* ── Empty state ── */
        @keyframes empty-in {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        .empty-anim {
          animation: empty-in 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <Navbar />

        <main className="pt-32 pb-20">
          <div className="container-victoria">

            {/* ── Hero Header ── */}
            <div className="mb-5 text-center mt-10">
              <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 bg-victoria-navy/5 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-victoria-red" />
                <span className="text-sm font-medium text-victoria-navy">Properti Premium</span>
              </div>
              <h1 className="hero-title text-4xl md:text-5xl font-bold text-victoria-navy mb-4 bg-gradient-to-r from-victoria-navy to-victoria-red bg-clip-text text-transparent">
                Daftar Properti
              </h1>
              <p className="hero-sub text-lg text-muted-foreground max-w-2xl mx-auto">
                Temukan properti impian Anda dari{' '}
                <span className="font-semibold text-victoria-navy">{totalCount}</span> listing tersedia
              </p>
            </div>

            {/* ── Search & Filter Card ── */}
            <Card className="search-card-anim mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 md:p-8">
                <div className="space-y-6">

                  {/* Tabs */}
                  <Tabs value={statusFilter} onValueChange={handleFilterChange(setStatusFilter)} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 h-12 bg-gray-100 p-1">
                      {['all', 'sale', 'rent'].map((val, i) => (
                        <TabsTrigger
                          key={val}
                          value={val}
                          className="data-[state=active]:bg-victoria-red data-[state=active]:text-white hover:bg-victoria-red/50 hover:text-white transition-colors duration-200 rounded-md"
                          style={{ transitionDelay: `${i * 40}ms` }}
                        >
                          {val === 'all' ? 'Semua Properti' : val === 'sale' ? 'Dijual' : 'Disewa'}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>

                  {/* Search row */}
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="search-input-wrap flex-1 relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-victoria-red transition-colors" />
                      <Input
                        type="text"
                        placeholder="Cari berdasarkan lokasi, nama properti..."
                        className="pl-12 h-14 text-base border-gray-200 focus-visible:ring-victoria-red focus-visible:border-victoria-red bg-white shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}

                      />
                      {searchQuery && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 p-0 hover:bg-gray-100"
                          onClick={() => setSearchQuery('')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <Button
                      size="lg"
                      className="h-14 px-8 bg-victoria-red hover:bg-victoria-maroon text-white hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Cari
                    </Button>

                    <Button
                      variant={showFilters ? "default" : "outline"}
                      size="lg"
                      className={`h-14 px-6 transition-all duration-200 hover:-translate-y-0.5 ${showFilters
                        ? 'bg-victoria-navy hover:bg-victoria-navy/90'
                        : 'border-2 border-gray-200 hover:border-victoria-red hover:text-victoria-red'
                        }`}
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <SlidersHorizontal className="w-5 h-5 mr-2" />
                      Filter
                      {activeFiltersCount > 0 && (
                        <Badge className="ml-2 bg-victoria-red hover:bg-victoria-red">{activeFiltersCount}</Badge>
                      )}
                      <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
                    </Button>
                  </div>

                  {/* Quick filter pills */}
                  <div className="flex flex-wrap gap-3">
                    {[
                      {
                        value: propertyType, onChange: handleFilterChange(setPropertyType), width: 'w-[160px]',
                        icon: <HomeIcon className="w-4 h-4 mr-2 text-victoria-red" />,
                        placeholder: 'Tipe Properti',
                        items: [['all', 'Semua Tipe'], ['1', 'Rumah'], ['2', 'Apartemen'], ['3', 'Ruko'], ['4', 'Tanah']]
                      },
                      {
                        value: priceRange, onChange: handleFilterChange(setPriceRange), width: 'w-[180px]',
                        icon: <DollarSign className="w-4 h-4 mr-2 text-victoria-red" />,
                        placeholder: 'Rentang Harga',
                        items: [['all', 'Semua Harga'], ['0-1m', 'Di bawah 1 M'], ['1-3m', '1 M - 3 M'], ['3-5m', '3 M - 5 M'], ['5-10m', '5 M - 10 M'], ['10m+', 'Di atas 10 M']]
                      },
                      {
                        value: locationFilter, onChange: handleFilterChange(setLocationFilter), width: 'w-[160px]',
                        icon: <MapPin className="w-4 h-4 mr-2 text-victoria-red" />,
                        placeholder: 'Lokasi',
                        items: [['all', 'Semua Lokasi'], ['jakarta', 'Jakarta'], ['tangerang', 'Tangerang'], ['bogor', 'Bogor'], ['bekasi', 'Bekasi'], ['depok', 'Depok']]
                      },
                    ].map((f, i) => (
                      <Select key={i} value={f.value} onValueChange={f.onChange}>
                        <SelectTrigger className={`filter-pill ${f.width} h-11 border-gray-200 bg-white hover:border-victoria-red transition-colors`}>
                          {f.icon}
                          <SelectValue placeholder={f.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {f.items.map(([val, label]) => (
                            <SelectItem key={val} value={val}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ))}

                    {activeFiltersCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-11 text-victoria-red hover:text-victoria-red hover:bg-victoria-red/10 transition-all duration-200 hover:-translate-y-0.5"
                        onClick={handleResetFilters}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reset ({activeFiltersCount})
                      </Button>
                    )}
                  </div>

                  {/* Advanced filter panel */}
                  {showFilters && (
                    <div className="filter-panel-anim pt-6 border-t border-gray-200">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          <Filter className="w-5 h-5 text-victoria-navy" />
                          <h3 className="font-semibold text-victoria-navy">Filter Lanjutan</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {[
                            { label: 'Kamar Tidur', value: bedroomsFilter, onChange: handleFilterChange(setBedroomsFilter), items: [['all', 'Semua'], ['1', '1 Kamar'], ['2', '2 Kamar'], ['3', '3 Kamar'], ['4', '4+ Kamar']] },
                            { label: 'Kamar Mandi', value: bathroomsFilter, onChange: handleFilterChange(setBathroomsFilter), items: [['all', 'Semua'], ['1', '1 Kamar Mandi'], ['2', '2 Kamar Mandi'], ['3', '3+ Kamar Mandi']] },
                            { label: 'Luas Tanah', value: landAreaFilter, onChange: handleFilterChange(setLandAreaFilter), items: [['all', 'Semua Ukuran'], ['0-100', '0 - 100 m²'], ['100-200', '100 - 200 m²'], ['200-500', '200 - 500 m²'], ['500+', '500+ m²']] },
                          ].map((f, i) => (
                            <div key={i} className="space-y-2" style={{ animationDelay: `${i * 60}ms` }}>
                              <label className="text-sm font-medium text-gray-700">{f.label}</label>
                              <Select value={f.value} onValueChange={f.onChange}>
                                <SelectTrigger className="bg-white hover:border-victoria-red transition-colors">
                                  <SelectValue placeholder={`Pilih ${f.label.toLowerCase()}`} />
                                </SelectTrigger>
                                <SelectContent>
                                  {f.items.map(([val, label]) => (
                                    <SelectItem key={val} value={val}>{label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          ))}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">&nbsp;</label>
                            <Button
                              className="w-full bg-victoria-red hover:bg-victoria-red/90 text-white h-10 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                              onClick={() => { }} // filter is realtime, button is decorative
                            >
                              Terapkan Filter
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* ── Results header ── */}
            <div
              ref={resultsRef}
              className={`results-header-anim ${resultsVisible ? 'visible' : ''} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8`}
            >
              <div className="flex items-center gap-4">
                <p className="text-gray-600">
                  Menampilkan{' '}
                  <span className="font-bold text-victoria-navy text-lg">{startIndex + 1}-{endIndex}</span>{' '}
                  dari <span className="font-semibold text-gray-900">{displayedCount}</span> properti
                </p>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="bg-victoria-red/10 text-victoria-red border-0">
                    Terfilter
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Select value={sortBy} onValueChange={handleFilterChange(setSortBy)}>
                  <SelectTrigger className="w-[200px] border-gray-200 bg-white hover:border-victoria-red transition-colors">
                    <SelectValue placeholder="Urutkan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Terbaru</SelectItem>
                    <SelectItem value="price-low">Harga: Rendah ke Tinggi</SelectItem>
                    <SelectItem value="price-high">Harga: Tinggi ke Rendah</SelectItem>
                  </SelectContent>
                </Select>

                <div className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  {(['grid', 'list'] as const).map((mode) => (
                    <Button
                      key={mode}
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode(mode)}
                      className={`view-btn h-9 w-9 p-0 ${viewMode === mode
                        ? 'bg-white text-victoria-navy shadow-sm'
                        : 'text-gray-500 hover:text-victoria-navy'
                        }`}
                    >
                      {mode === 'grid' ? <Grid3X3 className="w-5 h-5" /> : <List className="w-5 h-5" />}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Property Grid ── */}
            {loading ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                {Array.from({ length: itemsPerPage }).map((_, i) => (
                  <SkeletonCard key={i} index={i} />
                ))}
              </div>
            ) : currentProperties.length === 0 ? (
              <Card className="empty-anim border-2 border-dashed border-gray-200">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="p-4 bg-gray-100 rounded-full mb-4">
                    <HomeIcon className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada properti yang sesuai</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm">Coba ubah kriteria pencarian atau filter Anda</p>
                  <Button
                    onClick={handleResetFilters}
                    variant="outline"
                    className="border-victoria-red text-victoria-red hover:bg-victoria-red hover:text-white transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reset Semua Filter
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div
                  key={gridKey}
                  className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}
                >
                  {currentProperties.map((property, i) => (
                    <a
                      key={property.id}
                      href={`/property/${property.id}`}
                      className="prop-card-anim block group"
                      style={{ animationDelay: `${i * 55}ms` }}
                    >
                      <PropertyCard
                        id={property.id!}
                        image={property.image || property.cover_image_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'}
                        title={property.title}
                        location={property.location || `${property.district}, ${property.regency}`}
                        price={formatPrice(property.price)}
                        priceLabel={property.priceLabel}
                        bedrooms={property.bedrooms}
                        bathrooms={property.bathrooms}
                        area={property.area || property.land_area || property.building_area || 0}
                        status={property.status}
                        isNew={property.isNew}
                        initialLiked={favoriteIds.includes(property.id!)}
                      />
                    </a>
                  ))}
                </div>

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                  <div
                    ref={paginationRef}
                    className={`pagination-anim ${paginationVisible ? 'visible' : ''}`}
                  >
                    <div className="flex justify-center items-center mt-12 gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="page-btn"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      {getPageNumbers().map((page, index) =>
                        page === '...' ? (
                          <span key={`ellipsis-${index}`} className="px-2 text-gray-400">...</span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page as number)}
                            className={`page-btn ${currentPage === page ? 'page-btn-active' : ''}`}
                            aria-label={`Page ${page}`}
                            aria-current={currentPage === page ? 'page' : undefined}
                          >
                            {page}
                          </button>
                        )
                      )}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="page-btn"
                        aria-label="Next page"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="text-center mt-4">
                      <p className="text-sm text-muted-foreground">
                        Halaman <span className="font-semibold text-victoria-navy">{currentPage}</span>{' '}
                        dari <span className="font-semibold text-victoria-navy">{totalPages}</span>
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Properties;