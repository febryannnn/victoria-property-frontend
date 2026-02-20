import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Header */}
            <header className="bg-slate-700 text-white py-3">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                        <span>Promosikan Properti Anda Bersama Kami</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <a href="tel:+628128026-9318" className="flex items-center gap-2 hover:text-gray-200">
                            <span>📞</span>
                            <span>+62 812-8026-9318</span>
                        </a>
                        <a href="mailto:victoriapropertycibubur@gmail.com" className="flex items-center gap-2 hover:text-gray-200">
                            <span>✉️</span>
                            <span>victoriapropertycibubur@gmail.com</span>
                        </a>
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <Navbar />

            {/* Main Content */}
            <main className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    {/* 404 Number with Property Icon */}
                    <div className="relative mb-8">
                        <h1 className="text-9xl font-bold text-slate-200 select-none">404</h1>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 bg-red-800 rounded-full flex items-center justify-center">
                                <Home className="w-16 h-16 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    <div className="mb-8">
                        <h2 className="text-4xl font-bold text-slate-800 mb-4">
                            Halaman Tidak Ditemukan
                        </h2>
                        <p className="text-lg text-slate-600 mb-2">
                            Maaf, halaman yang Anda cari tidak dapat ditemukan.
                        </p>
                        <p className="text-slate-500">
                            Mungkin halaman telah dipindahkan atau URL yang Anda masukkan salah.
                        </p>
                    </div>

                    {/* Search Box */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                        <h3 className="text-xl font-semibold text-slate-800 mb-4">
                            Cari Properti Impian Anda
                        </h3>
                        <div className="flex gap-3">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <Input
                                    type="text"
                                    placeholder="Masukkan lokasi, nama properti..."
                                    className="pl-12 h-14 text-base border-slate-300 focus:border-red-800 focus:ring-red-800"
                                />
                            </div>
                            <Button className="h-14 px-8 bg-red-800 hover:bg-red-900 text-white font-medium">
                                <Search className="w-5 h-5 mr-2" />
                                Cari Properti
                            </Button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                        <Link href="/">
                            <Button className="h-12 px-8 bg-red-800 hover:bg-red-900 text-white font-medium">
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Kembali ke Beranda
                            </Button>
                        </Link>
                        <Link href="/properties">
                            <Button variant="outline" className="h-12 px-8 border-slate-300 hover:border-red-800 hover:text-red-800 font-medium">
                                <Home className="w-5 h-5 mr-2" />
                                Lihat Semua Properti
                            </Button>
                        </Link>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="text-4xl font-bold text-red-800 mb-2">15,000+</div>
                            <div className="text-slate-600">Properti Tersedia</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="text-4xl font-bold text-red-800 mb-2">8,500+</div>
                            <div className="text-slate-600">Pelanggan Puas</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="text-4xl font-bold text-red-800 mb-2">120+</div>
                            <div className="text-slate-600">Kota di Indonesia</div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="mt-16 p-8 bg-slate-50 rounded-2xl">
                        <h3 className="text-xl font-semibold text-slate-800 mb-4">
                            Butuh Bantuan?
                        </h3>
                        <p className="text-slate-600 mb-4">
                            Tim kami siap membantu Anda menemukan properti impian
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="tel:+628128026-9318"
                                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-lg font-medium shadow-sm transition-colors"
                            >
                                📞 Hubungi Kami
                            </a>
                            <a
                                href="mailto:victoriapropertycibubur@gmail.com"
                                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-lg font-medium shadow-sm transition-colors"
                            >
                                ✉️ Email Kami
                            </a>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-slate-800 text-white py-8 mt-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-10 h-10 bg-red-800 rounded-full flex items-center justify-center text-white font-bold text-xl">
                            V
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-lg">VICTORIA</div>
                            <div className="text-xs text-slate-400">PROPERTY</div>
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm">
                        © 2024 Victoria Property. Partner Properti Terpercaya #1
                    </p>
                </div>
            </footer>
        </div>
    );
}