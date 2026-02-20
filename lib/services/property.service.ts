import { apiFetch } from "../http";
import { apiAdminFetch } from "../http";
import { imageFetch } from "../http";
import { GetAllPropertyResponse } from "../types/property";
import { Property, User, DashboardStats } from "../types/property";
import { GetPropertiesCountResponse } from "../types/property";

/* ─────────────────────────────────────────────
   Filter params — matches API docs exactly
───────────────────────────────────────────── */
export interface PropertyFilterParams {
    page?: number;
    limit?: number;
    sale_type?: string;          // 'jual' | 'sewa'
    property_type_id?: number;
    province?: string;
    regency?: string;
    min_price?: number;
    max_price?: number;
    min_building_area?: number;
    max_building_area?: number;
    min_land_area?: number;
    max_land_area?: number;
    certificate?: string;
    keyword?: string;            // search by title/address
    sort?: string;               // e.g. 'newest', 'price_asc', 'price_desc'
}

/* ─────────────────────────────────────────────
   Build query string — skips undefined/null/'all' values
───────────────────────────────────────────── */
function buildQuery(params: Record<string, any>): string {
    const q = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== '' && value !== 'all') {
            q.set(key, String(value));
        }
    }
    const str = q.toString();
    return str ? `?${str}` : '';
}

/* ─────────────────────────────────────────────
   getAllProperties — now accepts full filter params
   Falls back to simple page/limit if no filters given
───────────────────────────────────────────── */
export function getAllProperties(params: PropertyFilterParams = {}) {
    const { page = 1, limit = 12, ...rest } = params;
    const query = buildQuery({ page, limit, ...rest });
    return apiFetch<GetAllPropertyResponse>(
        `/api/properties${query}`,
        { method: "GET" }
    );
}

/* ─────────────────────────────────────────────
   getPropertiesCount — with optional filters
   so the count matches the current filter state
───────────────────────────────────────────── */
export async function getPropertiesCount(params: Omit<PropertyFilterParams, 'page' | 'limit'> = {}): Promise<number> {
    const query = buildQuery(params);
    const res = await apiFetch<GetPropertiesCountResponse>(
        `/api/properties/count${query}`,
        { method: "GET" }
    );
    return res.data.count;
}

export async function uploadPropertyImages(propertyId: number, files: File[]) {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    return imageFetch(`/api/agent/properties/${propertyId}/images`, formData);
}

export async function createProperty(property: Property): Promise<Property> {
    return apiAdminFetch<Property>("/api/agent/properties", {
        method: "POST",
        body: JSON.stringify(property),
    });
}

export async function updateProperty(id: number, property: Property): Promise<Property> {
    return apiAdminFetch<Property>(`/api/agent/properties/${id}`, {
        method: "PATCH",
        body: JSON.stringify(property),
    });
}

export async function deleteProperty(id: number): Promise<void> {
    return apiAdminFetch<void>(`/api/agent/properties/${id}`, { method: "DELETE" });
}

export async function getPropertyById(id: string | number) {
    return apiFetch(`/api/properties/${id}`, { method: "GET" });
}

export async function getPropertyImages(propertyId: number) {
    return apiAdminFetch<{ data: { id: number; property_id: number; url: string }[] }>(
        `/api/properties/${propertyId}/images`
    );
}

export async function getPropertyImagesUser(propertyId: number) {
    return apiFetch<{ data: { id: number; property_id: number; url: string }[] }>(
        `/api/properties/${propertyId}/images`
    );
}

export async function setCoverImage(propertyId: number, imageId: number) {
    return apiAdminFetch<void>(
        `/api/agent/properties/${propertyId}/images/${imageId}`,
        { method: "PATCH" }
    );
}

export async function deletePropertyImage(propertyId: number, imageId: number) {
    return apiAdminFetch<void>(
        `/api/agent/properties/${propertyId}/images/${imageId}`,
        { method: "DELETE" }
    );
}