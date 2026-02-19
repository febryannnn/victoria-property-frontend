import { getPropertyById } from "@/lib/services/property.service";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    Bed,
    Bath,
    Ruler,
    Home,
    Calendar,
    MapPin,
    Zap,
    Droplet,
    Car,
    Building2,
    FileText,
    Share2,
    Heart,
    Phone,
    Mail,
    MessageCircle,
    ChevronRight,
    Check,
    Bookmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PropertyMap from "@/components/PropertyMap";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function PropertyDetail({ params }: Props) {
    const { id } = await params;

    console.log("PARAM ID:", id);

    const res = await getPropertyById(id);

    if (!res.success) {
        notFound();
    }

    const property = res.data.property;

    // Format currency
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Get property type label
    const getPropertyType = (typeId: number) => {
        const types: { [key: number]: string } = {
            1: "Rumah",
            2: "Apartemen",
            3: "Ruko",
            4: "Tanah",
            5: "Villa",
            6: "Gudang",
            7: "Gedung",
            8: "Hotel",
        };
        return types[typeId] || "Properti";
    };

    // Get water source label
    const getWaterSource = (source: string) => {
        const sources: { [key: string]: string } = {
            "1": "PAM",
            "2": "Sumur",
            "3": "Sumur Bor",
        };
        return sources[source] || source;
    };

    const features = [
        { icon: Bed, label: "Kamar Tidur", value: property.bedrooms, show: property.bedrooms > 0 },
        { icon: Bath, label: "Kamar Mandi", value: property.bathrooms, show: true },
        { icon: Ruler, label: "Luas Tanah", value: `${property.land_area} m²`, show: true },
        { icon: Home, label: "Luas Bangunan", value: `${property.building_area} m²`, show: true },
    ];

    const specifications = {
        building: [
            { icon: Building2, label: "Luas Bangunan", value: `${property.building_area} m²` },
            { icon: Ruler, label: "Luas Tanah", value: `${property.land_area} m²` },
            { icon: Home, label: "Jumlah Lantai", value: `${property.floors} Lantai` },
            { icon: Calendar, label: "Tahun Dibangun", value: property.year_constructed },
            { icon: FileText, label: "Sertifikat", value: property.certificate },
        ],
        facilities: [
            { icon: Bed, label: "Kamar Tidur", value: `${property.bedrooms} Kamar`, show: property.bedrooms > 0 },
            { icon: Bath, label: "Kamar Mandi", value: `${property.bathrooms} Kamar` },
            { icon: Car, label: "Garasi", value: `${property.garage} Mobil` },
            { icon: Car, label: "Carport", value: `${property.carport} Mobil` },
            { icon: Zap, label: "Daya Listrik", value: `${property.electricity} Watt` },
            { icon: Droplet, label: "Sumber Air", value: getWaterSource(property.water_source) },
        ].filter(item => item.show !== false)
    };

    // Get coordinates for the property
    const mapCenter = {
        lat: property.latitude,
        lng: property.longitude,
    };

    return (
        <div className="min-h-screen bg-victoria-light">
            <Navbar />

            <main className="pt-28 pb-20">
                {/* Breadcrumb */}
                <div className="container-victoria mb-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <a href="/" className="hover:text-victoria-red transition-colors">
                            Beranda
                        </a>
                        <ChevronRight className="w-4 h-4" />
                        <a href="/properties" className="hover:text-victoria-red transition-colors">
                            Properti
                        </a>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-foreground font-medium">{property.title}</span>
                    </div>
                </div>

                <div className="container-victoria">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Property Header */}
                            <Card className="overflow-hidden">
                                <CardHeader className="space-y-4">
                                    {/* Badges */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge className="bg-victoria-red hover:bg-victoria-maroon text-white">
                                            {property.sale_type === "jual" ? "Dijual" : "Disewa"}
                                        </Badge>
                                        <Badge variant="secondary">
                                            {getPropertyType(property.property_type_id)}
                                        </Badge>
                                        {property.status === 1 && (
                                            <Badge className="bg-green-500 hover:bg-green-600 text-white">
                                                <Check className="w-3 h-3 mr-1" />
                                                Tersedia
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <div>
                                        <h1 className="text-3xl md:text-4xl font-bold text-victoria-navy mb-3">
                                            {property.title}
                                        </h1>
                                        <div className="flex items-start gap-2 text-muted-foreground">
                                            <MapPin className="w-5 h-5 text-victoria-red flex-shrink-0 mt-0.5" />
                                            <span className="text-base">
                                                {property.address}, {property.district}, {property.regency}, {property.province}
                                            </span>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    {/* Main Image */}
                                    <div className="relative rounded-xl overflow-hidden group">
                                        <img
                                            src={`http://localhost:8080${property.cover_image_url}`}
                                            alt={property.title}
                                            className="w-full h-[400px] md:h-[500px] object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        {/* Action Buttons */}
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <Button size="icon" variant="secondary" className="rounded-full backdrop-blur-sm bg-white/90 hover:bg-white">
                                                <Share2 className="w-4 h-4" />
                                            </Button>
                                            <Button size="icon" variant="secondary" className="rounded-full backdrop-blur-sm bg-white/90 hover:bg-white">
                                                <Heart className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Price Section */}
                                    <Card className="bg-gradient-to-br from-victoria-red via-victoria-muted-red to-victoria-maroon text-white border-0">
                                        <CardContent className="p-6">
                                            <div className="flex items-end justify-between">
                                                <div>
                                                    <p className="text-white/90 text-sm font-medium mb-1">Harga Properti</p>
                                                    <p className="text-4xl md:text-5xl font-bold tracking-tight">
                                                        {formatPrice(property.price)}
                                                    </p>
                                                </div>
                                                <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 text-sm px-3 py-1">
                                                    Nego
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Key Features Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {features.filter(f => f.show !== false).map((feature, idx) => {
                                            const Icon = feature.icon;
                                            return (
                                                <Card key={idx} className="group hover:shadow-lg hover:border-victoria-red transition-all duration-300">
                                                    <CardContent className="p-4 text-center">
                                                        <Icon className="w-7 h-7 text-victoria-red mx-auto mb-2 group-hover:scale-110 transition-transform" />
                                                        <p className="text-2xl font-bold text-victoria-navy">{feature.value}</p>
                                                        <p className="text-xs text-muted-foreground mt-1">{feature.label}</p>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Description */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3 text-victoria-navy">
                                        <div className="w-1 h-7 bg-victoria-red rounded-full" />
                                        Deskripsi Properti
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {property.description}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Specifications */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3 text-victoria-navy">
                                        <div className="w-1 h-7 bg-victoria-red rounded-full" />
                                        Spesifikasi Detail
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Building Info */}
                                        <div className="space-y-4">
                                            <h3 className="font-semibold text-victoria-navy pb-2 border-b">
                                                Informasi Bangunan
                                            </h3>
                                            <div className="space-y-3">
                                                {specifications.building.map((spec, idx) => {
                                                    const Icon = spec.icon;
                                                    return (
                                                        <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-victoria-light transition-colors">
                                                            <div className="flex-shrink-0 w-8 h-8 bg-victoria-pastel-red/20 rounded-lg flex items-center justify-center">
                                                                <Icon className="w-4 h-4 text-victoria-red" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-sm text-muted-foreground">{spec.label}</p>
                                                                <p className="font-semibold text-victoria-navy">{spec.value}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Facilities */}
                                        <div className="space-y-4">
                                            <h3 className="font-semibold text-victoria-navy pb-2 border-b">
                                                Fasilitas
                                            </h3>
                                            <div className="space-y-3">
                                                {specifications.facilities.map((spec, idx) => {
                                                    const Icon = spec.icon;
                                                    return (
                                                        <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-victoria-light transition-colors">
                                                            <div className="flex-shrink-0 w-8 h-8 bg-victoria-pastel-red/20 rounded-lg flex items-center justify-center">
                                                                <Icon className="w-4 h-4 text-victoria-red" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-sm text-muted-foreground">{spec.label}</p>
                                                                <p className="font-semibold text-victoria-navy">{spec.value}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Location with Interactive Map */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3 text-victoria-navy">
                                        <div className="w-1 h-7 bg-victoria-red rounded-full" />
                                        Lokasi Properti
                                    </CardTitle>
                                    <CardDescription>
                                        {property.address}, {property.district}, {property.regency}, {property.province}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {/* Interactive Map Component */}
                                    <PropertyMap
                                        center={mapCenter}
                                        address={`${property.address}, ${property.district}, ${property.regency}`}
                                        propertyTitle={property.title}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-28 space-y-6">
                                {/* Contact Agent Card */}
                                <Card className="overflow-hidden border-2 border-victoria-red/20">
                                    <CardHeader className="bg-gradient-to-br from-victoria-navy to-victoria-maroon text-white">
                                        <CardTitle className="text-xl">Hubungi Agen</CardTitle>
                                        <CardDescription className="text-white/80">
                                            Dapatkan informasi lengkap tentang properti ini
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-3">
                                        <Button className="w-full h-11 bg-victoria-red hover:bg-victoria-maroon">
                                            <Phone className="w-4 h-4 mr-2" />
                                            Telepon Sekarang
                                        </Button>
                                        <Button variant="outline" className="w-full h-11 border-2 border-victoria-red text-victoria-red hover:bg-victoria-red hover:text-white">
                                            <MessageCircle className="w-4 h-4 mr-2" />
                                            WhatsApp
                                        </Button>
                                        <Button variant="outline" className="w-full h-11">
                                            <Mail className="w-4 h-4 mr-2" />
                                            Email
                                        </Button>
                                        <Button variant="outline" className="w-full h-11">
                                            <Bookmark className="w-4 h-4 mr-2" />
                                            Tambah ke Favorit
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Property Info Card */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg text-victoria-navy">Informasi Properti</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm text-muted-foreground">ID Properti</span>
                                            <span className="font-semibold text-victoria-navy">#{property.id}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm text-muted-foreground">Tipe</span>
                                            <span className="font-semibold text-victoria-navy">
                                                {getPropertyType(property.property_type_id)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b">
                                            <span className="text-sm text-muted-foreground">Status</span>
                                            <Badge variant="secondary">
                                                {property.sale_type === "jual" ? "Dijual" : "Disewa"}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-sm text-muted-foreground">Dipublikasi</span>
                                            <span className="text-sm font-medium text-victoria-navy">
                                                {formatDate(property.created_at)}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Share Card */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg text-victoria-navy">Bagikan Properti</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-3 gap-3">
                                            <Button size="icon" className="h-12 bg-blue-500 hover:bg-blue-600">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                </svg>
                                            </Button>
                                            <Button size="icon" className="h-12 bg-green-500 hover:bg-green-600">
                                                <MessageCircle className="w-5 h-5" />
                                            </Button>
                                            <Button size="icon" className="h-12 bg-slate-700 hover:bg-slate-800">
                                                <Share2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}