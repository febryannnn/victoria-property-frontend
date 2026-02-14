"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyFormModal from "@/components/properties/PropertyFormModal";
import DeletePropertyModal from "@/components/properties/DeletePropertyModal";
import { Property } from "@/lib/types/property";
import { PlusCircle, Trash2 } from "lucide-react";
import { getProperties, createProperty, updateProperty, deleteProperties } from "@/lib/services/dashboard.service";
import { getAllProperties } from "@/lib/services/property.service";

export default function PropertiesPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProperties();
    }, []);

    async function fetchProperties() {
        try {
            setLoading(true);
            const res = await getAllProperties();


            const mapped: Property[] = res.data.map((item: any) => ({
                id: item.id,
                title: item.title,
                description: item.description,
                price: item.price,
                status: item.status,
                province: item.province,
                regency: item.regency,
                district: item.district,
                address: item.address,
                building_area: item.building_area,
                land_area: item.land_area,
                electricity: item.electricity,
                water_source: item.water_source,
                bedrooms: item.bedrooms,
                bathrooms: item.bathrooms,
                floors: item.floors,
                garage: item.garage,
                carport: item.carport,
                certificate: item.certificate,
                year_constructed: item.year_constructed,
                sale_type: item.sale_type,
                created_at: item.created_at,
                cover_image_url: item.cover_image_url
                    ? `${process.env.NEXT_PUBLIC_API_URL}${item.cover_image_url}`
                    : null,
                property_type_id: item.property_type_id,
                user_id: item.user_id,
            }));

            setProperties(mapped);
        } catch (error) {
            console.error("Failed to fetch properties:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleCreateProperty = async (property: Property) => {
        try {
            await createProperty(property);
            await fetchProperties(); // Refetch from server
        } catch (error) {
            console.error("Failed to create property:", error);
        }
    };

    const handleUpdateProperty = async (property: Property) => {
        try {
            if (property.id) {
                await updateProperty(property.id, property);
                await fetchProperties(); // Refetch from server
            }
        } catch (error) {
            console.error("Failed to update property:", error);
        }
    };

    const handleDeleteProperties = async (ids: number[]) => {
        try {
            await deleteProperties(ids);
            await fetchProperties(); // Refetch from server
        } catch (error) {
            console.error("Failed to delete properties:", error);
        }
    };

    const handleEdit = (property: Property) => {
        setSelectedProperty(property);
        setFormMode("edit");
        setShowFormModal(true);
    };

    const handleCreate = () => {
        setSelectedProperty(null);
        setFormMode("create");
        setShowFormModal(true);
    };

    if (loading) {
        return (
            <div className="p-10">
                <div className="text-center py-20 text-gray-500">
                    Loading properties...
                </div>
            </div>
        );
    }

    return (
        <div className="p-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#5B0F1A]">Properties</h1>
                    <p className="text-gray-500 mt-1">
                        Manage all your property listings
                    </p>
                </div>

                <div className="flex gap-3">
                    <Button
                        onClick={() => setShowDeleteModal(true)}
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                        disabled={properties.length === 0}
                    >
                        <Trash2 size={18} className="mr-2" />
                        Delete Properties
                    </Button>
                    <Button
                        onClick={handleCreate}
                        className="bg-[#5B0F1A] hover:bg-[#7A1424] text-white"
                    >
                        <PlusCircle size={18} className="mr-2" />
                        Add New Property
                    </Button>
                </div>
            </div>

            {properties.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                    <p className="text-gray-500 mb-4">No properties found</p>
                    <Button
                        onClick={handleCreate}
                        className="bg-[#5B0F1A] hover:bg-[#7A1424] text-white"
                    >
                        <PlusCircle size={18} className="mr-2" />
                        Create Your First Property
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                        <PropertyCard
                            key={property.id}
                            property={property}
                            onEdit={handleEdit}
                        />
                    ))}
                </div>
            )}

            <PropertyFormModal
                open={showFormModal}
                onClose={() => setShowFormModal(false)}
                onSubmit={formMode === "create" ? handleCreateProperty : handleUpdateProperty}
                property={selectedProperty}
                mode={formMode}
            />

            <DeletePropertyModal
                open={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onDelete={handleDeleteProperties}
                properties={properties}
            />
        </div>
    );
}