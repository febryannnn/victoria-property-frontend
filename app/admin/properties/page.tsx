"use client";

import { useState, useEffect } from "react";
import {
    Search,
    SlidersHorizontal,
    Grid3X3,
    List,
    ChevronDown,
    PlusCircle,
    Trash2,
    X,
    Filter,
    TrendingUp,
    Building2,
    Sparkles,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyFormModal from "@/components/properties/PropertyFormModal";
import DeletePropertyModal from "@/components/properties/DeletePropertyModal";
import { Property } from "@/lib/types/property";
import { getProperties, createProperty, updateProperty, deleteProperties } from "@/lib/services/dashboard.service";
import { getAllProperties, getPropertiesCount } from "@/lib/services/property.service";

export default function PropertiesPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [loading, setLoading] = useState(true);

    // Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [propertyType, setPropertyType] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [priceRange, setPriceRange] = useState("all");
    const [bedroomsFilter, setBedroomsFilter] = useState("all");
    const [bathroomsFilter, setBathroomsFilter] = useState("all");
    const [landAreaFilter, setLandAreaFilter] = useState("all");
    const [locationFilter, setLocationFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12);

    const activeFiltersCount = [
        propertyType !== "all",
        statusFilter !== "all",
        priceRange !== "all",
        bedroomsFilter !== "all",
        bathroomsFilter !== "all",
        landAreaFilter !== "all",
        locationFilter !== "all",
    ].filter(Boolean).length;

    // Calculate total pages
    const totalPages = Math.ceil(
        (activeFiltersCount > 0 ? filteredProperties.length : totalCount) / itemsPerPage
    );

    useEffect(() => {
        fetchTotalCount();
    }, []);

    useEffect(() => {
        fetchProperties();
    }, [currentPage]);

    useEffect(() => {
        if (activeFiltersCount > 0) {
            fetchProperties();
        }
    }, [searchQuery, propertyType, statusFilter, priceRange, bedroomsFilter, bathroomsFilter, landAreaFilter, locationFilter, sortBy]);

    async function fetchTotalCount() {
        try {
            const count = await getPropertiesCount();
            setTotalCount(count);
        } catch (error) {
            console.error("Failed to fetch properties count:", error);
        }
    }

    async function fetchProperties() {
        try {
            setLoading(true);

            // If filters are active, fetch all for client-side filtering
            const shouldFetchAll = activeFiltersCount > 0;
            const pageToFetch = shouldFetchAll ? 1 : currentPage;
            const limitToFetch = shouldFetchAll ? 1000 : itemsPerPage;

            const res = await getAllProperties(pageToFetch, limitToFetch);

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
                    ? `http://localhost:8080${item.cover_image_url}`
                    : null,
                property_type_id: item.property_type_id,
                user_id: item.user_id,
            }));

            setProperties(mapped);

            if (activeFiltersCount > 0) {
                applyFiltersToProperties(mapped);
            } else {
                setFilteredProperties(mapped);
            }
        } catch (error) {
            console.error("Failed to fetch properties:", error);
        } finally {
            setLoading(false);
        }
    }

    const applyFiltersToProperties = (propertiesToFilter: Property[]) => {
        let filtered = [...propertiesToFilter];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (p) =>
                    p.title.toLowerCase().includes(query) ||
                    p.address?.toLowerCase().includes(query) ||
                    p.province?.toLowerCase().includes(query) ||
                    p.regency?.toLowerCase().includes(query) ||
                    p.district?.toLowerCase().includes(query)
            );
        }

        if (propertyType !== "all") {
            const typeId = parseInt(propertyType);
            filtered = filtered.filter((p) => p.property_type_id === typeId);
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter((p) => p.status === statusFilter);
        }

        if (priceRange !== "all") {
            filtered = filtered.filter((p) => {
                const price = parseFloat(p.price);
                switch (priceRange) {
                    case "0-1m": return price < 1000000000;
                    case "1-3m": return price >= 1000000000 && price < 3000000000;
                    case "3-5m": return price >= 3000000000 && price < 5000000000;
                    case "5-10m": return price >= 5000000000 && price < 10000000000;
                    case "10m+": return price >= 10000000000;
                    default: return true;
                }
            });
        }

        if (bedroomsFilter !== "all") {
            const beds = parseInt(bedroomsFilter);
            filtered = filtered.filter((p) =>
                beds === 4 ? p.bedrooms >= 4 : p.bedrooms === beds
            );
        }

        if (bathroomsFilter !== "all") {
            const baths = parseInt(bathroomsFilter);
            filtered = filtered.filter((p) =>
                baths === 3 ? p.bathrooms >= 3 : p.bathrooms === baths
            );
        }

        if (landAreaFilter !== "all") {
            filtered = filtered.filter((p) => {
                const area = p.land_area || 0;
                switch (landAreaFilter) {
                    case "0-100": return area < 100;
                    case "100-200": return area >= 100 && area < 200;
                    case "200-500": return area >= 200 && area < 500;
                    case "500+": return area >= 500;
                    default: return true;
                }
            });
        }

        if (locationFilter !== "all") {
            filtered = filtered.filter((p) =>
                p.province?.toLowerCase().includes(locationFilter.toLowerCase()) ||
                p.regency?.toLowerCase().includes(locationFilter.toLowerCase())
            );
        }

        filtered.sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
                case "price-low":
                    return parseFloat(a.price) - parseFloat(b.price);
                case "price-high":
                    return parseFloat(b.price) - parseFloat(a.price);
                default:
                    return 0;
            }
        });

        setFilteredProperties(filtered);
    };

    const handleResetFilters = () => {
        setSearchQuery("");
        setPropertyType("all");
        setStatusFilter("all");
        setPriceRange("all");
        setBedroomsFilter("all");
        setBathroomsFilter("all");
        setLandAreaFilter("all");
        setLocationFilter("all");
        setSortBy("newest");
        setCurrentPage(1);
    };

    const handleCreateProperty = async (property: Property) => {
        try {
            await createProperty(property);
            await fetchProperties();
            await fetchTotalCount();
        } catch (error) {
            console.error("Failed to create property:", error);
        }
    };

    const handleUpdateProperty = async (property: Property) => {
        try {
            if (property.id) {
                await updateProperty(property.id, property);
                await fetchProperties();
            }
        } catch (error) {
            console.error("Failed to update property:", error);
        }
    };

    const handleDeleteProperties = async (ids: number[]) => {
        try {
            await deleteProperties(ids);
            await fetchProperties();
            await fetchTotalCount();
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

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Generate page numbers
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    // Get current page properties
    const getCurrentPageProperties = () => {
        if (activeFiltersCount > 0) {
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            return filteredProperties.slice(startIndex, endIndex);
        } else {
            return filteredProperties;
        }
    };

    const currentProperties = getCurrentPageProperties();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, activeFiltersCount > 0 ? filteredProperties.length : totalCount);
    const displayedCount = activeFiltersCount > 0 ? filteredProperties.length : totalCount;

    if (loading) {
        return (
            <div className="p-10">
                <div className="flex items-center justify-center py-20">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#5B0F1A] border-t-transparent"></div>
                        <p className="text-sm text-muted-foreground">Loading properties...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col gap-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#5B0F1A]/10 rounded-lg">
                                <Building2 className="h-6 w-6 text-[#5B0F1A]" />
                            </div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#5B0F1A] to-[#8B1526] bg-clip-text text-transparent">
                                Properties
                            </h1>
                        </div>
                        <p className="text-muted-foreground flex items-center gap-2">
                            <span>Manage and organize your property portfolio</span>
                            {activeFiltersCount > 0 && (
                                <Badge variant="secondary" className="ml-2">
                                    {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
                                </Badge>
                            )}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => setShowDeleteModal(true)}
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all"
                            disabled={properties.length === 0}
                        >
                            <Trash2 size={18} className="mr-2" />
                            Delete
                        </Button>
                        <Button
                            onClick={handleCreate}
                            className="bg-gradient-to-r from-[#5B0F1A] to-[#7A1424] hover:from-[#7A1424] hover:to-[#5B0F1A] text-white shadow-lg shadow-[#5B0F1A]/20 transition-all"
                        >
                            <PlusCircle size={18} className="mr-2" />
                            Add Property
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="border-l-4 border-l-[#5B0F1A] bg-gradient-to-br from-white to-gray-50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium">Total Properties</p>
                                    <p className="text-3xl font-bold text-[#5B0F1A] mt-1">{totalCount}</p>
                                </div>
                                <div className="p-3 bg-[#5B0F1A]/10 rounded-lg">
                                    <Building2 className="h-6 w-6 text-[#5B0F1A]" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-emerald-500 bg-gradient-to-br from-white to-emerald-50/30">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium">Active Listings</p>
                                    <p className="text-3xl font-bold text-emerald-600 mt-1">
                                        {properties.filter(p => p.status === 1).length}
                                    </p>
                                </div>
                                <div className="p-3 bg-emerald-100 rounded-lg">
                                    <Sparkles className="h-6 w-6 text-emerald-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-white to-blue-50/30">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium">For Sale</p>
                                    <p className="text-3xl font-bold text-blue-600 mt-1">
                                        {properties.filter(p => p.sale_type === 'sale').length}
                                    </p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <TrendingUp className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-amber-500 bg-gradient-to-br from-white to-amber-50/30">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium">Current Page</p>
                                    <p className="text-3xl font-bold text-amber-600 mt-1">{currentProperties.length}</p>
                                </div>
                                <div className="p-3 bg-amber-100 rounded-lg">
                                    <Filter className="h-6 w-6 text-amber-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Search & Filter Section */}
            <Card className="shadow-md border-0 bg-gradient-to-br from-white to-gray-50/50">
                <CardContent className="p-6 space-y-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search Input */}
                        <div className="flex-1 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-[#5B0F1A] transition-colors" />
                            <Input
                                type="text"
                                placeholder="Search by location, title, or address..."
                                className="pl-12 h-12 border-gray-200 focus-visible:ring-[#5B0F1A] focus-visible:border-[#5B0F1A] bg-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                                    onClick={() => setSearchQuery("")}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>

                        {/* Quick Filters */}
                        <div className="flex flex-wrap gap-3">
                            <Select value={propertyType} onValueChange={setPropertyType}>
                                <SelectTrigger className="w-[160px] h-12 border-gray-200 bg-white">
                                    <SelectValue placeholder="Property Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="1">House</SelectItem>
                                    <SelectItem value="2">Apartment</SelectItem>
                                    <SelectItem value="3">Shophouse</SelectItem>
                                    <SelectItem value="4">Land</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[140px] h-12 border-gray-200 bg-white">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="sale">For Sale</SelectItem>
                                    <SelectItem value="rent">For Rent</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={priceRange} onValueChange={setPriceRange}>
                                <SelectTrigger className="w-[160px] h-12 border-gray-200 bg-white">
                                    <SelectValue placeholder="Price Range" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Prices</SelectItem>
                                    <SelectItem value="0-1m">Under 1M</SelectItem>
                                    <SelectItem value="1-3m">1M - 3M</SelectItem>
                                    <SelectItem value="3-5m">3M - 5M</SelectItem>
                                    <SelectItem value="5-10m">5M - 10M</SelectItem>
                                    <SelectItem value="10m+">Above 10M</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                variant={showFilters ? "default" : "outline"}
                                className={`h-12 ${showFilters ? 'bg-[#5B0F1A] hover:bg-[#7A1424]' : 'border-gray-200 hover:bg-gray-50'}`}
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <SlidersHorizontal className="h-4 w-4 mr-2" />
                                Advanced
                                <ChevronDown className={`h-4 w-4 ml-2 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
                            </Button>
                        </div>
                    </div>

                    {/* Advanced Filters */}
                    {showFilters && (
                        <div className="pt-4 border-t border-gray-200 animate-in slide-in-from-top-2 duration-300">
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                <Select value={bedroomsFilter} onValueChange={setBedroomsFilter}>
                                    <SelectTrigger className="bg-white">
                                        <SelectValue placeholder="Bedrooms" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Any Beds</SelectItem>
                                        <SelectItem value="1">1 Bedroom</SelectItem>
                                        <SelectItem value="2">2 Bedrooms</SelectItem>
                                        <SelectItem value="3">3 Bedrooms</SelectItem>
                                        <SelectItem value="4">4+ Bedrooms</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={bathroomsFilter} onValueChange={setBathroomsFilter}>
                                    <SelectTrigger className="bg-white">
                                        <SelectValue placeholder="Bathrooms" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Any Baths</SelectItem>
                                        <SelectItem value="1">1 Bathroom</SelectItem>
                                        <SelectItem value="2">2 Bathrooms</SelectItem>
                                        <SelectItem value="3">3+ Bathrooms</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={landAreaFilter} onValueChange={setLandAreaFilter}>
                                    <SelectTrigger className="bg-white">
                                        <SelectValue placeholder="Land Area" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Any Size</SelectItem>
                                        <SelectItem value="0-100">0 - 100 m²</SelectItem>
                                        <SelectItem value="100-200">100 - 200 m²</SelectItem>
                                        <SelectItem value="200-500">200 - 500 m²</SelectItem>
                                        <SelectItem value="500+">500+ m²</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={locationFilter} onValueChange={setLocationFilter}>
                                    <SelectTrigger className="bg-white">
                                        <SelectValue placeholder="Location" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Locations</SelectItem>
                                        <SelectItem value="jakarta">Jakarta</SelectItem>
                                        <SelectItem value="tangerang">Tangerang</SelectItem>
                                        <SelectItem value="bogor">Bogor</SelectItem>
                                        <SelectItem value="bekasi">Bekasi</SelectItem>
                                        <SelectItem value="depok">Depok</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button
                                    className="bg-gradient-to-r from-[#5B0F1A] to-[#7A1424] hover:from-[#7A1424] hover:to-[#5B0F1A] text-white"
                                    onClick={() => fetchProperties()}
                                >
                                    Apply Filters
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={handleResetFilters}
                                    className="border-gray-200 hover:bg-gray-50"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Reset All
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Results Header & View Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <p className="text-sm text-muted-foreground">
                        Showing <span className="font-bold text-foreground">{startIndex + 1}-{endIndex}</span> of <span className="font-bold text-foreground">{displayedCount}</span> properties
                        {activeFiltersCount > 0 && (
                            <Badge variant="secondary" className="ml-2 bg-[#5B0F1A]/10 text-[#5B0F1A]">
                                Filtered
                            </Badge>
                        )}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[180px] border-gray-200 bg-white">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="price-low">Price: Low to High</SelectItem>
                            <SelectItem value="price-high">Price: High to Low</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewMode('grid')}
                            className={`h-9 w-9 p-0 ${viewMode === 'grid'
                                ? 'bg-white text-[#5B0F1A] shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Grid3X3 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewMode('list')}
                            className={`h-9 w-9 p-0 ${viewMode === 'list'
                                ? 'bg-white text-[#5B0F1A] shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Property Grid/List */}
            {currentProperties.length === 0 ? (
                <Card className="border-2 border-dashed border-gray-200">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="p-4 bg-gray-100 rounded-full mb-4">
                            <Building2 className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {totalCount === 0 ? "No properties yet" : "No properties match your filters"}
                        </h3>
                        <p className="text-muted-foreground mb-6 max-w-sm">
                            {totalCount === 0
                                ? "Get started by creating your first property listing"
                                : "Try adjusting your search criteria or filters"}
                        </p>
                        {totalCount === 0 ? (
                            <Button
                                onClick={handleCreate}
                                className="bg-gradient-to-r from-[#5B0F1A] to-[#7A1424] hover:from-[#7A1424] hover:to-[#5B0F1A] text-white"
                            >
                                <PlusCircle size={18} className="mr-2" />
                                Create First Property
                            </Button>
                        ) : (
                            <Button
                                onClick={handleResetFilters}
                                variant="outline"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Clear All Filters
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className={`grid gap-6 ${viewMode === 'grid'
                        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                        : 'grid-cols-1'
                        }`}>
                        {currentProperties.map((property) => (
                            <PropertyCard
                                key={property.id}
                                property={property}
                                onEdit={handleEdit}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-12 gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="border-gray-200 hover:border-[#5B0F1A] hover:text-[#5B0F1A] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            {getPageNumbers().map((page, index) => (
                                page === '...' ? (
                                    <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                                        ...
                                    </span>
                                ) : (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? 'default' : 'outline'}
                                        size="icon"
                                        onClick={() => handlePageChange(page as number)}
                                        className={
                                            currentPage === page
                                                ? 'bg-[#5B0F1A] hover:bg-[#7A1424] text-white'
                                                : 'border-gray-200 hover:border-[#5B0F1A] hover:text-[#5B0F1A]'
                                        }
                                    >
                                        {page}
                                    </Button>
                                )
                            ))}

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="border-gray-200 hover:border-[#5B0F1A] hover:text-[#5B0F1A] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="text-center mt-4">
                            <p className="text-sm text-muted-foreground">
                                Page <span className="font-semibold text-[#5B0F1A]">{currentPage}</span> of <span className="font-semibold text-[#5B0F1A]">{totalPages}</span>
                            </p>
                        </div>
                    )}
                </>
            )}

            {/* Modals */}
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