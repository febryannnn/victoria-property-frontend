import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Property } from "@/lib/types/property";
import { Edit, MapPin, Home, Bed, Bath, Image as ImageIcon } from "lucide-react";

interface PropertyCardProps {
    property: Property;
    onEdit: (property: Property) => void;
}

export default function PropertyCard({ property, onEdit }: PropertyCardProps) {
    return (
        <Card className="rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition overflow-hidden">
            {/* Property Image */}
            {property.cover_image_url ? (
                <div className="w-full h-48 overflow-hidden">
                    <img
                        src={property.cover_image_url}
                        alt={property.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                </div>
            ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                    <ImageIcon size={48} className="text-gray-300" />
                </div>
            )}

            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#1F2937] mb-2">
                            {property.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <MapPin size={16} />
                            <span>
                                {property.district}, {property.regency}, {property.province}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {property.description}
                        </p>
                    </div>
                    <Button
                        onClick={() => onEdit(property)}
                        variant="outline"
                        size="sm"
                        className="ml-4"
                    >
                        <Edit size={16} className="mr-2" />
                        Edit
                    </Button>
                </div>

                <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                        <Home size={16} />
                        <span>{property.building_area}m²</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Bed size={16} />
                        <span>{property.bedrooms} Bed</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Bath size={16} />
                        <span>{property.bathrooms} Bath</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                        <p className="text-2xl font-bold text-[#5B0F1A]">
                            Rp {property.price.toLocaleString("id-ID")}
                        </p>
                        <p className="text-xs text-gray-500 capitalize mt-1">
                            {property.sale_type}
                        </p>
                    </div>
                    <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${property.status === 1
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                            }`}
                    >
                        {property.status === 1 ? "Active" : "Inactive"}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}