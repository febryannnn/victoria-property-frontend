"use client";

import { useState, useEffect } from "react";
import { Bookmark, Loader2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    getUserFavoriteIds,
    addFavorite,
    removeFavorite,
} from "@/lib/services/favorites.service";

interface FavoriteButtonProps {
    propertyId: number;
    propertyTitle?: string;
}

export default function FavoriteButton({ propertyId, propertyTitle }: FavoriteButtonProps) {
    const [isFavorited, setIsFavorited] = useState(false);
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        async function checkFavorite() {
            try {
                const ids = await getUserFavoriteIds();
                setIsFavorited(ids.includes(propertyId));
            } catch (err) {
                console.error("Failed to check favorites:", err);
            } finally {
                setLoading(false);
            }
        }
        checkFavorite();
    }, [propertyId]);

    const handleButtonClick = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
            return;
        }
        setShowConfirm(true);
    };

    const handleConfirm = async () => {
        setToggling(true);
        try {
            if (isFavorited) {
                await removeFavorite(propertyId);
                setIsFavorited(false);
            } else {
                await addFavorite(propertyId);
                setIsFavorited(true);
            }
        } catch (err) {
            console.error("Failed to toggle favorite:", err);
        } finally {
            setToggling(false);
            setShowConfirm(false);
        }
    };

    return (
        <>
            <Button
                variant="outline"
                className={`w-full h-11 transition-all duration-200 ${isFavorited
                        ? "border-2 border-victoria-red bg-victoria-red/10 text-victoria-red hover:bg-victoria-red hover:text-white"
                        : "border-2 border-gray-200 hover:border-victoria-red hover:text-victoria-red"
                    }`}
                onClick={handleButtonClick}
                disabled={loading || toggling}
            >
                {toggling || loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                    <Bookmark
                        className={`w-4 h-4 mr-2 transition-all ${isFavorited ? "fill-current" : ""}`}
                    />
                )}
                {loading
                    ? "Memuat..."
                    : isFavorited
                        ? "Tersimpan di Favorit"
                        : "Tambah ke Favorit"}
            </Button>

            {/* AlertDialog — sama persis dengan PropertyCard */}
            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent className="overflow-hidden animate-[dialogFadeIn_0.3s_ease-out]">
                    {/* Animated Background Decoration */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-victoria-red/10 rounded-full blur-3xl animate-[fadeInScale_0.6s_ease-out]" />
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-victoria-red/5 rounded-full blur-2xl animate-[fadeInScale_0.8s_ease-out]" />

                    <AlertDialogHeader className="relative animate-[slideUp_0.5s_ease-out]">
                        {/* Animated Heart Icon */}
                        <div className="flex justify-center mb-4">
                            <div
                                className={`relative p-4 rounded-full ${isFavorited ? "bg-muted" : "bg-victoria-red/10"
                                    } animate-[popIn_0.5s_cubic-bezier(0.68,-0.55,0.265,1.55)]`}
                            >
                                <Heart
                                    className={`w-10 h-10 transition-all duration-300 ${isFavorited
                                            ? "text-muted-foreground"
                                            : "text-victoria-red fill-victoria-red animate-[heartbeat_1.2s_ease-in-out_infinite]"
                                        }`}
                                />
                                {!isFavorited && (
                                    <>
                                        <span className="absolute inset-0 rounded-full bg-victoria-red/20 animate-ping" />
                                        <span className="absolute inset-2 rounded-full bg-victoria-red/10 animate-ping delay-150" />
                                    </>
                                )}
                            </div>
                        </div>

                        <AlertDialogTitle className="text-center text-xl">
                            {isFavorited ? "Hapus dari Favorit?" : "Tambah ke Favorit?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center">
                            {isFavorited ? (
                                <>
                                    Apakah Anda yakin ingin menghapus{" "}
                                    <strong className="font-semibold text-foreground">
                                        {propertyTitle ?? "properti ini"}
                                    </strong>{" "}
                                    dari daftar favorit Anda?
                                </>
                            ) : (
                                <>
                                    Properti{" "}
                                    <strong className="font-semibold text-foreground">
                                        {propertyTitle ?? "ini"}
                                    </strong>{" "}
                                    akan ditambahkan ke halaman Favorit Anda. Anda dapat mengakses properti favorit
                                    kapan saja dari ikon ❤️ di navbar.
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="sm:justify-center gap-3 mt-2">
                        <AlertDialogCancel className="sm:w-32 transition-all duration-200 hover:scale-105">
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirm}
                            className={`sm:w-32 transition-all duration-200 hover:scale-105 ${isFavorited
                                    ? "bg-muted-foreground hover:bg-muted-foreground/90"
                                    : "bg-victoria-red hover:bg-victoria-red/90 hover:shadow-lg hover:shadow-victoria-red/25"
                                }`}
                        >
                            {toggling ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : isFavorited ? (
                                "Ya, Hapus"
                            ) : (
                                "Ya, Tambahkan"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}