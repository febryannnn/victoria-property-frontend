import { useState } from 'react';
import { Search, SlidersHorizontal, Grid3X3, List, ChevronDown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Properties = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const properties = [
    {
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      title: 'Rumah Mewah Modern Pondok Indah',
      location: 'Pondok Indah, Jakarta Selatan',
      price: 'Rp 8.5 M',
      bedrooms: 5,
      bathrooms: 4,
      area: 450,
      status: 'sale' as const,
      isNew: true,
    },
    {
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      title: 'Apartemen Premium BSD City',
      location: 'BSD City, Tangerang Selatan',
      price: 'Rp 25 Jt',
      priceLabel: '/bulan',
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      status: 'rent' as const,
    },
    {
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      title: 'Cluster Eksklusif Sentul City',
      location: 'Sentul City, Bogor',
      price: 'Rp 3.2 M',
      bedrooms: 4,
      bathrooms: 3,
      area: 280,
      status: 'hot' as const,
      isNew: true,
    },
    {
      image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
      title: 'Townhouse Minimalis Bintaro',
      location: 'Bintaro Jaya, Tangerang Selatan',
      price: 'Rp 2.8 M',
      bedrooms: 3,
      bathrooms: 2,
      area: 200,
      status: 'sale' as const,
    },
    {
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
      title: 'Vila Resort Puncak Bogor',
      location: 'Puncak, Bogor',
      price: 'Rp 5.5 M',
      bedrooms: 6,
      bathrooms: 5,
      area: 600,
      status: 'sale' as const,
    },
    {
      image: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800',
      title: 'Apartemen Studio Kemang',
      location: 'Kemang, Jakarta Selatan',
      price: 'Rp 12 Jt',
      priceLabel: '/bulan',
      bedrooms: 1,
      bathrooms: 1,
      area: 45,
      status: 'rent' as const,
    },
    {
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      title: 'Rumah Klasik Menteng',
      location: 'Menteng, Jakarta Pusat',
      price: 'Rp 15 M',
      bedrooms: 7,
      bathrooms: 5,
      area: 800,
      status: 'sale' as const,
    },
    {
      image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
      title: 'Ruko Strategis PIK',
      location: 'Pantai Indah Kapuk, Jakarta Utara',
      price: 'Rp 6.5 M',
      bedrooms: 0,
      bathrooms: 2,
      area: 350,
      status: 'hot' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container-victoria">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-victoria-navy mb-2">
              Daftar Properti
            </h1>
            <p className="text-muted-foreground">
              Temukan properti impian Anda dari {properties.length} listing tersedia
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-card rounded-xl p-4 md:p-6 mb-8 shadow-md">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan lokasi, nama properti..."
                  className="input-search pl-12"
                />
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-3">
                <Select>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Tipe Properti" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tipe</SelectItem>
                    <SelectItem value="house">Rumah</SelectItem>
                    <SelectItem value="apartment">Apartemen</SelectItem>
                    <SelectItem value="shophouse">Ruko</SelectItem>
                    <SelectItem value="land">Tanah</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="sale">Dijual</SelectItem>
                    <SelectItem value="rent">Disewa</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-[160px]">
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

                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filter Lanjutan
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-border animate-fade-in">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Kamar Tidur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Kamar</SelectItem>
                      <SelectItem value="2">2 Kamar</SelectItem>
                      <SelectItem value="3">3 Kamar</SelectItem>
                      <SelectItem value="4">4+ Kamar</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Kamar Mandi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Kamar Mandi</SelectItem>
                      <SelectItem value="2">2 Kamar Mandi</SelectItem>
                      <SelectItem value="3">3+ Kamar Mandi</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Luas Tanah" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-100">0 - 100 m²</SelectItem>
                      <SelectItem value="100-200">100 - 200 m²</SelectItem>
                      <SelectItem value="200-500">200 - 500 m²</SelectItem>
                      <SelectItem value="500+">500+ m²</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Lokasi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jakarta">Jakarta</SelectItem>
                      <SelectItem value="tangerang">Tangerang</SelectItem>
                      <SelectItem value="bogor">Bogor</SelectItem>
                      <SelectItem value="bekasi">Bekasi</SelectItem>
                      <SelectItem value="depok">Depok</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button className="bg-victoria-red hover:bg-victoria-red/90 text-white col-span-2">
                    Terapkan Filter
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <p className="text-muted-foreground">
              Menampilkan <span className="font-semibold text-foreground">{properties.length}</span> properti
            </p>
            
            <div className="flex items-center gap-4">
              <Select defaultValue="newest">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Terbaru</SelectItem>
                  <SelectItem value="price-low">Harga: Rendah ke Tinggi</SelectItem>
                  <SelectItem value="price-high">Harga: Tinggi ke Rendah</SelectItem>
                  <SelectItem value="popular">Paling Populer</SelectItem>
                </SelectContent>
              </Select>

              <div className="hidden sm:flex items-center gap-1 bg-muted rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-card text-victoria-navy shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-card text-victoria-navy shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  aria-label="List view"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Property Grid */}
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {properties.map((property, index) => (
              <a key={index} href={`/property/${index + 1}`} className="block">
                <PropertyCard {...property} />
              </a>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2">
              <Button variant="outline" disabled>
                Sebelumnya
              </Button>
              {[1, 2, 3, 4, 5].map((page) => (
                <Button
                  key={page}
                  variant={page === 1 ? 'default' : 'outline'}
                  className={page === 1 ? 'bg-victoria-navy hover:bg-victoria-navy/90' : ''}
                  size="icon"
                >
                  {page}
                </Button>
              ))}
              <Button variant="outline">
                Selanjutnya
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Properties;
