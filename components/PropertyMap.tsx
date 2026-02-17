'use client';

import { useEffect, useRef } from 'react';
import type { Map as LeafletMap } from 'leaflet';

interface PropertyMapProps {
    center: {
        lat: number;
        lng: number;
    };
    address: string;
    propertyTitle: string;
}

export default function PropertyMap({
    center,
    address,
    propertyTitle,
}: PropertyMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<LeafletMap | null>(null);

    useEffect(() => {
        let map: LeafletMap;

        async function initMap() {
            if (!mapRef.current || mapInstanceRef.current) return;

            const L = await import('leaflet');
            await import('leaflet/dist/leaflet.css');

            map = L.map(mapRef.current).setView(
                [center.lat, center.lng],
                15
            );

            mapInstanceRef.current = map;

            L.tileLayer(
                'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
                {
                    attribution:
                        '&copy; OpenStreetMap contributors &copy; CARTO',
                    subdomains: 'abcd',
                    maxZoom: 20,
                }
            ).addTo(map);

            const customIcon = L.divIcon({
                html: `
          <div style="
            background: linear-gradient(135deg, #a81728 0%, #601420 100%);
            width: 40px;
            height: 40px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <svg 
              style="transform: rotate(45deg); width: 20px; height: 20px;" 
              fill="white" 
              viewBox="0 0 24 24"
            >
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </div>
        `,
                className: '',
                iconSize: [40, 40],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40],
            });

            const marker = L.marker(
                [center.lat, center.lng],
                { icon: customIcon }
            ).addTo(map);

            marker
                .bindPopup(`
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 200px;">
            <h3 style="
              font-size: 14px;
              font-weight: 700;
              color: #3d5a73;
              margin: 0 0 8px 0;
            ">${propertyTitle}</h3>
            <p style="
              font-size: 12px;
              color: #6b7280;
              margin: 0;
            ">${address}</p>
            <a 
              href="https://www.google.com/maps/search/?api=1&query=${center.lat},${center.lng}"
              target="_blank"
              rel="noopener noreferrer"
              style="
                display: inline-block;
                margin-top: 12px;
                padding: 6px 12px;
                background: #a81728;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
              "
            >
              Buka di Google Maps →
            </a>
          </div>
        `)
                .openPopup();
        }

        initMap();

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [center.lat, center.lng, address, propertyTitle]);

    return (
        <div className="relative">
            <div
                ref={mapRef}
                className="w-full h-[400px] rounded-xl overflow-hidden shadow-md"
            />
            <div className="mt-4 flex items-center justify-between p-3 bg-victoria-light rounded-lg">
                <div className="flex items-center gap-2">
                    <svg
                        className="w-5 h-5 text-victoria-red"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                    <span className="text-sm font-medium text-victoria-navy">
                        Lokasi Properti
                    </span>
                </div>
                <a
                    href={`https://www.google.com/maps/search/?api=1&query=${center.lat},${center.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-victoria-red hover:text-victoria-maroon font-semibold transition-colors"
                >
                    Lihat di Google Maps →
                </a>
            </div>
        </div>
    );
}