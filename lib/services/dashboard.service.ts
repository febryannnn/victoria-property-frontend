import { Property, User, DashboardStats } from "../types/property";
import { apiFetch } from "../http";

// Properties API
export async function getProperties(): Promise<Property[]> {
    return apiFetch<Property[]>("/properties");
}

export async function createProperty(property: Property): Promise<Property> {
    return apiFetch<Property>("/properties", {
        method: "POST",
        body: JSON.stringify(property),
    });
}

export async function updateProperty(id: number, property: Property): Promise<Property> {
    return apiFetch<Property>(`/properties/${id}`, {
        method: "PUT",
        body: JSON.stringify(property),
    });
}

export async function deleteProperties(ids: number[]): Promise<void> {
    return apiFetch<void>("/properties", {
        method: "DELETE",
        body: JSON.stringify({ ids }),
    });
}

// Users API
export async function getUsers(): Promise<User[]> {
    return apiFetch<User[]>("/users");
}

// Dashboard API
export async function getDashboardStats(): Promise<DashboardStats> {
    return apiFetch<DashboardStats>("/dashboard/stats");
}