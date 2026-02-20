// lib/favorites.ts
import { apiAuthFetch } from "../http";

export interface FavoriteProperty {
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
  bedrooms: number;
  bathrooms: number;
  cover_image_url: string;
  property_type_id: number;
}

interface GetFavoritesResponse {
  data: {
    property: FavoriteProperty[];
  };
  message: string;
  success: boolean;
}

export async function getUserFavorites(): Promise<FavoriteProperty[]> {
  const res = await apiAuthFetch<GetFavoritesResponse>("/api/favorites");
  return res.data.property ?? [];
}

// Fungsi untuk mendapatkan array property_id yang di-favorite user
export async function getUserFavoriteIds(): Promise<number[]> {
  try {
    const favorites = await getUserFavorites();
    return favorites.map((fav) => fav.id);
  } catch {
    // Jika user belum login atau error, return array kosong
    return [];
  }
}