import { apiFetch } from "../http";
import { apiAdminFetch } from "../http"
import { GetAllPropertyResponse } from "../types/property";
import { Property, User, DashboardStats } from "../types/property";

export function getAllProperties(prop_page = 1, prop_limit = 10) {
    return apiFetch<GetAllPropertyResponse>(
        `/api/properties?page=${prop_page}&limit=${prop_limit}`,
        {
            method: "GET",
        }
    );
}

import { imageFetch } from "./image.service";

export async function uploadPropertyImages(
    propertyId: number,
    files: File[]
) {
    const formData = new FormData();

    files.forEach((file) => {
        formData.append("images", file);
    });

    return imageFetch(
        `/api/agent/properties/${propertyId}/images`,
        formData
    );
}

export async function createProperty(property: Property): Promise<Property> {
    return apiAdminFetch<Property>("/api/agent/properties", {
        method: "POST",
        body: JSON.stringify(property),
    });
}

export async function updateProperty(id: number, property: Property): Promise<Property> {
    return apiFetch<Property>(`/api/properties/${id}`, {
        method: "PUT",
        body: JSON.stringify(property),
    });
}

export async function deleteProperty(id: number): Promise<void> {
    return apiAdminFetch<void>(`/api/agent/properties/${id}`, {
        method: "DELETE",
    });
}

export async function getPropertyById(id: string | number) {
    return apiFetch(`/api/properties/${id}`, {
        method: "GET",
    });
}

