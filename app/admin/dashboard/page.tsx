"use client";

import { useState } from "react";
import StatsCard from "@/components/dashboard/StatsCard";
import {
    Home,
    Users,
    TrendingUp,
    Key,
    UserCheck,
    Clock,
    Activity,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    Sparkles,
    ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// Dummy data untuk dashboard
const dashboardStats = {
    total_properties: 47,
    total_users: 15,
    total_sales: 32,
    total_rentals: 15,
    active_agents: 8,
    pending_verifications: 3,
    growth_properties: 12,
    growth_users: 8,
    growth_sales: 15,
    growth_rentals: -5,
};

const salesChartData = [
    { month: "Jan", sales: 12, rentals: 5, growth: 5 },
    { month: "Feb", sales: 15, rentals: 8, growth: 25 },
    { month: "Mar", sales: 10, rentals: 6, growth: -33 },
    { month: "Apr", sales: 18, rentals: 9, growth: 80 },
    { month: "May", sales: 14, rentals: 7, growth: -22 },
    { month: "Jun", sales: 20, rentals: 10, growth: 43 },
];

const adminList = [
    {
        id: 1,
        name: "Admin Victoria",
        email: "admin@victoria.com",
        role: "Super Admin",
        status: "active",
        lastLogin: "2 min ago",
        avatar: "AV",
    },
    {
        id: 2,
        name: "Budi Santoso",
        email: "budi.santoso@victoria.com",
        role: "Admin",
        status: "active",
        lastLogin: "1 hour ago",
        avatar: "BS",
    },
    {
        id: 3,
        name: "Siti Nurhaliza",
        email: "siti.nurhaliza@victoria.com",
        role: "Admin",
        status: "active",
        lastLogin: "Yesterday",
        avatar: "SN",
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
        <div className="p-8 space-y-8 bg-gradient-to-br from-gray-50 to-white min-h-screen">
            {/* Header Section */}
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-[#5B0F1A] to-[#7A1424] rounded-lg">
                            <BarChart3 className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#5B0F1A] to-[#8B1526] bg-clip-text text-transparent">
                            Dashboard
                        </h1>
                    </div>
                    <p className="text-muted-foreground flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-[#5B0F1A]" />
                        Welcome back to Victoria Admin
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="px-4 py-2 border-[#5B0F1A]/20 text-[#5B0F1A]">
                        <Activity className="h-3 w-3 mr-2" />
                        Live Updates
                    </Badge>
                    <Button className="bg-gradient-to-r from-[#5B0F1A] to-[#7A1424] hover:from-[#7A1424] hover:to-[#5B0F1A] text-white shadow-lg">
                        Generate Report
                    </Button>
                </div>
            </div>

            {/* Main Stats Grid with Enhanced Design */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#5B0F1A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Properties
                        </CardTitle>
                        <div className="p-2 bg-[#5B0F1A]/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                            <Home className="h-4 w-4 text-[#5B0F1A]" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <div className="text-3xl font-bold text-gray-900">
                                {dashboardStats.total_properties}
                            </div>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                +{dashboardStats.growth_properties}%
                            </Badge>
                        </div>
                        <Progress value={75} className="mt-3 h-1.5" />
                        <p className="text-xs text-muted-foreground mt-2">
                            +3 new this week
                        </p>
                    </CardContent>
                </Card>

                <Card className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Users
                        </CardTitle>
                        <div className="p-2 bg-blue-100 rounded-lg group-hover:scale-110 transition-transform duration-300">
                            <Users className="h-4 w-4 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <div className="text-3xl font-bold text-gray-900">
                                {dashboardStats.total_users}
                            </div>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                +{dashboardStats.growth_users}%
                            </Badge>
                        </div>
                        <Progress value={45} className="mt-3 h-1.5" />
                        <p className="text-xs text-muted-foreground mt-2">
                            2 new agents joined
                        </p>
                    </CardContent>
                </Card>

                <Card className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Properties for Sale
                        </CardTitle>
                        <div className="p-2 bg-green-100 rounded-lg group-hover:scale-110 transition-transform duration-300">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <div className="text-3xl font-bold text-gray-900">
                                {dashboardStats.total_sales}
                            </div>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                +{dashboardStats.growth_sales}%
                            </Badge>
                        </div>
                        <Progress value={85} className="mt-3 h-1.5" />
                        <p className="text-xs text-muted-foreground mt-2">
                            High demand area
                        </p>
                    </CardContent>
                </Card>

                <Card className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Properties for Rent
                        </CardTitle>
                        <div className="p-2 bg-orange-100 rounded-lg group-hover:scale-110 transition-transform duration-300">
                            <Key className="h-4 w-4 text-orange-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <div className="text-3xl font-bold text-gray-900">
                                {dashboardStats.total_rentals}
                            </div>
                            <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                                <ArrowDownRight className="h-3 w-3 mr-1" />
                                {dashboardStats.growth_rentals}%
                            </Badge>
                        </div>
                        <Progress value={30} className="mt-3 h-1.5" />
                        <p className="text-xs text-muted-foreground mt-2">
                            Seasonal decrease
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Secondary Stats with Modern Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-white to-purple-50/30 shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle className="text-2xl font-bold text-gray-900">
                                {dashboardStats.active_agents}
                            </CardTitle>
                            <CardDescription>Active Agents</CardDescription>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full">
                            <UserCheck className="h-6 w-6 text-purple-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Team capacity</span>
                            <span className="font-semibold text-purple-600">80%</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500 bg-gradient-to-br from-white to-red-50/30 shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle className="text-2xl font-bold text-gray-900">
                                {dashboardStats.pending_verifications}
                            </CardTitle>
                            <CardDescription>Pending Verifications</CardDescription>
                        </div>
                        <div className="p-3 bg-red-100 rounded-full">
                            <Clock className="h-6 w-6 text-red-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Requires attention</span>
                            <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                Review
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts and Activities Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Enhanced Sales Chart */}
                <Card className="border-0 shadow-lg overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#5B0F1A]/5 to-transparent rounded-full -mr-16 -mt-16" />
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-bold text-gray-900">Sales Overview</CardTitle>
                                <CardDescription>Monthly performance tracking</CardDescription>
                            </div>
                            <Badge className="bg-[#5B0F1A]/10 text-[#5B0F1A] hover:bg-[#5B0F1A]/20">
                                6 Months
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {salesChartData.map((data, index) => (
                                <div key={data.month} className="group space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-3">
                                            <span className="font-semibold text-gray-900 w-12">{data.month}</span>
                                            <div className="flex gap-2 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <div className="w-2 h-2 rounded-full bg-[#5B0F1A]" />
                                                    {data.sales}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                                                    {data.rentals}
                                                </span>
                                            </div>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={`text-xs ${data.growth > 0
                                                    ? 'border-green-200 text-green-700 bg-green-50'
                                                    : 'border-red-200 text-red-700 bg-red-50'
                                                }`}
                                        >
                                            {data.growth > 0 ? '+' : ''}{data.growth}%
                                        </Badge>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="flex-1 relative overflow-hidden rounded-full h-2 bg-gray-100">
                                            <div
                                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#5B0F1A] to-[#7A1424] rounded-full transition-all duration-500 group-hover:scale-105"
                                                style={{ width: `${(data.sales / 20) * 100}%` }}
                                            />
                                        </div>
                                        <div className="flex-1 relative overflow-hidden rounded-full h-2 bg-gray-100">
                                            <div
                                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500 group-hover:scale-105"
                                                style={{ width: `${(data.rentals / 10) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="flex gap-6 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#5B0F1A] to-[#7A1424]" />
                                    <span className="text-sm font-medium text-gray-700">Sales</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-400 to-orange-600" />
                                    <span className="text-sm font-medium text-gray-700">Rentals</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Enhanced Recent Activities */}
                <Card className="border-0 shadow-lg overflow-hidden">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full -ml-16 -mt-16" />
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-bold text-gray-900">Recent Activities</CardTitle>
                                <CardDescription>Latest platform updates</CardDescription>
                            </div>
                            <Button size="sm" variant="ghost" className="text-[#5B0F1A] hover:text-[#7A1424] hover:bg-[#5B0F1A]/5">
                                View All
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentActivities.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="group flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 bg-white"
                                >
                                    <div className="relative">
                                        <div
                                            className={`w-2 h-2 rounded-full mt-2 ${activity.type === "success"
                                                    ? "bg-green-500"
                                                    : activity.type === "info"
                                                        ? "bg-blue-500"
                                                        : "bg-orange-500"
                                                }`}
                                        />
                                        <div
                                            className={`absolute top-2 left-1 w-0.5 h-full ${activity.type === "success"
                                                    ? "bg-green-500/20"
                                                    : activity.type === "info"
                                                        ? "bg-blue-500/20"
                                                        : "bg-orange-500/20"
                                                }`}
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <h4 className="font-semibold text-gray-900 text-sm group-hover:text-[#5B0F1A] transition-colors">
                                            {activity.action}
                                        </h4>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            {activity.description}
                                        </p>
                                        <div className="flex items-center gap-2 pt-1">
                                            <Clock className="h-3 w-3 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">{activity.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Enhanced Admin Table */}
            <Card className="border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold text-gray-900">Admin Team</CardTitle>
                            <CardDescription>Manage your admin users and permissions</CardDescription>
                        </div>
                        <Button size="sm" className="bg-[#5B0F1A] hover:bg-[#7A1424]">
                            Add Admin
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                                <TableHead className="font-semibold">Admin</TableHead>
                                <TableHead className="font-semibold">Email</TableHead>
                                <TableHead className="font-semibold">Role</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                                <TableHead className="font-semibold">Last Login</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {adminList.map((admin) => (
                                <TableRow key={admin.id} className="group hover:bg-gray-50/50">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="border-2 border-[#5B0F1A]/20 group-hover:border-[#5B0F1A]/40 transition-colors">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${admin.name}`} />
                                                <AvatarFallback className="bg-gradient-to-br from-[#5B0F1A] to-[#7A1424] text-white font-semibold">
                                                    {admin.avatar}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold text-gray-900 group-hover:text-[#5B0F1A] transition-colors">
                                                    {admin.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    ID: #{admin.id}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {admin.email}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className="bg-[#5B0F1A]/10 text-[#5B0F1A] hover:bg-[#5B0F1A]/20 border-0">
                                            {admin.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                                            {admin.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {admin.lastLogin}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}