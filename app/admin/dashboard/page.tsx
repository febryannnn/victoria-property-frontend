"use client";

import StatsCard from "@/components/dashboard/StatsCard";
import { Home, Users, TrendingUp, Key, UserCheck, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Dummy data untuk dashboard
const dashboardStats = {
    total_properties: 47,
    total_users: 15,
    total_sales: 32,
    total_rentals: 15,
    active_agents: 8,
    pending_verifications: 3,
};

const salesChartData = [
    { month: "Jan", sales: 12, rentals: 5 },
    { month: "Feb", sales: 15, rentals: 8 },
    { month: "Mar", sales: 10, rentals: 6 },
    { month: "Apr", sales: 18, rentals: 9 },
    { month: "May", sales: 14, rentals: 7 },
    { month: "Jun", sales: 20, rentals: 10 },
];

const adminList = [
    {
        id: 1,
        name: "Admin Victoria",
        email: "admin@victoria.com",
        role: "Super Admin",
        status: "active",
        lastLogin: "2026-02-14 08:30",
    },
    {
        id: 2,
        name: "Budi Santoso",
        email: "budi.santoso@victoria.com",
        role: "Admin",
        status: "active",
        lastLogin: "2026-02-14 07:15",
    },
    {
        id: 3,
        name: "Siti Nurhaliza",
        email: "siti.nurhaliza@victoria.com",
        role: "Admin",
        status: "active",
        lastLogin: "2026-02-13 16:45",
    },
];

const recentActivities = [
    {
        id: 1,
        action: "New property listed",
        description: "Villa Mewah Bali added by Ahmad Rizky",
        time: "2 hours ago",
        type: "success",
    },
    {
        id: 2,
        action: "Property sold",
        description: "Rumah Minimalis Jogja marked as sold",
        time: "5 hours ago",
        type: "info",
    },
    {
        id: 3,
        action: "New user registered",
        description: "Dewi Lestari joined as agent",
        time: "1 day ago",
        type: "success",
    },
    {
        id: 4,
        action: "Property updated",
        description: "Apartemen Modern Gamping price updated",
        time: "2 days ago",
        type: "warning",
    },
];

export default function DashboardPage() {
    return (
        <div className="p-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#5B0F1A]">Dashboard</h1>
                <p className="text-gray-500 mt-1">Welcome back to Victoria Admin</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Total Properties"
                    value={dashboardStats.total_properties}
                    icon={Home}
                    color="bg-[#5B0F1A]"
                />
                <StatsCard
                    title="Total Users"
                    value={dashboardStats.total_users}
                    icon={Users}
                    color="bg-blue-500"
                />
                <StatsCard
                    title="Properties for Sale"
                    value={dashboardStats.total_sales}
                    icon={TrendingUp}
                    color="bg-green-500"
                />
                <StatsCard
                    title="Properties for Rent"
                    value={dashboardStats.total_rentals}
                    icon={Key}
                    color="bg-orange-500"
                />
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <StatsCard
                    title="Active Agents"
                    value={dashboardStats.active_agents}
                    icon={UserCheck}
                    color="bg-purple-500"
                />
                <StatsCard
                    title="Pending Verifications"
                    value={dashboardStats.pending_verifications}
                    icon={Clock}
                    color="bg-red-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Sales Chart */}
                <Card className="rounded-2xl shadow-md border border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-[#1F2937]">Sales Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {salesChartData.map((data) => (
                                <div key={data.month} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-gray-700">{data.month}</span>
                                        <span className="text-gray-500">
                                            Sales: {data.sales} | Rentals: {data.rentals}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <div className="h-8 bg-[#5B0F1A] rounded" style={{ width: `${(data.sales / 20) * 100}%` }}></div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="h-8 bg-orange-500 rounded" style={{ width: `${(data.rentals / 10) * 100}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="flex gap-6 pt-4 border-t border-gray-200">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-[#5B0F1A] rounded"></div>
                                    <span className="text-sm text-gray-600">Sales</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                                    <span className="text-sm text-gray-600">Rentals</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activities */}
                <Card className="rounded-2xl shadow-md border border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-[#1F2937]">Recent Activities</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivities.map((activity) => (
                                <div key={activity.id} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                                    <div
                                        className={`w-2 h-2 rounded-full mt-2 ${activity.type === "success"
                                                ? "bg-green-500"
                                                : activity.type === "info"
                                                    ? "bg-blue-500"
                                                    : "bg-orange-500"
                                            }`}
                                    ></div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-[#1F2937] text-sm">
                                            {activity.action}
                                        </h4>
                                        <p className="text-xs text-gray-600">{activity.description}</p>
                                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Admin List */}
            <Card className="rounded-2xl shadow-md border border-gray-200">
                <CardHeader>
                    <CardTitle className="text-[#1F2937]">Admin Team</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Last Login</th>
                                </tr>
                            </thead>
                            <tbody>
                                {adminList.map((admin) => (
                                    <tr key={admin.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#5B0F1A] text-white flex items-center justify-center font-bold">
                                                    {admin.name.charAt(0)}
                                                </div>
                                                <span className="font-medium text-gray-900">{admin.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">{admin.email}</td>
                                        <td className="py-3 px-4">
                                            <span className="px-3 py-1 bg-[#5B0F1A] text-white text-xs rounded-full">
                                                {admin.role}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                                {admin.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600 text-sm">{admin.lastLogin}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

