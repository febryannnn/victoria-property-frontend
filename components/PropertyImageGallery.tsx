"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { getPropertyImagesUser } from "@/lib/services/property.service";

interface PropertyImageGalleryProps {
    propertyId: number;
    coverImageUrl: string;
    title: string;
}

export default function PropertyImageGallery({
    propertyId,
    coverImageUrl,
    title,
}: PropertyImageGalleryProps) {
    const [images, setImages] = useState<string[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const thumbnailRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef<number | null>(null);

    useEffect(() => {
        async function fetchImages() {
            try {
                const res = await getPropertyImagesUser(propertyId);
                const urls = res.data.map(
                    (img) => `http://localhost:8080${img.url}`
                );
                // Pastikan cover image selalu ada di index 0
                const allImages = urls.length > 0
                    ? urls
                    : [`http://localhost:8080${coverImageUrl}`];
                setImages(allImages);
            } catch (e) {
                setImages([`http://localhost:8080${coverImageUrl}`]);
            } finally {
                setLoading(false);
            }
        }
        fetchImages();
    }, [propertyId, coverImageUrl]);

    // Auto-scroll thumbnail ke active
    useEffect(() => {
        if (thumbnailRef.current) {
            const active = thumbnailRef.current.children[activeIndex] as HTMLElement;
            if (active) {
                active.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
            }
        }
    }, [activeIndex]);

    const prev = () => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
    const next = () => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));

    // Touch/swipe support
    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const onTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? next() : prev();
        }
        touchStartX.current = null;
    };

    if (loading) {
        return (
            <div className="w-full h-64 sm:h-80 md:h-[400px] bg-gray-100 animate-pulse rounded-xl flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Memuat gambar...</span>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-3">
                {/* Main Image */}
                <div
                    className="relative rounded-xl overflow-hidden group cursor-pointer bg-black"
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                    onClick={() => setLightboxOpen(true)}
                >
                    <img
                        key={activeIndex}
                        src={images[activeIndex]}
                        alt={`${title} - foto ${activeIndex + 1}`}
                        className="w-full h-56 sm:h-80 md:h-[450px] object-cover transition-all duration-500 group-hover:scale-105"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    {/* Zoom hint */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-black/50 backdrop-blur-sm rounded-full p-3">
                            <ZoomIn className="w-6 h-6 text-white" />
                        </div>
                    </div>

                    {/* Counter */}
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                        {activeIndex + 1} / {images.length}
                    </div>

                    {/* Nav Buttons — hidden on mobile (pakai swipe) */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prev(); }}
                                className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-700" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); next(); }}
                                className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-700" />
                            </button>
                        </>
                    )}

                    {/* Mobile swipe indicator (hanya jika ada >1 foto) */}
                    {images.length > 1 && (
                        <div className="sm:hidden absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {images.map((_, i) => (
                                <span
                                    key={i}
                                    className={`block h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Thumbnails — sembunyikan di mobile, tampil di sm+ */}
                {images.length > 1 && (
                    <div
                        ref={thumbnailRef}
                        className="hidden sm:flex gap-2 overflow-x-auto pb-1 scroll-smooth scrollbar-thin px-1 pt-1"
                    >
                        {images.map((src, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${i === activeIndex
                                    ? "border-victoria-red scale-105 shadow-md"
                                    : "border-transparent opacity-60 hover:opacity-100 hover:border-gray-300"
                                    }`}
                            >
                                <img
                                    src={src}
                                    alt={`Thumbnail ${i + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center"
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                >
                    {/* Close */}
                    <button
                        onClick={() => setLightboxOpen(false)}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>

                    {/* Counter */}
                    <p className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                        {activeIndex + 1} / {images.length}
                    </p>

                    {/* Main Image */}
                    <div className="relative w-full max-w-4xl px-4 sm:px-12">
                        <img
                            src={images[activeIndex]}
                            alt={`${title} - foto ${activeIndex + 1}`}
                            className="w-full max-h-[70vh] object-contain rounded-lg"
                        />

                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prev}
                                    className="absolute left-6 sm:left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                >
                                    <ChevronLeft className="w-6 h-6 text-white" />
                                </button>
                                <button
                                    onClick={next}
                                    className="absolute right-6 sm:right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                >
                                    <ChevronRight className="w-6 h-6 text-white" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Thumbnail strip di lightbox */}
                    {images.length > 1 && (
                        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                            <div className="flex gap-2 overflow-x-auto max-w-full px-4">
                                {images.map((src, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveIndex(i)}
                                        className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${i === activeIndex
                                            ? "border-white scale-110"
                                            : "border-white/30 opacity-50 hover:opacity-80"
                                            }`}
                                    >
                                        <img src={src} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}