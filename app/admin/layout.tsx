// app/admin/layout.tsx  (atau pages/admin/layout.tsx)
// Tambahkan pt-14 lg:pt-0 pada main content supaya tidak tertutup top bar mobile

import Sidebar from "@/components/layout/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            {/* pt-14 = tinggi mobile top bar (h-14), dihapus di lg */}
            <main className="flex-1 pt-14 lg:pt-0 overflow-auto">
                {children}
            </main>
        </div>
    );
}