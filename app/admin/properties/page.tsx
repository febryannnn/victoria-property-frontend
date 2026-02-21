"use client";

import { useState, useEffect, useCallback } from "react";
import {
    SlidersHorizontal, Grid3X3, List, ChevronDown,
    PlusCircle, Trash2, X, Filter, TrendingUp, Building2,
    Sparkles, ChevronLeft, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyFormModal from "@/components/properties/PropertyFormModal";
import DeletePropertyModal from "@/components/properties/DeletePropertyModal";
import { Property } from "@/lib/types/property";
import { createProperty, updateProperty, deleteProperties } from "@/lib/services/dashboard.service";
import { getAllProperties, getPropertiesCount, PropertyFilterParams } from "@/lib/services/property.service";
import SearchAutocomplete, { SuggestionItem } from "@/components/SearchAutoComplete";

export default function PropertiesPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [statsCount, setStatsCount] = useState({ total: 0, forSale: 0 });

    const [showFormModal, setShowFormModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [loading, setLoading] = useState(true);

    // ── Filter states ──
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [locationFilter, setLocationFilter] = useState("all");   // regency
    const [provinceFilter, setProvinceFilter] = useState("all");   // province ← BARU
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [propertyType, setPropertyType] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [priceRange, setPriceRange] = useState("all");
    const [bedroomsFilter, setBedroomsFilter] = useState("all");
    const [bathroomsFilter, setBathroomsFilter] = useState("all");
    const [landAreaFilter, setLandAreaFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12);

    // Debounce search 400ms (dipakai saat user ketik manual di autocomplete)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const activeFiltersCount = [
        debouncedSearch.trim() !== "",
        propertyType !== "all",
        statusFilter !== "all",
        priceRange !== "all",
        bedroomsFilter !== "all",
        bathroomsFilter !== "all",
        landAreaFilter !== "all",
        locationFilter !== "all",
        provinceFilter !== "all",
    ].filter(Boolean).length;

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const buildServerParams = useCallback((): PropertyFilterParams => {
        const params: PropertyFilterParams = { page: currentPage, limit: itemsPerPage };

        if (debouncedSearch.trim()) params.keyword = debouncedSearch.trim();
        if (statusFilter !== "all") params.sale_type = statusFilter === "sale" ? "jual" : "sewa";
        if (propertyType !== "all") params.property_type_id = parseInt(propertyType);
        if (locationFilter !== "all") params.regency = locationFilter;
        if (provinceFilter !== "all") params.province = provinceFilter;

        switch (priceRange) {
            case "0-1m": params.max_price = 1_000_000_000; break;
            case "1-3m": params.min_price = 1_000_000_000; params.max_price = 3_000_000_000; break;
            case "3-5m": params.min_price = 3_000_000_000; params.max_price = 5_000_000_000; break;
            case "5-10m": params.min_price = 5_000_000_000; params.max_price = 10_000_000_000; break;
            case "10m+": params.min_price = 10_000_000_000; break;
        }
        switch (landAreaFilter) {
            case "0-100": params.max_land_area = 100; break;
            case "100-200": params.min_land_area = 100; params.max_land_area = 200; break;
            case "200-500": params.min_land_area = 200; params.max_land_area = 500; break;
            case "500+": params.min_land_area = 500; break;
        }
        switch (sortBy) {
            case "price-low": params.sort = "price_asc"; break;
            case "price-high": params.sort = "price_desc"; break;
            default: params.sort = "newest";
        }

        return params;
    }, [currentPage, itemsPerPage, debouncedSearch, statusFilter, propertyType, locationFilter, provinceFilter, priceRange, landAreaFilter, bathroomsFilter, bedroomsFilter, sortBy]);

    useEffect(() => { fetchProperties(); }, [buildServerParams]);
    useEffect(() => { fetchStats(); }, []);

    async function fetchStats() {
        try {
            const [total, forSale] = await Promise.all([
                getPropertiesCount(),
                getPropertiesCount({ sale_type: "jual" }),
            ]);
            setStatsCount({ total, forSale });
        } catch (e) { console.error(e); }
    }

    async function fetchProperties() {
        try {
            setLoading(true);
            const params = buildServerParams();
            const res = await getAllProperties(params);
            const propertyData = res.data?.property || res.data || [];
            const serverTotal = res.data?.total ?? res.total ?? null;
            setProperties(mapProperties(propertyData));
            if (serverTotal !== null) {
                setTotalCount(serverTotal);
            } else {
                const { page: _p, limit: _l, ...filterOnly } = params;
                setTotalCount(await getPropertiesCount(filterOnly));
            }
        } catch (e) {
            console.error("Failed to fetch properties:", e);
        } finally {
            setLoading(false);
        }
    }

    function mapProperties(data: any[]): Property[] {
        return (data || []).map((item: any) => ({
            id: item.id, title: item.title, description: item.description,
            price: item.price, status: item.status, province: item.province,
            regency: item.regency, district: item.district, address: item.address,
            building_area: item.building_area, land_area: item.land_area,
            electricity: item.electricity, water_source: item.water_source,
            bedrooms: item.bedrooms, bathrooms: item.bathrooms, floors: item.floors,
            garage: item.garage, carport: item.carport, certificate: item.certificate,
            year_constructed: item.year_constructed, sale_type: item.sale_type,
            created_at: item.created_at,
            cover_image_url: item.cover_image_url ? `http://localhost:8080${item.cover_image_url}` : null,
            property_type_id: item.property_type_id, user_id: item.user_id,
        }));
    }

    const handleFilterChange = (setter: (v: string) => void) => (value: string) => {
        setter(value); setCurrentPage(1);
    };

    const handleResetFilters = () => {
        setSearchQuery(""); setDebouncedSearch("");
        setPropertyType("all"); setStatusFilter("all");
        setPriceRange("all"); setBedroomsFilter("all");
        setBathroomsFilter("all"); setLandAreaFilter("all");
        setLocationFilter("all"); setProvinceFilter("all");
        setSortBy("newest"); setCurrentPage(1);
    };

    // ── Handler autocomplete ──
    const handleAutocompleteSearch = (label: string, filterParams: SuggestionItem['filterParams']) => {
        // Reset semua filter lokasi & keyword dulu
        setSearchQuery('');
        setDebouncedSearch('');
        setLocationFilter('all');
        setProvinceFilter('all');

        // Terapkan sesuai tipe suggestion
        if (filterParams.keyword) {
            setSearchQuery(filterParams.keyword);
            setDebouncedSearch(filterParams.keyword); // langsung tanpa debounce
        }
        if (filterParams.regency) setLocationFilter(filterParams.regency);
        if (filterParams.province) setProvinceFilter(filterParams.province);

        setCurrentPage(1);
    };

    const handleCreateProperty = async (property: Property) => {
        try { await createProperty(property); await fetchProperties(); await fetchStats(); }
        catch (e) { console.error(e); }
    };

    const handleUpdateProperty = async (property: Property) => {
        try { if (property.id) { await updateProperty(property.id, property); await fetchProperties(); } }
        catch (e) { console.error(e); }
    };

    const handleDeleteProperties = async (ids: number[]) => {
        try { await deleteProperties(ids); await fetchProperties(); await fetchStats(); }
        catch (e) { console.error(e); }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        if (totalPages <= 5) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
        else if (currentPage <= 3) { for (let i = 1; i <= 4; i++) pages.push(i); pages.push("..."); pages.push(totalPages); }
        else if (currentPage >= totalPages - 2) { pages.push(1); pages.push("..."); for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i); }
        else { pages.push(1); pages.push("..."); for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i); pages.push("..."); pages.push(totalPages); }
        return pages;
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + properties.length, totalCount);

    if (loading && properties.length === 0) {
        return (
            <div className="p-10 flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#5B0F1A] border-t-transparent" />
                    <p className="text-sm text-muted-foreground">Loading properties...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">

            {/* ── Header ── */}
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
                                    {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} active
                                </Badge>
                            )}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => setShowDeleteModal(true)}
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all"
                            disabled={statsCount.total === 0}
                        >
                            <Trash2 size={18} className="mr-2" /> Delete
                        </Button>
                        <Button
                            onClick={() => { setSelectedProperty(null); setFormMode("create"); setShowFormModal(true); }}
                            className="bg-gradient-to-r from-[#5B0F1A] to-[#7A1424] hover:from-[#7A1424] hover:to-[#5B0F1A] text-white shadow-lg shadow-[#5B0F1A]/20 transition-all"
                        >
                            <PlusCircle size={18} className="mr-2" /> Add Property
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="border-l-4 border-l-[#5B0F1A] bg-gradient-to-br from-white to-gray-50">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div><p className="text-sm text-muted-foreground font-medium">Total Properties</p><p className="text-3xl font-bold text-[#5B0F1A] mt-1">{statsCount.total}</p></div>
                            <div className="p-3 bg-[#5B0F1A]/10 rounded-lg"><Building2 className="h-6 w-6 text-[#5B0F1A]" /></div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-emerald-500 bg-gradient-to-br from-white to-emerald-50/30">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div><p className="text-sm text-muted-foreground font-medium">Active Listings</p><p className="text-3xl font-bold text-emerald-600 mt-1">{statsCount.total}</p></div>
                            <div className="p-3 bg-emerald-100 rounded-lg"><Sparkles className="h-6 w-6 text-emerald-600" /></div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-white to-blue-50/30">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div><p className="text-sm text-muted-foreground font-medium">For Sale</p><p className="text-3xl font-bold text-blue-600 mt-1">{statsCount.forSale}</p></div>
                            <div className="p-3 bg-blue-100 rounded-lg"><TrendingUp className="h-6 w-6 text-blue-600" /></div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-amber-500 bg-gradient-to-br from-white to-amber-50/30">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div><p className="text-sm text-muted-foreground font-medium">Showing</p><p className="text-3xl font-bold text-amber-600 mt-1">{properties.length}</p></div>
                            <div className="p-3 bg-amber-100 rounded-lg"><Filter className="h-6 w-6 text-amber-600" /></div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* ── Search & Filter Card ── */}
            <Card className="shadow-md border-0 bg-gradient-to-br from-white to-gray-50/50">
                <CardContent className="p-6 space-y-4">

                    {/* ── Search Autocomplete row ── */}
                    <div className="flex flex-col lg:flex-row gap-4 items-start">
                        {/* Autocomplete — menggantikan Input search lama */}
                        <div className="flex-1 min-w-0">
                            <SearchAutocomplete
                                placeholder="Search by title, city, province, or address..."
                                onSearch={handleAutocompleteSearch}
                            />
                        </div>

                        <div className="flex flex-wrap gap-3 shrink-0">
                            <Select value={propertyType} onValueChange={handleFilterChange(setPropertyType)}>
                                <SelectTrigger className="w-[100px] h-14 border-gray-200 bg-white"><SelectValue placeholder="Property Type" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="1">House</SelectItem>
                                    <SelectItem value="2">Apartment</SelectItem>
                                    <SelectItem value="3">Shophouse</SelectItem>
                                    <SelectItem value="4">Land</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={statusFilter} onValueChange={handleFilterChange(setStatusFilter)}>
                                <SelectTrigger className="w-[120px] h-14 border-gray-200 bg-white"><SelectValue placeholder="Status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="sale">For Sale</SelectItem>
                                    <SelectItem value="rent">For Rent</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={priceRange} onValueChange={handleFilterChange(setPriceRange)}>
                                <SelectTrigger className="w-[120px] h-14 border-gray-200 bg-white"><SelectValue placeholder="Price Range" /></SelectTrigger>
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
                                className={`h-14 ${showFilters ? "bg-[#5B0F1A] hover:bg-[#7A1424]" : "border-gray-200 hover:bg-gray-50"}`}
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <SlidersHorizontal className="h-4 w-4 mr-2" />
                                Advanced
                                {activeFiltersCount > 0 && <Badge className="ml-2 bg-white text-[#5B0F1A] text-xs">{activeFiltersCount}</Badge>}
                                <ChevronDown className={`h-4 w-4 ml-2 transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`} />
                            </Button>

                            {activeFiltersCount > 0 && (
                                <Button variant="ghost" className="h-14 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={handleResetFilters}>
                                    <X className="h-4 w-4 mr-2" /> Reset ({activeFiltersCount})
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Active location filter badges */}
                    {(locationFilter !== 'all' || provinceFilter !== 'all') && (
                        <div className="flex flex-wrap gap-2">
                            {locationFilter !== 'all' && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#5B0F1A]/8 border border-[#5B0F1A]/20 rounded-full text-sm text-[#5B0F1A]">
                                    <span className="text-xs">📍</span>
                                    <span className="font-medium">{locationFilter}</span>
                                    <button onClick={() => { setLocationFilter('all'); setCurrentPage(1); }} className="ml-1 hover:text-[#7A1424]">
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                            {provinceFilter !== 'all' && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-700">
                                    <span className="text-xs">🌐</span>
                                    <span className="font-medium">{provinceFilter}</span>
                                    <button onClick={() => { setProvinceFilter('all'); setCurrentPage(1); }} className="ml-1 hover:text-blue-900">
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Advanced filter panel */}
                    {showFilters && (
                        <div className="pt-4 border-t border-gray-200 animate-in slide-in-from-top-2 duration-300">
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                {[
                                    { value: bedroomsFilter, setter: setBedroomsFilter, placeholder: "Bedrooms", items: [["all", "Any Beds"], ["1", "1 Bedroom"], ["2", "2 Bedrooms"], ["3", "3 Bedrooms"], ["4", "4+ Bedrooms"]] },
                                    { value: bathroomsFilter, setter: setBathroomsFilter, placeholder: "Bathrooms", items: [["all", "Any Baths"], ["1", "1 Bathroom"], ["2", "2 Bathrooms"], ["3", "3+ Bathrooms"]] },
                                    { value: landAreaFilter, setter: setLandAreaFilter, placeholder: "Land Area", items: [["all", "Any Size"], ["0-100", "0-100 m²"], ["100-200", "100-200 m²"], ["200-500", "200-500 m²"], ["500+", "500+ m²"]] },
                                    { value: sortBy, setter: setSortBy, placeholder: "Sort by", items: [["newest", "Newest First"], ["price-low", "Price: Low to High"], ["price-high", "Price: High to Low"]] },
                                ].map(({ value, setter, placeholder, items }) => (
                                    <Select key={placeholder} value={value} onValueChange={handleFilterChange(setter)}>
                                        <SelectTrigger className="bg-white"><SelectValue placeholder={placeholder} /></SelectTrigger>
                                        <SelectContent>
                                            {items.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                ))}
                                <Button variant="outline" onClick={handleResetFilters} className="border-gray-200 hover:bg-gray-50">
                                    <X className="h-4 w-4 mr-2" /> Reset All
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* ── Results Header ── */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <p className="text-sm text-muted-foreground">
                        Showing <span className="font-bold text-foreground">{totalCount === 0 ? 0 : startIndex + 1}–{endIndex}</span> of{" "}
                        <span className="font-bold text-foreground">{totalCount}</span> properties
                    </p>
                    {activeFiltersCount > 0 && <Badge variant="secondary" className="bg-[#5B0F1A]/10 text-[#5B0F1A]">Filtered</Badge>}
                    {loading && properties.length > 0 && (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#5B0F1A] border-t-transparent" />
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <Select value={sortBy} onValueChange={handleFilterChange(setSortBy)}>
                        <SelectTrigger className="w-[180px] border-gray-200 bg-white"><SelectValue placeholder="Sort by" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="price-low">Price: Low to High</SelectItem>
                            <SelectItem value="price-high">Price: High to Low</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                        {(["grid", "list"] as const).map((mode) => (
                            <Button key={mode} variant="ghost" size="sm" onClick={() => setViewMode(mode)}
                                className={`h-9 w-9 p-0 ${viewMode === mode ? "bg-white text-[#5B0F1A] shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                                {mode === "grid" ? <Grid3X3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Property Grid ── */}
            {properties.length === 0 && !loading ? (
                <Card className="border-2 border-dashed border-gray-200">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="p-4 bg-gray-100 rounded-full mb-4"><Building2 className="h-10 w-10 text-gray-400" /></div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {statsCount.total === 0 ? "No properties yet" : "No properties match your filters"}
                        </h3>
                        <p className="text-muted-foreground mb-6 max-w-sm">
                            {statsCount.total === 0 ? "Get started by creating your first property listing" : "Try adjusting your search criteria or filters"}
                        </p>
                        {statsCount.total === 0 ? (
                            <Button onClick={() => { setSelectedProperty(null); setFormMode("create"); setShowFormModal(true); }}
                                className="bg-gradient-to-r from-[#5B0F1A] to-[#7A1424] text-white">
                                <PlusCircle size={18} className="mr-2" /> Create First Property
                            </Button>
                        ) : (
                            <Button onClick={handleResetFilters} variant="outline"><X className="h-4 w-4 mr-2" /> Clear All Filters</Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className={`grid gap-6 transition-opacity duration-200 ${loading ? "opacity-50 pointer-events-none" : "opacity-100"} ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"}`}>
                        {properties.map((property) => (
                            <PropertyCard
                                key={property.id}
                                property={property}
                                onEdit={(p) => { setSelectedProperty(p); setFormMode("edit"); setShowFormModal(true); }}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <>
                            <div className="flex justify-center items-center mt-12 gap-2">
                                <Button variant="outline" size="icon" onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1 || loading}
                                    className="border-gray-200 hover:border-[#5B0F1A] hover:text-[#5B0F1A] disabled:opacity-50">
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>

                                {getPageNumbers().map((page, index) =>
                                    page === "..." ? (
                                        <span key={`e-${index}`} className="px-2 text-gray-400">...</span>
                                    ) : (
                                        <Button key={page} variant={currentPage === page ? "default" : "outline"} size="icon"
                                            onClick={() => handlePageChange(page as number)} disabled={loading}
                                            className={currentPage === page ? "bg-[#5B0F1A] hover:bg-[#7A1424] text-white" : "border-gray-200 hover:border-[#5B0F1A] hover:text-[#5B0F1A]"}>
                                            {page}
                                        </Button>
                                    )
                                )}

                                <Button variant="outline" size="icon" onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages || loading}
                                    className="border-gray-200 hover:border-[#5B0F1A] hover:text-[#5B0F1A] disabled:opacity-50">
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="text-center mt-4">
                                <p className="text-sm text-muted-foreground">
                                    Page <span className="font-semibold text-[#5B0F1A]">{currentPage}</span> of{" "}
                                    <span className="font-semibold text-[#5B0F1A]">{totalPages}</span>
                                </p>
                            </div>
                        </>
                    )}
                </>
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