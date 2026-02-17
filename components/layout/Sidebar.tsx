"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, LayoutDashboard, Users, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";


export default function Sidebar() {
    const router = useRouter()
    const pathname = usePathname();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        router.push("/")

    };

    const navItems = [
        {
            href: "/admin/dashboard",
            icon: LayoutDashboard,
            label: "Dashboard",
        },
        {
            href: "/admin/properties",
            icon: Home,
            label: "Properties",
        },
        {
            href: "/admin/users",
            icon: Users,
            label: "Users",
        },
    ];

    return (
        <aside className="w-64 bg-[#5B0F1A] text-white flex flex-col justify-between p-6">
            <div>
                <div className="flex items-center gap-2 mb-8">
                    <Home className="text-[#D4AF37]" />
                    <h1 className="text-xl font-bold">Victoria Admin</h1>
                </div>

                <nav className="space-y-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 transition ${isActive
                                    ? "text-[#D4AF37] font-medium"
                                    : "text-gray-200 hover:text-white"
                                    }`}
                            >
                                <Icon size={18} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <button className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer transition" onClick={handleLogout}>
                <LogOut size={18} />
                Logout
            </button>
        </aside>
    );
}