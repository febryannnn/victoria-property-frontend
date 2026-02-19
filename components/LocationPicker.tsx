"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
    MapPin, LocateFixed, Loader2, AlertCircle,
    SlidersHorizontal, ChevronDown, ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationPickerProps {
    province: string;
    regency: string;
    district: string;
    address: string;
    latitude?: number;
    longitude?: number;
    onChange: (lat: number, lng: number) => void;
}

interface GeoResult {
    lat: string;
    lon: string;
    display_name: string;
}

// Default center: Indonesia
const DEFAULT_LAT = -2.5489;
const DEFAULT_LNG = 118.0149;
const DEFAULT_ZOOM = 5;

export default function LocationPicker({
    province, regency, district, address,
    latitude, longitude, onChange,
}: LocationPickerProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMap = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const isInit = useRef(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [displayName, setDisplayName] = useState<string | null>(null);
    const [showManual, setShowManual] = useState(false);
    const [manualLat, setManualLat] = useState("");
    const [manualLng, setManualLng] = useState("");
    const [mapReady, setMapReady] = useState(false);

    const hasCoords = !!(
        latitude && longitude && latitude !== 0 && longitude !== 0
    );

    /* ── Load Leaflet CSS + JS once ── */
    useEffect(() => {
        if (typeof window === "undefined" || isInit.current) return;
        isInit.current = true;

        if (!document.getElementById("leaflet-css")) {
            const link = document.createElement("link");
            link.id = "leaflet-css";
            link.rel = "stylesheet";
            link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
            document.head.appendChild(link);
        }

        if ((window as any).L) {
            setMapReady(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
        script.onload = () => setMapReady(true);
        document.body.appendChild(script);
    }, []);

    /* ── Init map after Leaflet loads ── */
    useEffect(() => {
        if (!mapReady || !mapRef.current || leafletMap.current) return;
        const L = (window as any).L;

        const initLat = hasCoords ? latitude! : DEFAULT_LAT;
        const initLng = hasCoords ? longitude! : DEFAULT_LNG;
        const initZoom = hasCoords ? 15 : DEFAULT_ZOOM;

        const map = L.map(mapRef.current, { zoomControl: true }).setView(
            [initLat, initLng], initZoom
        );

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
            maxZoom: 19,
        }).addTo(map);

        // Custom red marker icon
        const icon = L.divIcon({
            className: "",
            html: `<div style="
        width:32px;height:40px;position:relative;
        filter:drop-shadow(0 3px 6px rgba(0,0,0,0.35));
        cursor:grab;
      ">
        <svg viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C9.373 0 4 5.373 4 12c0 9 12 28 12 28s12-19 12-28C28 5.373 22.627 0 16 0z" fill="#5B0F1A"/>
          <circle cx="16" cy="12" r="5" fill="white"/>
        </svg>
      </div>`,
            iconSize: [32, 40],
            iconAnchor: [16, 40],
        });

        if (hasCoords) {
            const marker = L.marker([latitude!, longitude!], { draggable: true, icon }).addTo(map);
            marker.on("dragend", (e: any) => {
                const pos = e.target.getLatLng();
                onChange(parseFloat(pos.lat.toFixed(6)), parseFloat(pos.lng.toFixed(6)));
            });
            markerRef.current = marker;
        }

        // Click on map to place/move pin
        map.on("click", (e: any) => {
            const { lat, lng } = e.latlng;
            const roundedLat = parseFloat(lat.toFixed(6));
            const roundedLng = parseFloat(lng.toFixed(6));

            if (markerRef.current) {
                markerRef.current.setLatLng([roundedLat, roundedLng]);
            } else {
                const marker = L.marker([roundedLat, roundedLng], { draggable: true, icon }).addTo(map);
                marker.on("dragend", (ev: any) => {
                    const pos = ev.target.getLatLng();
                    onChange(parseFloat(pos.lat.toFixed(6)), parseFloat(pos.lng.toFixed(6)));
                });
                markerRef.current = marker;
            }
            onChange(roundedLat, roundedLng);
            setError(null);
            setDisplayName("Pin diletakkan secara manual di peta.");
        });

        leafletMap.current = map;
    }, [mapReady]);

    /* ── Sync map when coords change externally (geocode result) ── */
    useEffect(() => {
        if (!leafletMap.current || !mapReady || !hasCoords) return;
        const L = (window as any).L;
        const map = leafletMap.current;

        if (markerRef.current) {
            markerRef.current.setLatLng([latitude!, longitude!]);
        } else {
            const icon = L.divIcon({
                className: "",
                html: `<div style="width:32px;height:40px;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.35));cursor:grab;">
          <svg viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C9.373 0 4 5.373 4 12c0 9 12 28 12 28s12-19 12-28C28 5.373 22.627 0 16 0z" fill="#5B0F1A"/>
            <circle cx="16" cy="12" r="5" fill="white"/>
          </svg>
        </div>`,
                iconSize: [32, 40],
                iconAnchor: [16, 40],
            });
            const marker = L.marker([latitude!, longitude!], { draggable: true, icon }).addTo(map);
            marker.on("dragend", (e: any) => {
                const pos = e.target.getLatLng();
                onChange(parseFloat(pos.lat.toFixed(6)), parseFloat(pos.lng.toFixed(6)));
            });
            markerRef.current = marker;
        }

        map.flyTo([latitude!, longitude!], 15, { duration: 1.2 });
    }, [latitude, longitude, mapReady]);

    /* ── Geocoding ── */
    const buildQuery = (level: "full" | "district" | "regency") => {
        const parts: string[] = [];
        if (level === "full" && address.trim()) parts.push(address.trim());
        if (level !== "regency" && district.trim()) parts.push(district.trim());
        if (regency.trim()) parts.push(regency.trim());
        if (province.trim()) parts.push(province.trim());
        parts.push("Indonesia");
        return parts.join(", ");
    };

    const geocode = async (query: string): Promise<GeoResult | null> => {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=id`;
        const res = await fetch(url, {
            headers: { "Accept-Language": "id", "User-Agent": "VictoriaPropertyApp/1.0" },
        });
        if (!res.ok) throw new Error("Request failed");
        const data: GeoResult[] = await res.json();
        return data[0] ?? null;
    };

    const handleDetect = useCallback(async () => {
        if (!district && !regency && !province) {
            setError("Isi minimal Kecamatan, Kabupaten, atau Provinsi terlebih dahulu.");
            return;
        }
        setLoading(true);
        setError(null);
        setDisplayName(null);

        try {
            let result: GeoResult | null = null;
            let usedLevel = "alamat lengkap";

            result = await geocode(buildQuery("full"));
            if (!result) { usedLevel = "kecamatan"; result = await geocode(buildQuery("district")); }
            if (!result) { usedLevel = "kabupaten/kota"; result = await geocode(buildQuery("regency")); }

            if (!result) {
                setError("Lokasi tidak ditemukan. Pastikan data alamat sudah benar.");
                return;
            }

            const lat = parseFloat(parseFloat(result.lat).toFixed(6));
            const lng = parseFloat(parseFloat(result.lon).toFixed(6));
            onChange(lat, lng);
            setDisplayName(`Ditemukan di level ${usedLevel} · ${result.display_name}`);
        } catch {
            setError("Gagal mendeteksi lokasi. Periksa koneksi internet.");
        } finally {
            setLoading(false);
        }
    }, [province, regency, district, address, onChange]);

    /* ── Manual input apply ── */
    const handleManualApply = () => {
        const lat = parseFloat(manualLat);
        const lng = parseFloat(manualLng);
        if (isNaN(lat) || isNaN(lng)) {
            setError("Koordinat tidak valid.");
            return;
        }
        if (lat < -11 || lat > 6 || lng < 95 || lng > 141) {
            setError("Koordinat di luar wilayah Indonesia.");
            return;
        }
        setError(null);
        setDisplayName("Koordinat diset secara manual.");
        onChange(lat, lng);
        setShowManual(false);
        setManualLat("");
        setManualLng("");
    };

    return (
        <div className="space-y-3">
            {/* ── Header ── */}
            <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#5B0F1A]" />
                <span className="font-semibold text-[#5B0F1A] text-sm">Koordinat Lokasi</span>
                {hasCoords && (
                    <span className="ml-auto text-xs text-muted-foreground font-mono bg-gray-100 px-2 py-1 rounded">
                        {latitude!.toFixed(6)}, {longitude!.toFixed(6)}
                    </span>
                )}
            </div>

            {/* ── Action Buttons Row ── */}
            <div className="flex gap-2 flex-wrap">
                {/* Auto-detect */}
                <Button
                    type="button"
                    onClick={handleDetect}
                    disabled={loading}
                    className="flex-1 min-w-[160px] bg-[#5B0F1A] hover:bg-[#7A1424] text-white"
                >
                    {loading ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Mendeteksi...</>
                    ) : (
                        <><LocateFixed className="w-4 h-4 mr-2" />{hasCoords ? "Deteksi Ulang" : "Deteksi Otomatis"}</>
                    )}
                </Button>

                {/* Manual input toggle */}
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowManual((v) => !v)}
                    className="flex-1 min-w-[160px] border-[#5B0F1A] text-[#5B0F1A] hover:bg-[#5B0F1A] hover:text-white"
                >
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Input Manual
                    {showManual
                        ? <ChevronUp className="w-4 h-4 ml-2" />
                        : <ChevronDown className="w-4 h-4 ml-2" />
                    }
                </Button>
            </div>

            {/* ── Manual Input Panel ── */}
            {showManual && (
                <div className="border border-[#5B0F1A]/20 rounded-xl p-4 bg-[#5B0F1A]/5 space-y-3">
                    <p className="text-xs text-muted-foreground">
                        Masukkan koordinat secara langsung. Anda bisa mendapatkan koordinat dari Google Maps
                        (klik kanan → "What's here?").
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium text-[#5B0F1A] block mb-1">Latitude</label>
                            <input
                                type="number"
                                step="0.000001"
                                placeholder="-7.123456"
                                value={manualLat}
                                onChange={(e) => setManualLat(e.target.value)}
                                className="w-full h-9 text-sm border border-gray-200 rounded-lg px-3
                  focus:outline-none focus:ring-2 focus:ring-[#5B0F1A]/25 focus:border-[#5B0F1A]"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-[#5B0F1A] block mb-1">Longitude</label>
                            <input
                                type="number"
                                step="0.000001"
                                placeholder="110.123456"
                                value={manualLng}
                                onChange={(e) => setManualLng(e.target.value)}
                                className="w-full h-9 text-sm border border-gray-200 rounded-lg px-3
                  focus:outline-none focus:ring-2 focus:ring-[#5B0F1A]/25 focus:border-[#5B0F1A]"
                            />
                        </div>
                    </div>
                    <Button
                        type="button"
                        onClick={handleManualApply}
                        className="w-full bg-[#5B0F1A] hover:bg-[#7A1424] text-white h-9 text-sm"
                    >
                        Terapkan Koordinat
                    </Button>
                </div>
            )}

            {/* ── Hint text ── */}
            <p className="text-xs text-muted-foreground leading-relaxed">
                Setelah koordinat terdeteksi, Anda bisa <strong>klik di peta</strong> untuk memindahkan pin,
                atau <strong>drag pin</strong> ke lokasi yang lebih tepat.
            </p>

            {/* ── Error ── */}
            {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {/* ── Success info ── */}
            {displayName && !error && (
                <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{displayName}</span>
                </div>
            )}

            {/* ── Leaflet Map ── */}
            <div className="space-y-1">
                <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm"
                    style={{ height: 280 }}>
                    <div ref={mapRef} style={{ height: "100%", width: "100%" }} />

                    {/* Loading overlay before leaflet is ready */}
                    {!mapReady && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                            <Loader2 className="w-6 h-6 text-[#5B0F1A] animate-spin" />
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                        💡 Klik peta untuk pin · Drag pin untuk geser lokasi
                    </p>
                    {hasCoords && (
                        <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                            Koordinat tersimpan
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}