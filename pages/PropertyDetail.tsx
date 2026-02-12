import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Bed, Bath, Maximize, MapPin, Heart, Share2, Phone, Mail, 
  MessageCircle, Calendar, ChevronLeft, ChevronRight, Check,
  Car, Trees, Shield, Zap, Droplets, Wind
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PropertyDetail = () => {
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Mock property data
  const property = {
    id: id,
    title: 'Rumah Mewah Modern Pondok Indah',
    location: 'Jl. Metro Pondok Indah No. 123, Pondok Indah, Jakarta Selatan',
    price: 'Rp 8.5 Miliar',
    status: 'sale' as const,
    bedrooms: 5,
    bathrooms: 4,
    area: 450,
    landArea: 500,
    buildingArea: 450,
    floors: 2,
    certificate: 'SHM',
    facing: 'Timur',
    electricity: 5500,
    waterSource: 'PAM',
    yearBuilt: 2022,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200',
    ],
    description: `Rumah mewah dengan desain modern minimalis di lokasi strategis Pondok Indah. 
    
Properti ini dilengkapi dengan berbagai fasilitas premium seperti:
- Private pool dengan jacuzzi
- Smart home system
- CCTV keamanan 24 jam
- Taman tropis yang asri
- Carport untuk 4 mobil
- Ruang keluarga yang luas dengan ceiling tinggi

Lokasi sangat strategis, dekat dengan:
- Pondok Indah Mall (5 menit)
- RS Pondok Indah (10 menit)
- Tol JORR (3 menit)
- Sekolah internasional

Cocok untuk keluarga yang menginginkan hunian premium dengan akses mudah ke berbagai fasilitas.`,
    features: [
      { icon: Car, label: 'Carport 4 Mobil' },
      { icon: Trees, label: 'Taman Tropis' },
      { icon: Shield, label: 'CCTV 24 Jam' },
      { icon: Zap, label: 'Smart Home' },
      { icon: Droplets, label: 'Private Pool' },
      { icon: Wind, label: 'AC Central' },
    ],
    agent: {
      name: 'Ahmad Wijaya',
      phone: '+62 812 3456 7890',
      email: 'ahmad.wijaya@victoriaproperty.id',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      properties: 45,
      experience: '8 Tahun',
    },
  };

  const similarProperties = [
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
  ];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container-victoria">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm">
            <ol className="flex items-center gap-2 text-muted-foreground">
              <li><a href="/" className="hover:text-victoria-navy">Beranda</a></li>
              <li>/</li>
              <li><a href="/properties" className="hover:text-victoria-navy">Properti</a></li>
              <li>/</li>
              <li className="text-foreground font-medium truncate max-w-[200px]">{property.title}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Image Gallery */}
              <div className="relative rounded-xl overflow-hidden mb-6">
                <div className="aspect-[16/10] relative">
                  <img
                    src={property.images[currentImage]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Navigation Arrows */}
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-card transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-card transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="badge-sale">Dijual</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => setIsLiked(!isLiked)}
                      className="w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                      aria-label="Add to favorites"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          isLiked ? 'fill-victoria-red text-victoria-red' : 'text-muted-foreground'
                        }`}
                      />
                    </button>
                    <button
                      className="w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                      aria-label="Share property"
                    >
                      <Share2 className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-foreground/80 text-background px-3 py-1 rounded-full text-sm">
                    {currentImage + 1} / {property.images.length}
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="flex gap-2 mt-3">
                  {property.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`relative flex-1 aspect-[4/3] rounded-lg overflow-hidden ${
                        currentImage === index 
                          ? 'ring-2 ring-victoria-red' 
                          : 'opacity-70 hover:opacity-100'
                      } transition-all`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Info */}
              <div className="bg-card rounded-xl p-6 mb-6 shadow-md">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-victoria-navy mb-2">
                      {property.title}
                    </h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-5 h-5 flex-shrink-0" />
                      <span>{property.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-victoria-red">{property.price}</p>
                    <p className="text-sm text-muted-foreground">Harga Nego</p>
                  </div>
                </div>

                {/* Quick Specs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-victoria-light flex items-center justify-center">
                      <Bed className="w-6 h-6 text-victoria-navy" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{property.bedrooms}</p>
                      <p className="text-sm text-muted-foreground">Kamar Tidur</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-victoria-light flex items-center justify-center">
                      <Bath className="w-6 h-6 text-victoria-navy" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{property.bathrooms}</p>
                      <p className="text-sm text-muted-foreground">Kamar Mandi</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-victoria-light flex items-center justify-center">
                      <Maximize className="w-6 h-6 text-victoria-navy" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{property.landArea}</p>
                      <p className="text-sm text-muted-foreground">m² Tanah</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-victoria-light flex items-center justify-center">
                      <Maximize className="w-6 h-6 text-victoria-navy" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{property.buildingArea}</p>
                      <p className="text-sm text-muted-foreground">m² Bangunan</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="description" className="bg-card rounded-xl p-6 shadow-md">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="description">Deskripsi</TabsTrigger>
                  <TabsTrigger value="specs">Spesifikasi</TabsTrigger>
                  <TabsTrigger value="features">Fasilitas</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="space-y-4">
                  <div className="prose prose-sm max-w-none text-muted-foreground">
                    {property.description.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-3">{paragraph}</p>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="specs">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Luas Tanah', value: `${property.landArea} m²` },
                      { label: 'Luas Bangunan', value: `${property.buildingArea} m²` },
                      { label: 'Jumlah Lantai', value: `${property.floors} Lantai` },
                      { label: 'Sertifikat', value: property.certificate },
                      { label: 'Hadap', value: property.facing },
                      { label: 'Listrik', value: `${property.electricity} Watt` },
                      { label: 'Sumber Air', value: property.waterSource },
                      { label: 'Tahun Dibangun', value: property.yearBuilt },
                    ].map((spec, index) => (
                      <div key={index} className="flex justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">{spec.label}</span>
                        <span className="font-medium text-foreground">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="features">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-victoria-light rounded-lg">
                        <feature.icon className="w-5 h-5 text-victoria-navy" />
                        <span className="text-foreground font-medium">{feature.label}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Agent Card */}
              <div className="bg-card rounded-xl p-6 shadow-md sticky top-32">
                <h3 className="text-lg font-semibold text-foreground mb-4">Hubungi Agen</h3>
                
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={property.agent.image}
                    alt={property.agent.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{property.agent.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {property.agent.properties} Properti • {property.agent.experience}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <a
                    href={`tel:${property.agent.phone}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-victoria-light hover:bg-victoria-navy hover:text-white transition-colors group"
                  >
                    <Phone className="w-5 h-5 text-victoria-navy group-hover:text-white" />
                    <span className="font-medium">{property.agent.phone}</span>
                  </a>
                  <a
                    href={`mailto:${property.agent.email}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-victoria-light hover:bg-victoria-navy hover:text-white transition-colors group"
                  >
                    <Mail className="w-5 h-5 text-victoria-navy group-hover:text-white" />
                    <span className="font-medium text-sm">{property.agent.email}</span>
                  </a>
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp
                  </Button>
                  <Button className="w-full bg-victoria-red hover:bg-victoria-red/90 text-white">
                    <Calendar className="w-5 h-5 mr-2" />
                    Jadwalkan Kunjungan
                  </Button>
                </div>

                {/* Key Info */}
                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="font-semibold text-foreground mb-3">Informasi Penting</h4>
                  <ul className="space-y-2">
                    {[
                      'Bebas Banjir',
                      'Akses Jalan Lebar',
                      'Lingkungan Aman',
                      'Siap Huni',
                    ].map((info, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-green-600" />
                        {info}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Properties */}
          <section className="mt-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-victoria-navy">Properti Serupa</h2>
              <a href="/properties" className="text-victoria-red hover:underline font-medium">
                Lihat Semua
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((prop, index) => (
                <a key={index} href={`/property/${index + 10}`} className="block">
                  <PropertyCard {...prop} />
                </a>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetail;
