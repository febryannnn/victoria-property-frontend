"use client";

import { useEffect, useState, useRef } from "react";
import PropertyCard from "../PropertyCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getAllProperties } from "@/lib/services/property.service";
import { getUserFavoriteIds } from "@/lib/services/favorites.service";

const FeaturedListings = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const header = entry.target.querySelector(".fl-header");
            if (header) header.classList.add("fl-in");

            const cards = entry.target.querySelectorAll(".fl-card");
            cards.forEach((card, i) => {
              setTimeout(() => card.classList.add("fl-in"), i * 80);
            });

            const btn = entry.target.querySelector(".fl-btn");
            if (btn) setTimeout(() => btn.classList.add("fl-in"), cards.length * 80 + 100);

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [loading]);

  async function fetchData() {
    try {
      // Fetch properties dan favorites secara paralel
      const [propertiesRes, userFavoriteIds] = await Promise.all([
        getAllProperties(1, 9),
        getUserFavoriteIds(),
      ]);

      // Handle berbagai kemungkinan struktur response
      const propertyData = propertiesRes.data?.property || propertiesRes.data || [];
      
      const mapped = propertyData.map((item: any) => ({
        id: item.id,
        image: `http://localhost:8080${item.cover_image_url}`,
        title: item.title,
        location: `${item.district}, ${item.regency}`,
        price: formatRupiah(item.price),
        bedrooms: item.bedrooms,
        bathrooms: item.bathrooms,
        area: item.building_area,
        status: item.sale_type === "jual" ? "sale" : "rent",
      }));

      setProperties(mapped);
      setFavoriteIds(userFavoriteIds);
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
    <>
      <style>{`
        .fl-header {
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1),
                      transform 0.7s cubic-bezier(0.22,1,0.36,1);
        }
        .fl-header.fl-in { opacity: 1; transform: translateY(0); }

        .fl-card {
          opacity: 0; transform: translateY(36px) scale(0.97);
          transition: opacity 0.6s cubic-bezier(0.22,1,0.36,1),
                      transform 0.6s cubic-bezier(0.22,1,0.36,1);
        }
        .fl-card.fl-in { opacity: 1; transform: translateY(0) scale(1); }

        .fl-btn {
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.6s cubic-bezier(0.22,1,0.36,1),
                      transform 0.6s cubic-bezier(0.22,1,0.36,1);
        }
        .fl-btn.fl-in { opacity: 1; transform: translateY(0); }

        /* Badge dot pulse */
        @keyframes fl-dot-pulse {
          0%, 100% { box-shadow: 0 0 0 0   hsl(0 70% 37% / 0.5); }
          50%       { box-shadow: 0 0 0 5px hsl(0 70% 37% / 0);   }
        }
        .fl-dot { animation: fl-dot-pulse 2.2s ease-in-out infinite; }
      `}</style>

      <section ref={sectionRef} className="section-padding bg-victoria-light">
        <div className="container-victoria">

          {/* Header */}
          <div className="fl-header flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 bg-victoria-red/10 rounded-full px-4 py-1.5 mb-4">
                <span className="fl-dot w-2 h-2 bg-victoria-red rounded-full" />
                <span className="text-victoria-red text-sm font-semibold">Properti Pilihan</span>
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
              {/* <Link href="/properties">Lihat Semua <ArrowRight className="w-4 h-4" /></Link> */}
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
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
              {properties.map((property) => (
                <Link key={property.id} href={`/property/${property.id}`} className="block fl-card">
                  <PropertyCard 
                    {...property} 
                    initialLiked={favoriteIds.includes(property.id)}
                  />
                </Link>
              ))}
            </div>
          )}

          {/* View More Button */}
          <div className="fl-btn flex justify-center mt-12">
            <Button
              asChild
              className="bg-victoria-red 
                hover:bg-victoria-red/90 
                text-white gap-2 px-8 
                transition-all duration-300 ease-out 
                hover:scale-105 
                hover:shadow-[0_10px_25px_-5px_hsl(var(--victoria-red)/0.4)]"
            >
              <Link href="/properties" className="flex items-center gap-2 group">
                Lihat Semua Properti
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

        </div>
      </section>
    </>
  );
};

export default FeaturedListings;