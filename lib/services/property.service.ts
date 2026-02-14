import { apiFetch } from "../http";
import { GetAllPropertyResponse } from "../types/property";

export function getAllProperties(prop_page = 1, prop_limit = 10) {
    return apiFetch<GetAllPropertyResponse>(
        `/api/properties?page=${prop_page}&limit=${prop_limit}`,
        {
            method: "GET",
        }
    );
}

