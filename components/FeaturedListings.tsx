"use client";

import { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getAllProperties } from "@/lib/services/property.service";

const FeaturedListings = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);


  async function fetchProperties() {
    try {
      const res = await getAllProperties(1, 9);
      console.log(res)

      const mapped = res.data.map((item: any) => ({
        id: item.id,
        image: `${process.env.NEXT_PUBLIC_API_URL}/${item.cover_image_url}`,
        title: item.title,
        location: `${item.district}, ${item.regency}`,
        price: formatRupiah(item.price),
        bedrooms: item.bedrooms,
        bathrooms: item.bathrooms,
        area: item.building_area,
        status: item.sale_type === "jual" ? "sale" : "rent",
      }));

      setProperties(mapped);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function formatRupiah(price: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  }

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

        {/* Loading */}
        {loading && (
          <div className="text-center py-20 text-muted-foreground">
            Loading properties...
          </div>
        )}

        {/* Property Grid */}
        {!loading && (
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
        )}

        {/* View More Button */}
        <div className="flex justify-center mt-12">
          <Button
            asChild
            className="bg-victoria-red 
            hover:bg-victoria-red/90 
            text-white 
            gap-2 
            px-8 
            transition-all 
            duration-300 
            ease-out 
            hover:scale-105 
            hover:shadow-[0_10px_25px_-5px_hsl(var(--victoria-red)/0.4)]"
          >
            <Link href="/properties" className="flex items-center gap-2 group">
              View More Properties
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;