import Sidebar from "@/components/layout/Sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-white flex">
            <Sidebar />
            <main className="flex-1 bg-[#F3F4F6]">{children}</main>
        </div>
    );
}