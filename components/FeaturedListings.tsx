import PropertyCard from "./PropertyCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Property images - mock data
const properties = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=60",
    title: "Rumah Mewah Modern di BSD City",
    location: "BSD City, Tangerang Selatan",
    price: "Rp 3,5 M",
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    status: "sale" as const,
    isNew: true,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60",
    title: "Villa Cantik dengan Kolam Renang",
    location: "Sentul City, Bogor",
    price: "Rp 5,8 M",
    bedrooms: 5,
    bathrooms: 4,
    area: 400,
    status: "hot" as const,
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=60",
    title: "Apartemen Premium Sudirman",
    location: "Sudirman, Jakarta Pusat",
    price: "Rp 25 Jt",
    priceLabel: "/bulan",
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    status: "rent" as const,
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop&q=60",
    title: "Rumah Cluster Minimalis",
    location: "Alam Sutera, Tangerang",
    price: "Rp 2,1 M",
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    status: "sale" as const,
    isNew: true,
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop&q=60",
    title: "Ruko Strategis Kawasan Bisnis",
    location: "PIK, Jakarta Utara",
    price: "Rp 8,5 M",
    bedrooms: 0,
    bathrooms: 2,
    area: 300,
    status: "sale" as const,
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&auto=format&fit=crop&q=60",
    title: "Townhouse Modern di Kemang",
    location: "Kemang, Jakarta Selatan",
    price: "Rp 4,2 M",
    bedrooms: 4,
    bathrooms: 3,
    area: 200,
    status: "hot" as const,
  },
];

const FeaturedListings = () => {
  return (
    <section className="section-padding bg-victoria-light">
      <div className="container-victoria">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-victoria-red/10 rounded-full px-4 py-1.5 mb-4">
              <span className="w-2 h-2 bg-victoria-red rounded-full" />
              <span className="text-victoria-red text-sm font-semibold">
                Properti Pilihan
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-victoria-navy mb-2">
              Listing Unggulan
            </h2>
            <p className="text-muted-foreground text-lg">
              Koleksi properti terbaik yang kami rekomendasikan untuk Anda
            </p>
          </div>

          {/* Button + Next Link */}
          <Button
            asChild
            variant="outline"
            className="border-victoria-navy text-victoria-navy hover:bg-victoria-navy hover:text-primary-foreground gap-2 w-fit"
          >
            <Link href="/properties">
              Lihat Semua
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {properties.map((property, index) => (
            <div
              key={property.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <PropertyCard {...property} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;