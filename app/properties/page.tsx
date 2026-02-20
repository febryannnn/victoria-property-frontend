"use client"
import { useState, useEffect } from 'react';
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
import { getAllProperties, getPropertiesCount } from '@/lib/services/property.service';
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

const Properties = () => {

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data states
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearch, setAppliedSearch] = useState(''); 
  const [propertyType, setPropertyType] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [bedroomsFilter, setBedroomsFilter] = useState('all');
  const [bathroomsFilter, setBathroomsFilter] = useState('all');
  const [landAreaFilter, setLandAreaFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Pagination states - using server-side pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Items per page

  const activeFiltersCount = [
    appliedSearch !== '',
    propertyType !== 'all',
    statusFilter !== 'all',
    priceRange !== 'all',
    bedroomsFilter !== 'all',
    bathroomsFilter !== 'all',
    landAreaFilter !== 'all',
    locationFilter !== 'all',
  ].filter(Boolean).length;

  //favorites
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]); 

  // Calculate total pages based on filtered results
  const totalPages = Math.ceil(
    (activeFiltersCount > 0 ? filteredProperties.length : totalCount) / itemsPerPage
  );

  // Fetch properties from API with pagination
  useEffect(() => {
    fetchProperties();
  }, [currentPage]);

  // Fetch total count and favorites on mount
  useEffect(() => {
    fetchTotalCount();
    fetchFavorites();
  }, []);

  async function fetchFavorites() {
    const ids = await getUserFavoriteIds();
    setFavoriteIds(ids);
  }

  async function fetchTotalCount() {
    try {
      const count = await getPropertiesCount();
      setTotalCount(count);
    } catch (error) {
      console.error("Failed to fetch properties count:", error);
    }
  }

  async function fetchProperties() {
    try {
      setLoading(true);

      // If filters are active, we need to fetch all and filter client-side
      // Otherwise, use server-side pagination
      const shouldFetchAll = activeFiltersCount > 0;
      const pageToFetch = shouldFetchAll ? 1 : currentPage;
      const limitToFetch = shouldFetchAll ? 1000 : itemsPerPage;

      const res = await getAllProperties(pageToFetch, limitToFetch);
      console.log(res);

      // Handle berbagai kemungkinan struktur response
      const propertyData = res.data?.property || res.data || [];
      
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
        cover_image_url: item.cover_image_url
          ? `http://localhost:8080${item.cover_image_url}`
          : null,
        property_type_id: item.property_type_id,
        user_id: item.user_id,
        image: item.cover_image_url
          ? `http://localhost:8080${item.cover_image_url}`
          : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        location: `${item.district}, ${item.regency}, ${item.province}`,
        area: item.land_area || item.building_area || 0,
        priceLabel: item.sale_type === 'sewa' ? '/bulan' : undefined,
        isNew: item.created_at ? isNewProperty(item.created_at) : false,
      }));

      setProperties(mapped);

      // Apply filters if any active
      if (activeFiltersCount > 0) {
        applyFiltersToProperties(mapped);
      } else {
        setFilteredProperties(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setLoading(false);
    }
  }

  // Check if property is new (created in last 7 days)
  function isNewProperty(createdAt: string): boolean {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }

  // Format price from number to readable format
  function formatPrice(price: string): string {
    const numPrice = parseFloat(price);
    if (numPrice >= 1000000000) {
      return `Rp ${(numPrice / 1000000000).toFixed(1)} M`;
    } else if (numPrice >= 1000000) {
      return `Rp ${(numPrice / 1000000).toFixed(1)} Jt`;
    }
    return `Rp ${numPrice.toLocaleString('id-ID')}`;
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  useEffect(() => {
    if (activeFiltersCount > 0) {
      fetchProperties();
    } else {
      setCurrentPage(1);
      fetchProperties();
    }
  }, [appliedSearch, propertyType, statusFilter, priceRange, bedroomsFilter, bathroomsFilter, landAreaFilter, locationFilter, sortBy]);
  const applyFiltersToProperties = (propertiesToFilter: Property[]) => {
    let filtered = [...propertiesToFilter];

    // Search filter
    if (appliedSearch.trim()) {
      const query = appliedSearch.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.location?.toLowerCase().includes(query) ||
          p.address?.toLowerCase().includes(query) ||
          p.province?.toLowerCase().includes(query) ||
          p.regency?.toLowerCase().includes(query) ||
          p.district?.toLowerCase().includes(query)
      );
    }

    // Property type filter (based on property_type_id)
    if (propertyType !== 'all') {
      const typeId = parseInt(propertyType);
      filtered = filtered.filter((p) => p.property_type_id === typeId);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    // Price range filter (in billions)
    if (priceRange !== 'all') {
      filtered = filtered.filter((p) => {
        const price = parseFloat(p.price);
        switch (priceRange) {
          case '0-1m': return price < 1000000000;
          case '1-3m': return price >= 1000000000 && price < 3000000000;
          case '3-5m': return price >= 3000000000 && price < 5000000000;
          case '5-10m': return price >= 5000000000 && price < 10000000000;
          case '10m+': return price >= 10000000000;
          default: return true;
        }
      });
    }

    // Bedrooms filter
    if (bedroomsFilter !== 'all') {
      const beds = parseInt(bedroomsFilter);
      filtered = filtered.filter((p) =>
        beds === 4 ? p.bedrooms >= 4 : p.bedrooms === beds
      );
    }

    // Bathrooms filter
    if (bathroomsFilter !== 'all') {
      const baths = parseInt(bathroomsFilter);
      filtered = filtered.filter((p) =>
        baths === 3 ? p.bathrooms >= 3 : p.bathrooms === baths
      );
    }

    // Land area filter
    if (landAreaFilter !== 'all') {
      filtered = filtered.filter((p) => {
        const area = p.land_area || 0;
        switch (landAreaFilter) {
          case '0-100': return area < 100;
          case '100-200': return area >= 100 && area < 200;
          case '200-500': return area >= 200 && area < 500;
          case '500+': return area >= 500;
          default: return true;
        }
      });
    }

    // Location filter
    if (locationFilter !== 'all') {
      filtered = filtered.filter((p) =>
        p.province?.toLowerCase().includes(locationFilter.toLowerCase()) ||
        p.regency?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        case 'price-low':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price-high':
          return parseFloat(b.price) - parseFloat(a.price);
        default:
          return 0;
      }
    });

    setFilteredProperties(filtered);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setAppliedSearch('')
    setPropertyType('all');
    setStatusFilter('all');
    setPriceRange('all');
    setBedroomsFilter('all');
    setBathroomsFilter('all');
    setLandAreaFilter('all');
    setLocationFilter('all');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get current page properties
  const getCurrentPageProperties = () => {
    if (activeFiltersCount > 0) {
      // Client-side pagination for filtered results
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return filteredProperties.slice(startIndex, endIndex);
    } else {
      // Server-side pagination - show all properties from current fetch
      return filteredProperties;
    }
  };

  const currentProperties = getCurrentPageProperties();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, activeFiltersCount > 0 ? filteredProperties.length : totalCount);
  const displayedCount = activeFiltersCount > 0 ? filteredProperties.length : totalCount;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <Navbar />
        <main className="pt-32 pb-20">
          <div className="container-victoria">
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-victoria-navy border-t-transparent"></div>
                <p className="text-sm text-muted-foreground">Memuat properti...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="container-victoria">
          {/* Hero Header Section */}
          <div className="mb-5 text-center mt-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-victoria-navy/5 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-victoria-red" />
              <span className="text-sm font-medium text-victoria-navy">Properti Premium</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-victoria-navy mb-4 bg-gradient-to-r from-victoria-navy to-victoria-red bg-clip-text text-transparent">
              Daftar Properti
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Temukan properti impian Anda dari <span className="font-semibold text-victoria-navy">{totalCount}</span> listing tersedia
            </p>
          </div>

          {/* Modern Search & Filter Card */}
          <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 md:p-8">
              <div className="space-y-6">
                {/* Quick Status Tabs */}
                <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 h-12 bg-gray-100 p-1">
                    <TabsTrigger
                      value="all"
                      className="data-[state=active]:bg-victoria-red data-[state=active]:text-white hover:bg-victoria-red/50 hover:text-white transition-colors duration-200 rounded-md"
                    >
                      Semua Properti
                    </TabsTrigger>
                    <TabsTrigger
                      value="sale"
                      className="data-[state=active]:bg-victoria-red data-[state=active]:text-white hover:bg-victoria-red/50 hover:text-white transition-colors duration-200 rounded-md"
                    >
                      Dijual
                    </TabsTrigger>
                    <TabsTrigger
                      value="rent"
                      className="data-[state=active]:bg-victoria-red data-[state=active]:text-white hover:bg-victoria-red/50 hover:text-white transition-colors duration-200 rounded-md"
                    >
                      Disewa
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Search Input Row */}
                {/* Search Input Row */}
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Input - hapus pr-28, kembalikan ke normal, hapus tombol Cari di dalam */}
                  <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-victoria-red transition-colors" />
                    <Input
                      type="text"
                      placeholder="Cari berdasarkan lokasi, nama properti..."
                      className="pl-12 h-14 text-base border-gray-200 focus-visible:ring-victoria-red focus-visible:border-victoria-red bg-white shadow-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') setAppliedSearch(searchQuery);
                      }}
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 p-0 hover:bg-gray-100"
                        onClick={() => { setSearchQuery(''); setAppliedSearch(''); }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* TAMBAH tombol Cari di luar input */}
                  <Button
                    size="lg"
                    className="h-14 px-8 bg-victoria-red hover:bg-victoria-maroon text-white"
                    onClick={() => setAppliedSearch(searchQuery)}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Cari
                  </Button>

                  {/* Tombol Filter — tidak ada perubahan dari kode asli */}
                  <Button
                    variant={showFilters ? "default" : "outline"}
                    size="lg"
                    className={`h-14 px-6 ${showFilters
                      ? 'bg-victoria-navy hover:bg-victoria-navy/90'
                      : 'border-2 border-gray-200 hover:border-victoria-red hover:text-victoria-red'
                      }`}
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <SlidersHorizontal className="w-5 h-5 mr-2" />
                    Filter
                    {activeFiltersCount > 0 && (
                      <Badge className="ml-2 bg-victoria-red hover:bg-victoria-red">
                        {activeFiltersCount}
                      </Badge>
                    )}
                    <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
                  </Button>
                </div>

                {/* Quick Filter Pills */}
                <div className="flex flex-wrap gap-3">
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger className="w-[160px] h-11 border-gray-200 bg-white hover:border-victoria-red transition-colors">
                      <HomeIcon className="w-4 h-4 mr-2 text-victoria-red" />
                      <SelectValue placeholder="Tipe Properti" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Tipe</SelectItem>
                      <SelectItem value="1">Rumah</SelectItem>
                      <SelectItem value="2">Apartemen</SelectItem>
                      <SelectItem value="3">Ruko</SelectItem>
                      <SelectItem value="4">Tanah</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger className="w-[180px] h-11 border-gray-200 bg-white hover:border-victoria-red transition-colors">
                      <DollarSign className="w-4 h-4 mr-2 text-victoria-red" />
                      <SelectValue placeholder="Rentang Harga" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Harga</SelectItem>
                      <SelectItem value="0-1m">Di bawah 1 M</SelectItem>
                      <SelectItem value="1-3m">1 M - 3 M</SelectItem>
                      <SelectItem value="3-5m">3 M - 5 M</SelectItem>
                      <SelectItem value="5-10m">5 M - 10 M</SelectItem>
                      <SelectItem value="10m+">Di atas 10 M</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger className="w-[160px] h-11 border-gray-200 bg-white hover:border-victoria-red transition-colors">
                      <MapPin className="w-4 h-4 mr-2 text-victoria-red" />
                      <SelectValue placeholder="Lokasi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Lokasi</SelectItem>
                      <SelectItem value="jakarta">Jakarta</SelectItem>
                      <SelectItem value="tangerang">Tangerang</SelectItem>
                      <SelectItem value="bogor">Bogor</SelectItem>
                      <SelectItem value="bekasi">Bekasi</SelectItem>
                      <SelectItem value="depok">Depok</SelectItem>
                    </SelectContent>
                  </Select>

                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-11 text-victoria-red hover:text-victoria-red hover:bg-victoria-red/10"
                      onClick={handleResetFilters}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reset ({activeFiltersCount})
                    </Button>
                  )}
                </div>

                {/* Advanced Filters Panel */}
                {showFilters && (
                  <div className="pt-6 border-t border-gray-200 animate-in slide-in-from-top-4 duration-500">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Filter className="w-5 h-5 text-victoria-navy" />
                        <h3 className="font-semibold text-victoria-navy">Filter Lanjutan</h3>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Kamar Tidur</label>
                          <Select value={bedroomsFilter} onValueChange={setBedroomsFilter}>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Pilih jumlah" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Semua</SelectItem>
                              <SelectItem value="1">1 Kamar</SelectItem>
                              <SelectItem value="2">2 Kamar</SelectItem>
                              <SelectItem value="3">3 Kamar</SelectItem>
                              <SelectItem value="4">4+ Kamar</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Kamar Mandi</label>
                          <Select value={bathroomsFilter} onValueChange={setBathroomsFilter}>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Pilih jumlah" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Semua</SelectItem>
                              <SelectItem value="1">1 Kamar Mandi</SelectItem>
                              <SelectItem value="2">2 Kamar Mandi</SelectItem>
                              <SelectItem value="3">3+ Kamar Mandi</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Luas Tanah</label>
                          <Select value={landAreaFilter} onValueChange={setLandAreaFilter}>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Pilih ukuran" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Semua Ukuran</SelectItem>
                              <SelectItem value="0-100">0 - 100 m²</SelectItem>
                              <SelectItem value="100-200">100 - 200 m²</SelectItem>
                              <SelectItem value="200-500">200 - 500 m²</SelectItem>
                              <SelectItem value="500+">500+ m²</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">&nbsp;</label>
                          <Button
                            className="w-full bg-victoria-red hover:bg-victoria-red/90 text-white h-10"
                            onClick={() => fetchProperties()}
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

          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <p className="text-gray-600">
                Menampilkan <span className="font-bold text-victoria-navy text-lg">{startIndex + 1}-{endIndex}</span> dari <span className="font-semibold text-gray-900">{displayedCount}</span> properti
              </p>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="bg-victoria-red/10 text-victoria-red border-0">
                  Terfilter
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px] border-gray-200 bg-white">
                  <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Terbaru</SelectItem>
                  <SelectItem value="price-low">Harga: Rendah ke Tinggi</SelectItem>
                  <SelectItem value="price-high">Harga: Tinggi ke Rendah</SelectItem>
                </SelectContent>
              </Select>

              <div className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`h-9 w-9 p-0 ${viewMode === 'grid'
                    ? 'bg-white text-victoria-navy shadow-sm'
                    : 'text-gray-500 hover:text-victoria-navy'
                    }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`h-9 w-9 p-0 ${viewMode === 'list'
                    ? 'bg-white text-victoria-navy shadow-sm'
                    : 'text-gray-500 hover:text-victoria-navy'
                    }`}
                >
                  <List className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Property Grid */}
          {currentProperties.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-200">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="p-4 bg-gray-100 rounded-full mb-4">
                  <HomeIcon className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Tidak ada properti yang sesuai
                </h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  Coba ubah kriteria pencarian atau filter Anda
                </p>
                <Button
                  onClick={handleResetFilters}
                  variant="outline"
                  className="border-victoria-red text-victoria-red hover:bg-victoria-red hover:text-white"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reset Semua Filter
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className={`grid gap-6 ${viewMode === 'grid'
                ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
                }`}>
                {currentProperties.map((property) => (
                  <a key={property.id} href={`/property/${property.id}`} className="block group">
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-12 gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="border-gray-200 hover:border-victoria-navy hover:text-victoria-navy disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                        ...
                      </span>
                    ) : (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => handlePageChange(page as number)}
                        className={
                          currentPage === page
                            ? 'bg-victoria-navy hover:bg-victoria-navy/90 text-white'
                            : 'border-gray-200 hover:border-victoria-navy hover:text-victoria-navy'
                        }
                      >
                        {page}
                      </Button>
                    )
                  ))}

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="border-gray-200 hover:border-victoria-navy hover:text-victoria-navy disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {totalPages > 1 && (
                <div className="text-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    Halaman <span className="font-semibold text-victoria-navy">{currentPage}</span> dari <span className="font-semibold text-victoria-navy">{totalPages}</span>
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Properties;