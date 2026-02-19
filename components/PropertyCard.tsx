import { Bed, Bath, Maximize, MapPin, Heart } from 'lucide-react';
import { useState } from 'react';

interface PropertyCardProps {
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
}

const PropertyCard = ({
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
}: PropertyCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

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
    <article className="card-property group">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          <span className={`${statusStyles[status]} text-xs px-2 py-0.5`}>{statusText[status]}</span>
          {isNew && (
            <span className="badge-status bg-victoria-yellow text-victoria-navy text-xs px-2 py-0.5">Baru</span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-2 right-2 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          aria-label="Add to favorites"
        >
          <Heart
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${isLiked ? 'fill-victoria-red text-victoria-red' : 'text-muted-foreground'
              }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-2.5 sm:p-4">
        {/* Price */}
        <div className="mb-1.5 sm:mb-2">
          <span className="text-base sm:text-xl font-bold text-victoria-red">{price}</span>
          {priceLabel && (
            <span className="text-xs text-muted-foreground ml-1">{priceLabel}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-xs sm:text-base text-foreground mb-1 sm:mb-1.5 line-clamp-1 group-hover:text-victoria-navy transition-colors">
          {title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-muted-foreground mb-2 sm:mb-3">
          <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
          <span className="text-xs line-clamp-1">{location}</span>
        </div>

        {/* Features */}
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
  );
};

export default PropertyCard;