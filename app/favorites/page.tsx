// app/favorites/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserFavorites, FavoriteProperty } from "@/lib/services/favorites.service";
import PropertyCard from "@/components/PropertyCard";
import { Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Helper format harga
const formatPrice = (price: number) => {
  if (price >= 1_000_000_000) return `Rp ${(price / 1_000_000_000).toFixed(1)} M`;
  if (price >= 1_000_000) return `Rp ${(price / 1_000_000).toFixed(0)} Jt`;
  return `Rp ${price.toLocaleString("id-ID")}`;
};

// Map status number ke string
const mapStatus = (status: number): "sale" | "rent" | "hot" => {
  if (status === 2) return "rent";
  if (status === 3) return "hot";
  return "sale";
};
const API_URL = "https://vp-backend-production-2fef.up.railway.app";


export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/login");
          return;
        }

        const data = await getUserFavorites();
        console.log("Data favorit yang diterima:", data);
        setFavorites(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <main className="container-victoria pt-32 pb-16 min-h-screen">
        <p className="text-center text-muted-foreground">Memuat favorit...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container-victoria pt-32 pb-16 min-h-screen">
        <p className="text-center text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container-victoria pt-32 pb-16 min-h-screen">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-victoria-navy flex items-center gap-2 mt-4">
            <Heart className="fill-victoria-red text-victoria-red w-7 h-7" />
            Properti Favorit Saya
          </h1>
          <p className="text-muted-foreground mt-1">{favorites.length} properti tersimpan</p>
        </div>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <Heart className="w-16 h-16 text-muted-foreground/30" />
            <p className="text-lg font-medium text-muted-foreground">Belum ada properti favorit</p>
            <p className="text-sm text-muted-foreground">Tekan ikon hati pada properti untuk menyimpannya di sini</p>
            <button
              onClick={() => router.push("/properties")}
              className="mt-2 px-6 py-2 bg-victoria-red text-white rounded-md hover:bg-victoria-red/90 transition-colors"
            >
              Jelajahi Properti
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {favorites.map((property) => (
              <a key={property.id} href={`/property/${property.id}`} className="block group">
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  image={`${API_URL}${property.cover_image_url || "/placeholder.jpg"}`}
                  title={property.title}
                  location={`${property.district}, ${property.regency}`}
                  price={formatPrice(property.price)}
                  bedrooms={property.bedrooms}
                  bathrooms={property.bathrooms}
                  area={property.building_area}
                  status={mapStatus(property.status)}
                  initialLiked={true}
                />
              </a>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}