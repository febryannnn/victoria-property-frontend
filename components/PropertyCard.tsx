"use client";

import { Bed, Bath, Maximize, MapPin, Heart } from 'lucide-react';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PropertyCardProps {
  id: number; 
  image: string;
  title: string;
  location: string;
  price: string;
  priceLabel?: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  status: 'sale' | 'rent' | 'hot';
  isNew?: boolean;
  initialLiked?: boolean; // tambah ini, untuk set state awal dari halaman favorites
}

const PropertyCard = ({
  id,
  image,
  title,
  location,
  price,
  priceLabel = '',
  bedrooms,
  bathrooms,
  area,
  status,
  isNew = false,
  initialLiked = false,
}: PropertyCardProps) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();  // Mencegah navigasi Link
    e.stopPropagation(); // Mencegah event bubble ke parent
    
    const token = localStorage.getItem("token");
    if(!token){
      window.location.href = "/login";
      return;
    }

    // Tampilkan dialog konfirmasi
    setShowConfirm(true);
  };

  const handleConfirmFavorite = async () => {
    const token = localStorage.getItem("token");
    const method = isLiked ? "DELETE" : "POST";

    try {
      const res = await fetch(`http://localhost:8080/api/properties/${id}/favorite`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setIsLiked(!isLiked); // toggle setelah berhasil
      }
    } catch (err) {
      console.error("Gagal update favorit:", err);
    } finally {
      setShowConfirm(false);
    }
  };

  const statusStyles = {
    sale: 'badge-sale',
    rent: 'badge-rent',
    hot: 'badge-hot',
  };

  const statusText = {
    sale: 'Dijual',
    rent: 'Disewa',
    hot: 'Hot Deal',
  };

  return (
    <>
      <article className="card-property group">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            <span className={`${statusStyles[status]} text-xs px-2 py-0.5`}>{statusText[status]}</span>
            {isNew && (
              <span className="badge-status bg-victoria-yellow text-victoria-navy text-xs px-2 py-0.5">Baru</span>
            )}
          </div>

          {/* ✅ Favorite Button — dengan konfirmasi */}
          <button
            onClick={handleHeartClick}
            className="absolute top-2 right-2 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer z-10"
            aria-label="Add to favorites"
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                isLiked ? 'fill-victoria-red text-victoria-red' : 'text-muted-foreground'
              }`}
            />
          </button>
        </div>

        <div className="p-2.5 sm:p-4">
          <div className="mb-1.5 sm:mb-2">
            <span className="text-base sm:text-xl font-bold text-victoria-red">{price}</span>
            {priceLabel && (
              <span className="text-xs text-muted-foreground ml-1">{priceLabel}</span>
            )}
          </div>
          <h3 className="font-semibold text-xs sm:text-base text-foreground mb-1 sm:mb-1.5 line-clamp-1 group-hover:text-victoria-navy transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-1 text-muted-foreground mb-2 sm:mb-3">
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
            <span className="text-xs line-clamp-1">{location}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 pt-2 sm:pt-3 border-t border-border">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Bed className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="text-xs font-medium">{bedrooms}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Bath className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="text-xs font-medium">{bathrooms}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Maximize className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="text-xs font-medium">{area}m²</span>
            </div>
          </div>
        </div>
      </article>

      {/* Animated Confirmation Dialog with Fade-in */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent 
          onClick={(e) => e.stopPropagation()}
          className="overflow-hidden animate-[dialogFadeIn_1s_ease-out]"
        >
          {/* Animated Background Decoration */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-victoria-red/10 rounded-full blur-3xl animate-[fadeInScale_0.6s_ease-out]" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-victoria-red/5 rounded-full blur-2xl animate-[fadeInScale_0.8s_ease-out]" />
          
          <AlertDialogHeader className="relative animate-[slideUp_0.5s_ease-out]">
            {/* Animated Heart Icon */}
            <div className="flex justify-center mb-4">
              <div className={`
                relative p-4 rounded-full 
                ${isLiked ? 'bg-muted' : 'bg-victoria-red/10'}
                animate-[popIn_0.5s_cubic-bezier(0.68,-0.55,0.265,1.55)]
              `}>
                <Heart 
                  className={`
                    w-10 h-10 transition-all duration-300
                    ${isLiked 
                      ? 'text-muted-foreground' 
                      : 'text-victoria-red fill-victoria-red animate-[heartbeat_1.2s_ease-in-out_infinite]'
                    }
                  `} 
                />
                {!isLiked && (
                  <>
                    <span className="absolute inset-0 rounded-full bg-victoria-red/20 animate-ping" />
                    <span className="absolute inset-2 rounded-full bg-victoria-red/10 animate-ping delay-150" />
                  </>
                )}
              </div>
            </div>
            
            <AlertDialogTitle className="text-center text-xl">
              {isLiked ? 'Hapus dari Favorit?' : 'Tambah ke Favorit?'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              {isLiked 
                ? <>Apakah Anda yakin ingin menghapus <strong className="font-semibold text-foreground">{title}</strong> dari daftar favorit Anda?</>
                : <>Properti <strong className="font-semibold text-foreground">{title}</strong> akan ditambahkan ke halaman Favorit Anda. Anda dapat mengakses properti favorit kapan saja dari ikon ❤️ di navbar.</>
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <AlertDialogFooter className="sm:justify-center gap-3 mt-2">
            <AlertDialogCancel 
              onClick={(e) => e.stopPropagation()}
              className="sm:w-32 transition-all duration-200 hover:scale-105"
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.stopPropagation();
                handleConfirmFavorite();
              }}
              className={`
                sm:w-32 transition-all duration-200 hover:scale-105 
                ${isLiked 
                  ? 'bg-muted-foreground hover:bg-muted-foreground/90' 
                  : 'bg-victoria-red hover:bg-victoria-red/90 hover:shadow-lg hover:shadow-victoria-red/25'
                }
              `}
            >
              {isLiked ? 'Ya, Hapus' : 'Ya, Tambahkan'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PropertyCard;