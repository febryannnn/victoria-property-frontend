/**
 * Geocoding utility untuk convert address ke coordinates
 * Menggunakan Nominatim OpenStreetMap API (Free, no API key required)
 */

export interface Coordinates {
    lat: number;
    lng: number;
}

/**
 * Geocode address menggunakan Nominatim API
 */
export async function geocodeAddress(address: string): Promise<Coordinates | null> {
    try {
        const encodedAddress = encodeURIComponent(address);
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`,
            {
                headers: {
                    'User-Agent': 'VictoriaProperty/1.0', // Required by Nominatim
                },
            }
        );

        if (!response.ok) {
            console.error('Geocoding failed:', response.statusText);
            return null;
        }

        const data = await response.json();

        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
            };
        }

        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}

/**
 * Get coordinates untuk Indonesia cities
 * Fallback jika geocoding gagal
 */
export function getCityCoordinates(city: string): Coordinates {
    const cityCoordinates: { [key: string]: Coordinates } = {
        // Jawa Timur
        'surabaya': { lat: -7.2575, lng: 112.7521 },
        'malang': { lat: -7.9666, lng: 112.6326 },
        'sidoarjo': { lat: -7.4478, lng: 112.7183 },
        'gresik': { lat: -7.1554, lng: 112.6540 },
        'mojokerto': { lat: -7.4664, lng: 112.4340 },
        'pasuruan': { lat: -7.6453, lng: 112.9075 },
        'probolinggo': { lat: -7.7543, lng: 113.2159 },
        'jember': { lat: -8.1721, lng: 113.6993 },
        'banyuwangi': { lat: -8.2193, lng: 114.3675 },
        'kediri': { lat: -7.8169, lng: 112.0101 },
        'blitar': { lat: -8.0983, lng: 112.1681 },
        'tulungagung': { lat: -8.0656, lng: 111.9027 },
        'madiun': { lat: -7.6298, lng: 111.5239 },
        'ngawi': { lat: -7.4038, lng: 111.4462 },
        'magetan': { lat: -7.6471, lng: 111.3486 },
        'ponorogo': { lat: -7.8661, lng: 111.4618 },
        'pacitan': { lat: -8.2011, lng: 111.0926 },
        'trenggalek': { lat: -8.0503, lng: 111.7087 },
        'nganjuk': { lat: -7.6054, lng: 111.9037 },
        'bojonegoro': { lat: -7.1502, lng: 111.8824 },
        'tuban': { lat: -6.8974, lng: 111.9621 },
        'lamongan': { lat: -7.1167, lng: 112.4167 },
        'jombang': { lat: -7.5459, lng: 112.2336 },

        // DKI Jakarta
        'jakarta': { lat: -6.2088, lng: 106.8456 },
        'jakarta pusat': { lat: -6.1862, lng: 106.8063 },
        'jakarta selatan': { lat: -6.2615, lng: 106.8106 },
        'jakarta timur': { lat: -6.2250, lng: 106.9004 },
        'jakarta barat': { lat: -6.1684, lng: 106.7594 },
        'jakarta utara': { lat: -6.1385, lng: 106.8633 },

        // Jawa Barat
        'bandung': { lat: -6.9175, lng: 107.6191 },
        'bekasi': { lat: -6.2383, lng: 106.9756 },
        'bogor': { lat: -6.5950, lng: 106.8166 },
        'depok': { lat: -6.4025, lng: 106.7942 },
        'cirebon': { lat: -6.7063, lng: 108.5571 },
        'sukabumi': { lat: -6.9278, lng: 106.9269 },
        'tasikmalaya': { lat: -7.3274, lng: 108.2207 },
        'tangerang': { lat: -6.1781, lng: 106.6300 },

        // Jawa Tengah
        'semarang': { lat: -6.9667, lng: 110.4167 },
        'solo': { lat: -7.5705, lng: 110.8285 },
        'yogyakarta': { lat: -7.7956, lng: 110.3695 },
        'magelang': { lat: -7.4797, lng: 110.2175 },
        'purwokerto': { lat: -7.4246, lng: 109.2379 },
        'tegal': { lat: -6.8694, lng: 109.1402 },
        'pekalongan': { lat: -6.8886, lng: 109.6753 },
        'salatiga': { lat: -7.3317, lng: 110.4920 },

        // Bali
        'denpasar': { lat: -8.6705, lng: 115.2126 },
        'ubud': { lat: -8.5069, lng: 115.2625 },
        'kuta': { lat: -8.7184, lng: 115.1686 },
        'sanur': { lat: -8.7088, lng: 115.2625 },

        // Sumatera
        'medan': { lat: 3.5952, lng: 98.6722 },
        'palembang': { lat: -2.9761, lng: 104.7754 },
        'pekanbaru': { lat: 0.5071, lng: 101.4478 },
        'padang': { lat: -0.9471, lng: 100.4172 },
        'bandar lampung': { lat: -5.4500, lng: 105.2667 },
        'jambi': { lat: -1.6101, lng: 103.6131 },
        'bengkulu': { lat: -3.8008, lng: 102.2655 },

        // Kalimantan
        'banjarmasin': { lat: -3.3194, lng: 114.5906 },
        'balikpapan': { lat: -1.2379, lng: 116.8529 },
        'samarinda': { lat: -0.5022, lng: 117.1536 },
        'pontianak': { lat: -0.0263, lng: 109.3425 },
        'palangkaraya': { lat: -2.2116, lng: 113.9131 },

        // Sulawesi
        'makassar': { lat: -5.1477, lng: 119.4327 },
        'manado': { lat: 1.4748, lng: 124.8421 },
        'palu': { lat: -0.8999, lng: 119.8707 },
        'kendari': { lat: -3.9778, lng: 122.5150 },
        'gorontalo': { lat: 0.5435, lng: 123.0685 },

        // Papua
        'jayapura': { lat: -2.5920, lng: 140.6689 },
        'sorong': { lat: -0.8667, lng: 131.2500 },

        // Maluku
        'ambon': { lat: -3.6954, lng: 128.1814 },
        'ternate': { lat: 0.7896, lng: 127.3634 },

        // Nusa Tenggara
        'mataram': { lat: -8.5833, lng: 116.1167 },
        'kupang': { lat: -10.1718, lng: 123.6075 },
    };

    const normalizedCity = city.toLowerCase().trim();

    // Try exact match first
    if (cityCoordinates[normalizedCity]) {
        return cityCoordinates[normalizedCity];
    }

    // Try partial match
    for (const [key, coords] of Object.entries(cityCoordinates)) {
        if (normalizedCity.includes(key) || key.includes(normalizedCity)) {
            return coords;
        }
    }

    // Default to Surabaya if no match
    return cityCoordinates['surabaya'];
}

/**
 * Get coordinates untuk property
 * Mencoba geocoding dulu, jika gagal fallback ke city coordinates
 */
export async function getPropertyCoordinates(
    address: string,
    district: string,
    regency: string,
    province: string
): Promise<Coordinates> {
    // Try full address first
    const fullAddress = `${address}, ${district}, ${regency}, ${province}, Indonesia`;
    let coords = await geocodeAddress(fullAddress);

    if (coords) {
        return coords;
    }

    // Try regency + province
    const regionAddress = `${regency}, ${province}, Indonesia`;
    coords = await geocodeAddress(regionAddress);

    if (coords) {
        return coords;
    }

    // Fallback to city coordinates
    return getCityCoordinates(regency);
}