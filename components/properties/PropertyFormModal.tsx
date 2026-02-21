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
import { toast } from "sonner";
import { createProperty, updateProperty } from "@/lib/services/property.service";
import { uploadPropertyImages, getPropertyImages, setCoverImage, deletePropertyImage } from "@/lib/services/property.service";
import { Star } from "lucide-react";
import LocationPicker from "../LocationPicker";

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

    interface PropertyImage {
        id: number;
        property_id: number;
        url: string;
    }
    const [galleryImages, setGalleryImages] = useState<PropertyImage[]>([]);
    const [loadingGallery, setLoadingGallery] = useState(false);

    const fetchGalleryImages = async (propId: number) => {
        try {
            setLoadingGallery(true);
            const res = await getPropertyImages(propId);
            setGalleryImages(res.data ?? []);
        } catch (err) {
            setGalleryImages([]);
        } finally {
            setLoadingGallery(false);
        }
    };

    const handleSetCover = async (imageId: number) => {
        if (!createdPropertyId) return;
        await toast.promise(
            setCoverImage(createdPropertyId, imageId),
            {
                loading: "Setting cover...",
                success: "Cover image updated!",
                error: "Failed to set cover",
            }
        );
        fetchGalleryImages(createdPropertyId);
    };

    const handleDeleteImage = async (imageId: number) => {
        if (!createdPropertyId) return;
        await toast.promise(
            deletePropertyImage(createdPropertyId, imageId),
            {
                loading: "Deleting image...",
                success: "Image deleted",
                error: "Failed to delete image",
            }
        );
        fetchGalleryImages(createdPropertyId);
    };

    useEffect(() => {
        if (property && mode === "edit") {
            setFormData(property);
            setCreatedPropertyId(property.id!);
            if (property.cover_image_url) {
                setImagePreviews([property.cover_image_url]);
            } else {
                setImagePreviews([]);
            }
            fetchGalleryImages(property.id!);
        } else {
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
            setGalleryImages([]);
        }
    }, [property, mode, open]);

    const handleChange = (field: keyof Property, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleUploadImages = async () => {
        if (!createdPropertyId) { toast.error("Please create property first"); return; }
        if (imageFiles.length === 0) { toast.error("No images selected"); return; }
        try {
            setUploading(true);
            await toast.promise(
                uploadPropertyImages(createdPropertyId, imageFiles),
                {
                    loading: "Uploading images...",
                    success: "Images uploaded successfully",
                    error: (err) => err?.message || "Failed to upload images",
                }
            );
            setImageFiles([]);
            setImagePreviews(prev => {
                const serverCount = (property?.cover_image_url && mode === 'edit') ? 1 : 0;
                return prev.slice(0, serverCount);
            });
            await fetchGalleryImages(createdPropertyId);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        try {
            setLoading(true);

            const normalizedData: Property = {
                ...formData,
                cover_image_url: formData.cover_image_url
                    ? formData.cover_image_url.replace('http://localhost:8080', '')
                    : formData.cover_image_url,
            };

            let result: Property;

            if (mode === "create") {
                result = await toast.promise(
                    createProperty(normalizedData),
                    { loading: "Creating property...", success: "Property created successfully", error: "Failed to create property" }
                );
                setCreatedPropertyId(result.id!);
            } else {
                if (!normalizedData.id) { toast.error("Property ID not found"); return; }
                result = await toast.promise(
                    updateProperty(normalizedData.id, normalizedData),
                    { loading: "Updating property...", success: "Property updated successfully", error: "Failed to update property" }
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
            {/* Responsive dialog: full-screen on mobile, large modal on desktop */}
            <DialogContent className="w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[100dvh] sm:max-h-[90vh] p-0 gap-0 rounded-none sm:rounded-lg">
                <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-gray-100">
                    <DialogTitle className="text-lg sm:text-2xl text-[#5B0F1A]">
                        {mode === "create" ? "Create New Property" : "Edit Property"}
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[calc(100dvh-64px)] sm:h-[75vh] px-4 sm:px-6">
                    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 py-4 sm:py-6">

                        {/* ── Image Upload ── */}
                        <div className="space-y-3 sm:space-y-4">
                            <h3 className="font-semibold text-[#5B0F1A] text-sm sm:text-base">Property Image</h3>

                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6">
                                <div className="text-center">
                                    <div className="flex justify-center mb-3 sm:mb-4">
                                        <div className="p-3 sm:p-4 bg-gray-100 rounded-full">
                                            <ImageIcon size={24} className="text-gray-400 sm:hidden" />
                                            <ImageIcon size={32} className="text-gray-400 hidden sm:block" />
                                        </div>
                                    </div>

                                    <Label
                                        htmlFor="image-upload"
                                        className="cursor-pointer inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#5B0F1A] text-white text-sm rounded-lg hover:bg-[#7A1424] transition"
                                    >
                                        <Upload size={14} />
                                        Upload Images
                                    </Label>

                                    {/* Gallery & Cover Image Section */}
                                    {createdPropertyId !== null && (
                                        <div className="space-y-3 sm:space-y-4 mt-4 text-left">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold text-[#5B0F1A] text-sm sm:text-base">
                                                    Gallery & Cover Image
                                                </h3>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => fetchGalleryImages(createdPropertyId)}
                                                    disabled={loadingGallery}
                                                    className="text-xs sm:text-sm h-7 sm:h-8"
                                                >
                                                    {loadingGallery ? "Loading..." : "Refresh"}
                                                </Button>
                                            </div>

                                            {loadingGallery ? (
                                                <div className="flex justify-center py-6 sm:py-8">
                                                    <div className="h-7 w-7 sm:h-8 sm:w-8 animate-spin rounded-full border-4 border-[#5B0F1A] border-t-transparent" />
                                                </div>
                                            ) : galleryImages.length === 0 ? (
                                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-5 sm:p-8 text-center text-gray-400">
                                                    <ImageIcon size={28} className="mx-auto mb-2 opacity-40" />
                                                    <p className="text-xs sm:text-sm">Belum ada foto. Upload foto terlebih dahulu.</p>
                                                </div>
                                            ) : (
                                                /* Gallery grid: 2 cols on mobile, 3 on sm+ */
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                                                    {galleryImages.map((img) => {
                                                        const isCover = formData.cover_image_url
                                                            ? formData.cover_image_url.replace('http://localhost:8080', '') === img.url
                                                            : false;
                                                        return (
                                                            <div key={img.id} className="relative group rounded-lg overflow-hidden border-2 border-transparent hover:border-[#5B0F1A] transition-all">
                                                                <img
                                                                    src={img.url.startsWith('http') ? img.url : `http://localhost:8080${img.url}`}
                                                                    className="h-20 sm:h-28 w-full object-cover"
                                                                    alt=""
                                                                />

                                                                {isCover && (
                                                                    <span className="absolute top-1 left-1 bg-yellow-500 text-white text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5 sm:gap-1">
                                                                        <Star size={8} fill="white" className="sm:hidden" />
                                                                        <Star size={10} fill="white" className="hidden sm:block" />
                                                                        Cover
                                                                    </span>
                                                                )}

                                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 sm:gap-2">
                                                                    {!isCover && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleSetCover(img.id)}
                                                                            className="bg-yellow-500 hover:bg-yellow-600 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex items-center gap-0.5 sm:gap-1"
                                                                        >
                                                                            <Star size={10} /> Set Cover
                                                                        </button>
                                                                    )}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleDeleteImage(img.id)}
                                                                        className="bg-red-600 hover:bg-red-700 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex items-center gap-0.5 sm:gap-1"
                                                                    >
                                                                        <X size={10} /> Hapus
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <Input
                                        id="image-upload"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const newFiles = e.target.files ? Array.from(e.target.files) : [];
                                            setImageFiles((prev) => [...prev, ...newFiles]);
                                            const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
                                            setImagePreviews((prev) => [...prev, ...newPreviews]);
                                        }}
                                    />

                                    <p className="text-xs sm:text-sm text-gray-500 mt-2">
                                        PNG, JPG, WEBP up to 5MB
                                    </p>

                                    {/* Preview grid: 2 cols mobile, 3 on sm+ */}
                                    {imagePreviews.length > 0 && (
                                        <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3 text-left">
                                            <p className="text-xs sm:text-sm font-medium text-gray-600">
                                                {imagePreviews.length} foto • {imageFiles.length} foto baru dipilih
                                            </p>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                                                {imagePreviews.map((src, index) => {
                                                    const serverPreviewCount = (property?.cover_image_url && mode === 'edit') ? 1 : 0;
                                                    const isExisting = index < serverPreviewCount;
                                                    return (
                                                        <div key={index} className="relative">
                                                            <img
                                                                src={src}
                                                                className="h-20 sm:h-24 w-full object-cover rounded-lg"
                                                                alt=""
                                                            />
                                                            <span className={`absolute top-1 left-1 text-white text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded font-medium ${isExisting ? 'bg-blue-500' : 'bg-green-500'}`}>
                                                                {isExisting ? 'Existing' : 'New'}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const newPreviews = [...imagePreviews];
                                                                    newPreviews.splice(index, 1);
                                                                    setImagePreviews(newPreviews);
                                                                    const fileIndex = index - serverPreviewCount;
                                                                    if (fileIndex >= 0) {
                                                                        const newFiles = [...imageFiles];
                                                                        newFiles.splice(fileIndex, 1);
                                                                        setImageFiles(newFiles);
                                                                    }
                                                                }}
                                                                className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5 sm:p-1"
                                                            >
                                                                <X size={12} />
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
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
                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm"
                            >
                                {uploading ? "Uploading..." : "Upload Images"}
                            </Button>
                        )}

                        {/* ── Basic Information ── */}
                        <div className="space-y-3 sm:space-y-4">
                            <h3 className="font-semibold text-[#5B0F1A] text-sm sm:text-base">Basic Information</h3>

                            <div>
                                <Label className="text-xs sm:text-sm">Property Title</Label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => handleChange("title", e.target.value)}
                                    placeholder="Apartemen Modern Gamping"
                                    className="focus-visible:ring-[#5B0F1A] text-sm h-9 sm:h-10"
                                    required
                                />
                            </div>

                            <div>
                                <Label className="text-xs sm:text-sm">Description</Label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => handleChange("description", e.target.value)}
                                    placeholder="Lokasi strategis, dekat pasar dan sekolah."
                                    className="focus-visible:ring-[#5B0F1A] min-h-[80px] sm:min-h-[100px] text-sm"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <Label className="text-xs sm:text-sm">Price (Rp)</Label>
                                    <Input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => handleChange("price", Number(e.target.value))}
                                        placeholder="68000000"
                                        className="focus-visible:ring-[#5B0F1A] text-sm h-9 sm:h-10"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs sm:text-sm">Sale Type</Label>
                                    <Select value={formData.sale_type} onValueChange={(value) => handleChange("sale_type", value)}>
                                        <SelectTrigger className="focus:ring-[#5B0F1A] text-sm h-9 sm:h-10">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="jual">Jual</SelectItem>
                                            <SelectItem value="sewa">Sewa</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <Label className="text-xs sm:text-sm">Property Type ID</Label>
                                    <Input
                                        type="number"
                                        value={formData.property_type_id}
                                        onChange={(e) => handleChange("property_type_id", Number(e.target.value))}
                                        placeholder="1"
                                        className="focus-visible:ring-[#5B0F1A] text-sm h-9 sm:h-10"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs sm:text-sm">Status</Label>
                                    <Select value={formData.status.toString()} onValueChange={(value) => handleChange("status", Number(value))}>
                                        <SelectTrigger className="focus:ring-[#5B0F1A] text-sm h-9 sm:h-10">
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

                        {/* ── Location ── */}
                        <div className="space-y-3 sm:space-y-4">
                            <h3 className="font-semibold text-[#5B0F1A] text-sm sm:text-base">Location</h3>

                            {/* Province / Regency / District: stack on mobile, 3 cols on md+ */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                                <div>
                                    <Label className="text-xs sm:text-sm">Province</Label>
                                    <Input
                                        value={formData.province}
                                        onChange={(e) => handleChange("province", e.target.value)}
                                        placeholder="DIY"
                                        className="focus-visible:ring-[#5B0F1A] text-sm h-9 sm:h-10"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs sm:text-sm">Regency</Label>
                                    <Input
                                        value={formData.regency}
                                        onChange={(e) => handleChange("regency", e.target.value)}
                                        placeholder="Sleman"
                                        className="focus-visible:ring-[#5B0F1A] text-sm h-9 sm:h-10"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs sm:text-sm">District</Label>
                                    <Input
                                        value={formData.district}
                                        onChange={(e) => handleChange("district", e.target.value)}
                                        placeholder="Gamping"
                                        className="focus-visible:ring-[#5B0F1A] text-sm h-9 sm:h-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs sm:text-sm">Full Address</Label>
                                <Input
                                    value={formData.address}
                                    onChange={(e) => handleChange("address", e.target.value)}
                                    placeholder="Jl. Godean KM 6"
                                    className="focus-visible:ring-[#5B0F1A] text-sm h-9 sm:h-10"
                                    required
                                />
                            </div>

                            <LocationPicker
                                province={formData.province}
                                regency={formData.regency}
                                district={formData.district}
                                address={formData.address}
                                latitude={formData.latitude}
                                longitude={formData.longitude}
                                onChange={(lat, lng) => {
                                    handleChange("latitude", lat);
                                    handleChange("longitude", lng);
                                }}
                            />
                        </div>

                        {/* ── Property Details ── */}
                        <div className="space-y-3 sm:space-y-4">
                            <h3 className="font-semibold text-[#5B0F1A] text-sm sm:text-base">Property Details</h3>

                            {/* 2 cols on mobile, 4 on md+ */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                                {[
                                    { label: "Building Area (m²)", field: "building_area", placeholder: "35" },
                                    { label: "Land Area (m²)", field: "land_area", placeholder: "0" },
                                    { label: "Bedrooms", field: "bedrooms", placeholder: "2" },
                                    { label: "Bathrooms", field: "bathrooms", placeholder: "1" },
                                ].map(({ label, field, placeholder }) => (
                                    <div key={field}>
                                        <Label className="text-xs sm:text-sm">{label}</Label>
                                        <Input
                                            type="number"
                                            value={(formData as any)[field]}
                                            onChange={(e) => handleChange(field as keyof Property, Number(e.target.value))}
                                            placeholder={placeholder}
                                            className="focus-visible:ring-[#5B0F1A] text-sm h-9 sm:h-10"
                                            required
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                                {[
                                    { label: "Floors", field: "floors", placeholder: "1" },
                                    { label: "Garage", field: "garage", placeholder: "0" },
                                    { label: "Carport", field: "carport", placeholder: "1" },
                                    { label: "Year Built", field: "year_constructed", placeholder: "2024" },
                                ].map(({ label, field, placeholder }) => (
                                    <div key={field}>
                                        <Label className="text-xs sm:text-sm">{label}</Label>
                                        <Input
                                            type="number"
                                            value={(formData as any)[field]}
                                            onChange={(e) => handleChange(field as keyof Property, Number(e.target.value))}
                                            placeholder={placeholder}
                                            className="focus-visible:ring-[#5B0F1A] text-sm h-9 sm:h-10"
                                            required
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Utilities ── */}
                        <div className="space-y-3 sm:space-y-4">
                            <h3 className="font-semibold text-[#5B0F1A] text-sm sm:text-base">Utilities</h3>

                            {/* Stack on mobile, 3 cols on sm+ */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                                <div>
                                    <Label className="text-xs sm:text-sm">Electricity (Watt)</Label>
                                    <Input
                                        type="number"
                                        value={formData.electricity}
                                        onChange={(e) => handleChange("electricity", Number(e.target.value))}
                                        placeholder="1300"
                                        className="focus-visible:ring-[#5B0F1A] text-sm h-9 sm:h-10"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs sm:text-sm">Water Source</Label>
                                    <Input
                                        value={formData.water_source}
                                        onChange={(e) => handleChange("water_source", e.target.value)}
                                        placeholder="PDAM"
                                        className="focus-visible:ring-[#5B0F1A] text-sm h-9 sm:h-10"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs sm:text-sm">Certificate</Label>
                                    <Input
                                        value={formData.certificate}
                                        onChange={(e) => handleChange("certificate", e.target.value)}
                                        placeholder="SHM"
                                        className="focus-visible:ring-[#5B0F1A] text-sm h-9 sm:h-10"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ── User ID ── */}
                        <div>
                            <Label className="text-xs sm:text-sm">User ID</Label>
                            <Input
                                type="number"
                                value={formData.user_id}
                                onChange={(e) => handleChange("user_id", Number(e.target.value))}
                                placeholder="1"
                                className="focus-visible:ring-[#5B0F1A] text-sm h-9 sm:h-10"
                                required
                            />
                        </div>

                        {/* ── Actions ── */}
                        <div className="flex gap-3 sm:gap-4 pt-2 sm:pt-4 pb-2">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-[#5B0F1A] hover:bg-[#7A1424] text-white flex-1 text-sm h-9 sm:h-10"
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
                                className="flex-1 text-sm h-9 sm:h-10"
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