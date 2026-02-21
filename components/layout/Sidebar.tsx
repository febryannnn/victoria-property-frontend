"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutDashboard, Users, LogOut, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    // Close drawer on route change
    useEffect(() => { setMobileOpen(false); }, [pathname]);

    // Prevent body scroll when drawer open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [mobileOpen]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/");
    };

    const navItems = [
        { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/admin/properties", icon: Home, label: "Properties" },
        { href: "/admin/users", icon: Users, label: "Users" },
    ];

    const NavContent = () => (
        <>
            {/* Logo */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                    <Home className="text-[#D4AF37]" size={20} />
                    <h1 className="text-xl font-bold">Victoria Admin</h1>
                </div>
                {/* Close button — mobile only */}
                <button
                    className="lg:hidden p-1 rounded-md hover:bg-white/10 transition"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close menu"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Nav links */}
            <nav className="space-y-1 flex-1">
                {navItems.map(({ href, icon: Icon, label }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`
                                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150
                                ${isActive
                                    ? "bg-white/10 text-[#D4AF37] font-medium"
                                    : "text-gray-200 hover:bg-white/8 hover:text-white"
                                }
                            `}
                        >
                            <Icon size={18} className="shrink-0" />
                            <span>{label}</span>
                            {isActive && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <button
                className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-gray-300 hover:bg-white/8 hover:text-white cursor-pointer transition-all duration-150 mt-4"
                onClick={handleLogout}
            >
                <LogOut size={18} className="shrink-0" />
                <span>Logout</span>
            </button>
        </>
    );

    return (
        <>
            {/* ── Mobile top bar ── */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#5B0F1A] text-white flex items-center justify-between px-4 h-14 shadow-md">
                <div className="flex items-center gap-2">
                    <Home className="text-[#D4AF37]" size={18} />
                    <span className="font-bold text-base">Victoria Admin</span>
                </div>
                <button
                    className="p-2 rounded-md hover:bg-white/10 transition"
                    onClick={() => setMobileOpen(true)}
                    aria-label="Open menu"
                >
                    <Menu size={20} />
                </button>
            </header>

            {/* ── Mobile backdrop ── */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* ── Mobile drawer ── */}
            <aside
                className={`
                    lg:hidden fixed top-0 left-0 z-50 h-full w-72 bg-[#5B0F1A] text-white
                    flex flex-col p-6 shadow-2xl
                    transition-transform duration-300 ease-in-out
                    ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                <NavContent />
            </aside>

            {/* ── Desktop sidebar (always visible) ── */}
            <aside className="hidden lg:flex w-64 bg-[#5B0F1A] text-white flex-col p-6 min-h-screen">
                <NavContent />
            </aside>
        </>
    );
}