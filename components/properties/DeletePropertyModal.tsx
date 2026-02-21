"use client";

import { useState, useMemo, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Property } from "@/lib/types/property";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Search, X, AlertTriangle } from "lucide-react";
import { deleteProperty, getAllProperties, getPropertiesCount } from "@/lib/services/property.service";

interface DeletePropertyModalProps {
    open: boolean;
    onClose: () => void;
    onDelete: (ids: number[]) => void;
    properties: Property[];
}

export default function DeletePropertyModal({
    open,
    onClose,
    onDelete,
    properties,
}: DeletePropertyModalProps) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [totalCount, setTotalCount] = useState<number | null>(null);
    const [allProperties, setAllProperties] = useState<Property[]>(properties);
    const [loadingProperties, setLoadingProperties] = useState(false);

    async function fetchAllProperties() {
        try {
            setLoadingProperties(true);
            const res = await getAllProperties({ page: 1, limit: 10000 });
            setAllProperties(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            toast.error("Failed to load properties");
            setAllProperties([]);
        } finally {
            setLoadingProperties(false);
        }
    }

    useEffect(() => {
        if (open) {
            fetchAllProperties();
            fetchTotalCount();
        } else {
            setSelectedIds([]);
            setSearchQuery("");
            setAllProperties([]);
        }
    }, [open]);

    const filteredProperties = useMemo(() => {
        if (!searchQuery.trim()) return allProperties;
        const query = searchQuery.toLowerCase();
        return allProperties.filter(
            (property) =>
                property.title.toLowerCase().includes(query) ||
                property.district?.toLowerCase().includes(query) ||
                property.regency?.toLowerCase().includes(query) ||
                property.province?.toLowerCase().includes(query) ||
                property.address?.toLowerCase().includes(query) ||
                property.price.toString().includes(query)
        );
    }, [allProperties, searchQuery]);

    const handleToggle = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedIds.length === filteredProperties.length && filteredProperties.length > 0) {
            const filteredIds = filteredProperties.map((p) => p.id!);
            setSelectedIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
        } else {
            const filteredIds = filteredProperties.map((p) => p.id!);
            setSelectedIds((prev) => {
                const newIds = [...prev];
                filteredIds.forEach((id) => {
                    if (!newIds.includes(id)) newIds.push(id);
                });
                return newIds;
            });
        }
    };

    async function fetchTotalCount() {
        try {
            const count = await getPropertiesCount();
            setTotalCount(count);
        } catch (error) {
            console.error("Failed to fetch properties count:", error);
        }
    }

    const handleDelete = async () => {
        if (selectedIds.length === 0) return;
        try {
            setLoading(true);
            await Promise.all(selectedIds.map((id) => deleteProperty(id)));
            toast.success(`${selectedIds.length} ${selectedIds.length === 1 ? 'property' : 'properties'} deleted successfully`);
            onDelete(selectedIds);
            setSelectedIds([]);
            setSearchQuery("");
            onClose();
        } catch (error: any) {
            toast.error(error?.message || "Failed to delete properties");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedIds([]);
        setSearchQuery("");
        onClose();
    };

    const filteredSelectedCount = filteredProperties.filter(p => selectedIds.includes(p.id!)).length;
    const isAllFilteredSelected = filteredSelectedCount === filteredProperties.length && filteredProperties.length > 0;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            {/* Full-screen on mobile, capped modal on sm+ */}
            <DialogContent className="w-full max-w-full sm:max-w-lg md:max-w-2xl max-h-[100dvh] sm:max-h-[90vh] p-0 gap-0 rounded-none sm:rounded-lg">

                <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-gray-100 shrink-0">
                    <DialogTitle className="text-lg sm:text-2xl text-[#5B0F1A] flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
                        Delete Properties
                    </DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm">
                        Select properties you want to delete. This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                {/* Scrollable body */}
                <div className="flex flex-col flex-1 overflow-hidden px-4 sm:px-6 py-4 sm:py-5 space-y-3 sm:space-y-4 overflow-y-auto max-h-[calc(100dvh-64px)] sm:max-h-none">

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search by title, location, or price..."
                            className="pl-9 sm:pl-10 pr-9 sm:pr-10 h-9 sm:h-11 text-sm border-gray-200 focus-visible:ring-[#5B0F1A] focus-visible:border-[#5B0F1A]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-gray-100"
                                onClick={() => setSearchQuery("")}
                            >
                                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                        )}
                    </div>

                    {/* Select All row */}
                    <div className="flex items-center justify-between gap-2 px-3 py-2 sm:py-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="select-all"
                                checked={isAllFilteredSelected}
                                onCheckedChange={handleSelectAll}
                                disabled={filteredProperties.length === 0}
                            />
                            <label htmlFor="select-all" className="text-xs sm:text-sm font-medium cursor-pointer select-none">
                                Select All
                            </label>
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                            {selectedIds.length > 0 ? (
                                <span className="font-semibold text-[#5B0F1A]">
                                    {selectedIds.length} selected
                                </span>
                            ) : (
                                <span>
                                    {filteredProperties.length} of {totalCount ?? properties.length} properties
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Properties List */}
                    <ScrollArea className="h-[280px] sm:h-[340px] md:h-[400px] border rounded-lg p-2 sm:p-4">
                        {loadingProperties ? (
                            <div className="flex flex-col items-center justify-center py-10 sm:py-12">
                                <div className="h-7 w-7 sm:h-8 sm:w-8 animate-spin rounded-full border-4 border-[#5B0F1A] border-t-transparent mb-3" />
                                <p className="text-xs sm:text-sm text-muted-foreground">Loading properties...</p>
                            </div>
                        ) : filteredProperties.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 sm:py-12 text-center">
                                <div className="p-3 bg-gray-100 rounded-full mb-3">
                                    <Search className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                                </div>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    {searchQuery ? "No properties match your search" : "No properties available"}
                                </p>
                                {searchQuery && (
                                    <Button variant="ghost" size="sm" className="mt-2 text-xs sm:text-sm" onClick={() => setSearchQuery("")}>
                                        <X className="h-3.5 w-3.5 mr-1.5" /> Clear search
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-1.5 sm:space-y-2">
                                {filteredProperties.map((property) => {
                                    const isSelected = selectedIds.includes(property.id!);
                                    return (
                                        <div
                                            key={property.id}
                                            className={`flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg border transition-all cursor-pointer ${isSelected
                                                ? 'bg-red-50 border-red-200 shadow-sm'
                                                : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-200'
                                                }`}
                                            onClick={() => handleToggle(property.id!)}
                                        >
                                            <Checkbox
                                                id={`property-${property.id}`}
                                                checked={isSelected}
                                                onCheckedChange={() => handleToggle(property.id!)}
                                                className={`mt-0.5 shrink-0 ${isSelected ? 'border-red-500 data-[state=checked]:bg-red-500' : ''}`}
                                            />
                                            <label
                                                htmlFor={`property-${property.id}`}
                                                className="flex-1 cursor-pointer min-w-0"
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className={`font-semibold text-xs sm:text-sm truncate ${isSelected ? 'text-red-900' : 'text-gray-900'}`}>
                                                            {property.title}
                                                        </h4>
                                                        <p className={`text-xs mt-0.5 truncate ${isSelected ? 'text-red-700' : 'text-gray-500'}`}>
                                                            📍 {property.district}, {property.regency}
                                                            {property.province && `, ${property.province}`}
                                                        </p>
                                                    </div>
                                                    <div className={`text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 ${isSelected ? 'text-red-900' : 'text-gray-900'}`}>
                                                        Rp {property.price.toLocaleString("id-ID")}
                                                    </div>
                                                </div>
                                                {property.bedrooms > 0 && (
                                                    <div className={`flex items-center gap-2 sm:gap-3 mt-1.5 text-[10px] sm:text-xs ${isSelected ? 'text-red-600' : 'text-gray-500'}`}>
                                                        <span>🛏️ {property.bedrooms} bed</span>
                                                        <span>🚿 {property.bathrooms} bath</span>
                                                        {property.land_area && (
                                                            <span>📐 {property.land_area} m²</span>
                                                        )}
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </ScrollArea>

                    {/* Search result count */}
                    {searchQuery && filteredProperties.length > 0 && (
                        <div className="text-xs sm:text-sm text-muted-foreground text-center">
                            Found {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} matching "{searchQuery}"
                        </div>
                    )}

                    {/* Warning */}
                    {selectedIds.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 sm:p-3">
                            <p className="text-xs sm:text-sm text-red-800">
                                ⚠️ <strong>Warning:</strong> You are about to permanently delete{" "}
                                {selectedIds.length} {selectedIds.length === 1 ? 'property' : 'properties'}. This action cannot be undone.
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 sm:gap-3 pt-1 pb-2">
                        <Button
                            onClick={handleDelete}
                            disabled={selectedIds.length === 0 || loading}
                            className="bg-red-600 hover:bg-red-700 text-white flex-1 h-9 sm:h-11 text-xs sm:text-sm font-semibold shadow-sm"
                        >
                            {loading ? (
                                <span className="flex items-center gap-1.5 sm:gap-2">
                                    <div className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Deleting...
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 sm:gap-2">
                                    <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    Delete {selectedIds.length > 0 ? `${selectedIds.length} ` : ''}
                                    {selectedIds.length === 1 ? 'Property' : 'Properties'}
                                </span>
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={loading}
                            className="flex-1 h-9 sm:h-11 text-xs sm:text-sm font-semibold border-gray-300 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}