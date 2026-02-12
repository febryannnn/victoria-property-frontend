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
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={statusStyles[status]}>{statusText[status]}</span>
          {isNew && (
            <span className="badge-status bg-victoria-yellow text-victoria-navy">Baru</span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          aria-label="Add to favorites"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isLiked ? 'fill-victoria-red text-victoria-red' : 'text-muted-foreground'
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Price */}
        <div className="mb-3">
          <span className="text-2xl font-bold text-victoria-red">{price}</span>
          {priceLabel && (
            <span className="text-sm text-muted-foreground ml-1">{priceLabel}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-1 group-hover:text-victoria-navy transition-colors">
          {title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-muted-foreground mb-4">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm line-clamp-1">{location}</span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 pt-4 border-t border-border">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Bed className="w-4 h-4" />
            <span className="text-sm font-medium">{bedrooms}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Bath className="w-4 h-4" />
            <span className="text-sm font-medium">{bathrooms}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Maximize className="w-4 h-4" />
            <span className="text-sm font-medium">{area} m²</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PropertyCard;
