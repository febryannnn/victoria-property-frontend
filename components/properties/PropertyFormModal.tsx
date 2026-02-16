"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Property } from "@/lib/types/property";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { uploadPropertyImages } from "@/lib/services/property.service";
import { toast } from "sonner";
import { createProperty, updateProperty } from "@/lib/services/property.service";

interface PropertyFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (property: Property) => Promise<Property>;
    property?: Property | null;
    mode: "create" | "edit";
}

export default function PropertyFormModal({
    open,
    onClose,
    onSubmit,
    property,
    mode,
}: PropertyFormModalProps) {
    const [formData, setFormData] = useState<Property>({
        title: "",
        description: "",
        price: 0,
        status: 1,
        province: "",
        regency: "",
        district: "",
        address: "",
        building_area: 0,
        land_area: 0,
        electricity: 0,
        water_source: "",
        bedrooms: 0,
        bathrooms: 0,
        floors: 0,
        garage: 0,
        carport: 0,
        certificate: "",
        year_constructed: new Date().getFullYear(),
        sale_type: "jual",
        property_type_id: 1,
        user_id: 1,
    });
    const [loading, setLoading] = useState(false);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [createdPropertyId, setCreatedPropertyId] = useState<number | null>(null);
    const [uploading, setUploading] = useState(false);
    

    useEffect(() => {
        if (property && mode === "edit") {
            setFormData(property);
            setCreatedPropertyId(property.id!);

            if (property.cover_image_url) {
                setImagePreviews([
                    `http://localhost:8080${property.cover_image_url}`,
                    
                ]);
            } else {
                setImagePreviews([]);
            }

        } else {
            // reset create mode
            setFormData({
                title: "",
                description: "",
                price: 0,
                status: 1,
                province: "",
                regency: "",
                district: "",
                address: "",
                building_area: 0,
                land_area: 0,
                electricity: 0,
                water_source: "",
                bedrooms: 0,
                bathrooms: 0,
                floors: 0,
                garage: 0,
                carport: 0,
                certificate: "",
                year_constructed: new Date().getFullYear(),
                sale_type: "jual",
                property_type_id: 1,
                user_id: 1,
            });

            setCreatedPropertyId(null);
            setImagePreviews([]);
            setImageFiles([]);
        }
    }, [property, mode, open]);

    const handleChange = (field: keyof Property, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (file) {
    //         setImageFile(file);

    //         // Create preview
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setImagePreview(reader.result as string);
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    // const handleRemoveImage = () => {
    //     setImageFile(null);
    //     setImagePreview(null);
    //     setFormData((prev) => ({
    //         ...prev,
    //         cover_image_url: "null"
    //     }));
    // };

    const handleUploadImages = async () => {
        if (!createdPropertyId) {
            toast.error("Please create property first");
            return;
        }

        if (imageFiles.length === 0) {
            toast.error("No images selected");
            return;
        }

        try {
            setUploading(true);

            await toast.promise(
                uploadPropertyImages(createdPropertyId, imageFiles),
                {
                    loading: "Uploading images...",
                    success: "Images uploaded successfully",
                    error: "Failed to upload images",
                }
            );

            setImageFiles([]);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        try {
            setLoading(true);

            let result: Property;

            if (mode === "create") {
                result = await toast.promise(
                    createProperty(formData),
                    {
                        loading: "Creating property...",
                        success: "Property created successfully",
                        error: "Failed to create property",
                    }
                );

                // simpan id supaya bisa upload image
                setCreatedPropertyId(result.id!);

            } else {
                if (!formData.id) {
                    toast.error("Property ID not found");
                    return;
                }

                result = await toast.promise(
                    updateProperty(formData.id, formData),
                    {
                        loading: "Updating property...",
                        success: "Property updated successfully",
                        error: "Failed to update property",
                    }
                );

                setCreatedPropertyId(result.id!);
            }

            onSubmit(result);

        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-[#5B0F1A]">
                        {mode === "create" ? "Create New Property" : "Edit Property"}
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[70vh] pr-4">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Image Upload */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-[#5B0F1A]">Property Image</h3>

                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                <div className="text-center">
                                    <div className="flex justify-center mb-4">
                                        <div className="p-4 bg-gray-100 rounded-full">
                                            <ImageIcon size={32} className="text-gray-400" />
                                        </div>
                                    </div>

                                    <Label
                                        htmlFor="image-upload"
                                        className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#5B0F1A] text-white rounded-lg hover:bg-[#7A1424] transition"
                                    >
                                        <Upload size={16} />
                                        Upload Images
                                    </Label>

                                    <Input
                                        id="image-upload"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const files = e.target.files ? Array.from(e.target.files) : [];
                                            setImageFiles(files);

                                            const previewUrls = files.map((file) =>
                                                URL.createObjectURL(file)
                                            );

                                            setImagePreviews(previewUrls);
                                        }}
                                    />

                                    <p className="text-sm text-gray-500 mt-2">
                                        PNG, JPG, WEBP up to 5MB
                                    </p>

                                    {/* Multiple Preview */}
                                    {imagePreviews.length > 0 && (
                                        <div className="mt-6 grid grid-cols-3 gap-4">
                                            {imagePreviews.map((src, index) => (
                                                <div key={index} className="relative">
                                                    <img
                                                        src={src}
                                                        className="h-24 w-full object-cover rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newFiles = [...imageFiles];
                                                            const newPreviews = [...imagePreviews];
                                                            newFiles.splice(index, 1);
                                                            newPreviews.splice(index, 1);
                                                            setImageFiles(newFiles);
                                                            setImagePreviews(newPreviews);
                                                        }}
                                                        className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    
                                </div>
                                
                            </div>
                        </div>

                        {createdPropertyId !== null && (
                            <Button
                                type="button"
                                onClick={handleUploadImages}
                                disabled={uploading || imageFiles.length === 0}
                                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {uploading ? "Uploading..." : "Upload Images"}
                            </Button>
                        )}

                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-[#5B0F1A]">Basic Information</h3>

                            <div>
                                <Label>Property Title</Label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => handleChange("title", e.target.value)}
                                    placeholder="Apartemen Modern Gamping"
                                    className="focus-visible:ring-[#5B0F1A]"
                                    required
                                />
                            </div>

                            <div>
                                <Label>Description</Label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => handleChange("description", e.target.value)}
                                    placeholder="Lokasi strategis, dekat pasar dan sekolah."
                                    className="focus-visible:ring-[#5B0F1A] min-h-[100px]"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Price (Rp)</Label>
                                    <Input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => handleChange("price", Number(e.target.value))}
                                        placeholder="68000000"
                                        className="focus-visible:ring-[#5B0F1A]"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label>Sale Type</Label>
                                    <Select
                                        value={formData.sale_type}
                                        onValueChange={(value) => handleChange("sale_type", value)}
                                    >
                                        <SelectTrigger className="focus:ring-[#5B0F1A]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="jual">Jual</SelectItem>
                                            <SelectItem value="sewa">Sewa</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Property Type ID</Label>
                                    <Input
                                        type="number"
                                        value={formData.property_type_id}
                                        onChange={(e) =>
                                            handleChange("property_type_id", Number(e.target.value))
                                        }
                                        placeholder="1"
                                        className="focus-visible:ring-[#5B0F1A]"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label>Status</Label>
                                    <Select
                                        value={formData.status.toString()}
                                        onValueChange={(value) => handleChange("status", Number(value))}
                                    >
                                        <SelectTrigger className="focus:ring-[#5B0F1A]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Active</SelectItem>
                                            <SelectItem value="0">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-[#5B0F1A]">Location</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label>Province</Label>
                                    <Input
                                        value={formData.province}
                                        onChange={(e) => handleChange("province", e.target.value)}
                                        placeholder="DIY"
                                        className="focus-visible:ring-[#5B0F1A]"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label>Regency</Label>
                                    <Input
                                        value={formData.regency}
                                        onChange={(e) => handleChange("regency", e.target.value)}
                                        placeholder="Sleman"
                                        className="focus-visible:ring-[#5B0F1A]"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label>District</Label>
                                    <Input
                                        value={formData.district}
                                        onChange={(e) => handleChange("district", e.target.value)}
                                        placeholder="Gamping"
                                        className="focus-visible:ring-[#5B0F1A]"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label>Full Address</Label>
                                <Input
                                    value={formData.address}
                                    onChange={(e) => handleChange("address", e.target.value)}
                                    placeholder="Jl. Godean KM 6"
                                    className="focus-visible:ring-[#5B0F1A]"
                                    required
                                />
                            </div>
                        </div>

                        {/* Property Details */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-[#5B0F1A]">Property Details</h3>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <Label>Building Area (m²)</Label>
                                    <Input
                                        type="number"
                                        value={formData.building_area}
                                        onChange={(e) =>
                                            handleChange("building_area", Number(e.target.value))
                                        }
                                        placeholder="35"
                                        className="focus-visible:ring-[#5B0F1A]"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label>Land Area (m²)</Label>
                                    <Input
                                        type="number"
                                        value={formData.land_area}
                                        onChange={(e) => handleChange("land_area", Number(e.target.value))}
                                        placeholder="0"
                                        className="focus-visible:ring-[#5B0F1A]"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label>Bedrooms</Label>
                                    <Input
                                        type="number"
                                        value={formData.bedrooms}
                                        onChange={(e) => handleChange("bedrooms", Number(e.target.value))}
                                        placeholder="2"
                                        className="focus-visible:ring-[#5B0F1A]"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label>Bathrooms</Label>
                                    <Input
                                        type="number"
                                        value={formData.bathrooms}
                                        onChange={(e) => handleChange("bathrooms", Number(e.target.value))}
                                        placeholder="1"
                                        className="focus-visible:ring-[#5B0F1A]"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <Label>Floors</Label>
                                    <Input
                                        type="number"
                                        value={formData.floors}
                                        onChange={(e) => handleChange("floors", Number(e.target.value))}
                                        placeholder="1"
                                        className="focus-visible:ring-[#5B0F1A]"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label>Garage</Label>
                                    <Input
                                        type="number"
                                        value={formData.garage}
                                        onChange={(e) => handleChange("garage", Number(e.target.value))}
                                        placeholder="0"
                                        className="focus-visible:ring-[#5B0F1A]"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label>Carport</Label>
                                    <Input
                                        type="number"
                                        value={formData.carport}
                                        onChange={(e) => handleChange("carport", Number(e.target.value))}
                                        placeholder="1"
                                        className="focus-visible:ring-[#5B0F1A]"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label>Year Built</Label>
                                    <Input
                                        type="number"
                                        value={formData.year_constructed}
                                        onChange={(e) =>
                                            handleChange("year_constructed", Number(e.target.value))
                                        }
                                        placeholder="2024"
                                        className="focus-visible:ring-[#5B0F1A]"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Utilities */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-[#5B0F1A]">Utilities</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label>Electricity (Watt)</Label>
                                    <Input
                                        type="number"
                                        value={formData.electricity}
                                        onChange={(e) =>
                                            handleChange("electricity", Number(e.target.value))
                                        }
                                        placeholder="1300"
                                        className="focus-visible:ring-[#5B0F1A]"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label>Water Source</Label>
                                    <Input
                                        value={formData.water_source}
                                        onChange={(e) => handleChange("water_source", e.target.value)}
                                        placeholder="PDAM"
                                        className="focus-visible:ring-[#5B0F1A]"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label>Certificate</Label>
                                    <Input
                                        value={formData.certificate}
                                        onChange={(e) => handleChange("certificate", e.target.value)}
                                        placeholder="SHM"
                                        className="focus-visible:ring-[#5B0F1A]"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* User ID */}
                        <div>
                            <Label>User ID</Label>
                            <Input
                                type="number"
                                value={formData.user_id}
                                onChange={(e) => handleChange("user_id", Number(e.target.value))}
                                placeholder="1"
                                className="focus-visible:ring-[#5B0F1A]"
                                required
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-[#5B0F1A] hover:bg-[#7A1424] text-white flex-1"
                            >
                                {loading
                                    ? "Saving..."
                                    : mode === "create"
                                        ? "Create Property"
                                        : "Update Property"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}