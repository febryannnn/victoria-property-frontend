import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Property } from "@/lib/types/property";
import {
    Edit,
    MapPin,
    Bed,
    Bath,
    Image as ImageIcon,
    Maximize2,
    Calendar,
    Eye
} from "lucide-react";

interface PropertyCardProps {
    property: Property;
    onEdit: (property: Property) => void;
}

export default function PropertyAdminCard({ property, onEdit }: PropertyCardProps) {
    const formatPrice = (price: string) => {
        const numPrice = parseFloat(price);
        if (numPrice >= 1000000000) {
            return `Rp ${(numPrice / 1000000000).toFixed(1)}M`;
        } else if (numPrice >= 1000000) {
            return `Rp ${(numPrice / 1000000).toFixed(1)}jt`;
        }
        return `Rp ${numPrice.toLocaleString('id-ID')}`;
    };

    return (
        <Card className="group relative overflow-hidden rounded-2xl border-0 shadow-md hover:shadow-2xl transition-all duration-500 bg-white">
            {/* Status Badge - Floating */}
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10 flex gap-1.5 sm:gap-2">
                <Badge
                    className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 ${property.status === 1
                        ? "bg-emerald-500/90 hover:bg-emerald-500 text-white border-0"
                        : "bg-gray-500/90 hover:bg-gray-500 text-white border-0"
                        } backdrop-blur-sm shadow-lg`}
                >
                    {property.status === 1 ? "Active" : "Inactive"}
                </Badge>
                <Badge
                    className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-[#5B0F1A]/90 hover:bg-[#5B0F1A] text-white border-0 backdrop-blur-sm shadow-lg capitalize"
                >
                    {property.sale_type}
                </Badge>
            </div>

            {/* Property Image */}
            <div className="relative h-40 sm:h-48 md:h-52 lg:h-56 overflow-hidden">
                {property.cover_image_url ? (
                    <>
                        <img
                            src={property.cover_image_url}
                            alt={property.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Quick View Button on Hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <Button
                                size="sm"
                                className="bg-white/90 hover:bg-white text-[#5B0F1A] backdrop-blur-sm shadow-lg text-xs sm:text-sm"
                            >
                                <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                                Quick View
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <ImageIcon size={40} className="text-gray-300" />
                    </div>
                )}
            </div>

            <CardContent className="p-3 sm:p-4 lg:p-5 space-y-3 sm:space-y-4">
                {/* Title & Location */}
                <div className="space-y-1.5">
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-[#5B0F1A] transition-colors">
                        {property.title}
                    </h3>
                    <div className="flex items-start gap-1.5 text-xs sm:text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mt-0.5 flex-shrink-0 text-[#5B0F1A]" />
                        <span className="line-clamp-1">
                            {property.district}, {property.regency}
                        </span>
                    </div>
                </div>

                {/* Property Features */}
                <div className="flex items-center gap-2 sm:gap-4 pb-3 sm:pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-gray-600">
                        <div className="p-1 sm:p-1.5 bg-blue-50 rounded-md">
                            <Bed className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                        </div>
                        <span className="font-medium">{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-gray-600">
                        <div className="p-1 sm:p-1.5 bg-purple-50 rounded-md">
                            <Bath className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                        </div>
                        <span className="font-medium">{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-gray-600">
                        <div className="p-1 sm:p-1.5 bg-amber-50 rounded-md">
                            <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600" />
                        </div>
                        <span className="font-medium">{property.building_area}m²</span>
                    </div>
                </div>

                {/* Price & Action */}
                <div className="flex items-end justify-between pt-1">
                    <div className="space-y-0.5 min-w-0">
                        <p className="text-xs text-muted-foreground font-medium">Price</p>
                        <p className="text-base sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-[#5B0F1A] to-[#8B1526] bg-clip-text text-transparent truncate">
                            Rp {property.price.toLocaleString("id-ID")}
                        </p>
                    </div>
                    <Button
                        onClick={() => onEdit(property)}
                        size="sm"
                        className="bg-[#5B0F1A] hover:bg-[#7A1424] text-white shadow-md hover:shadow-lg transition-all text-xs sm:text-sm h-8 sm:h-9 shrink-0 ml-2"
                    >
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Edit
                    </Button>
                </div>

                {/* Additional Info */}
                {property.year_constructed && (
                    <div className="flex items-center gap-1.5 pt-1.5 text-xs text-muted-foreground border-t border-gray-100">
                        <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span>Built in {property.year_constructed}</span>
                    </div>
                )}
            </CardContent>

            {/* Decorative Corner Accent */}
            <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Card>
    );
}