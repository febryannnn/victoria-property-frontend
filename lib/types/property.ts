export interface Property {
    id: number;
    title: string;
    description: string;
    price: number;
    status: number;
    province: string;
    regency: string;
    district: string;
    address: string;
    building_area: number;
    land_area: number;
    electricity: number;
    water_source: number;
    bedrooms: number;
    bathrooms: number;
    floors: number;
    garage: number;
    carport: number;
    certificate: string;
    year_constructed: number;
    sale_type: string;
    created_at: string;
    cover_image_url: string;
    property_type_id: number;
    user_id: number;
}

export interface GetAllPropertyResponse {
    success: boolean;
    message: string;
    data: {
        property: Property[];
    };
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    phone?: string;
    created_at: string;
    properties_count?: number;
}

export interface DashboardStats {
    total_properties: number;
    total_users: number;
    total_sales: number;
    total_rentals: number;
    recent_properties: Property[];
}

export interface GetPropertiesCountResponse {
    data: {
        count: number;
    };
    message: string;
    success: boolean;
}