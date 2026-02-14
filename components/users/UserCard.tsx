import { Card, CardContent } from "@/components/ui/card";
import { User } from "@/lib/types/property";
import { Mail, Phone, Calendar, Home } from "lucide-react";

interface UserCardProps {
    user: User;
}

export default function UserCard({ user }: UserCardProps) {
    return (
        <Card className="rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#5B0F1A] text-white flex items-center justify-center text-xl font-bold">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[#1F2937]">{user.name}</h3>
                            <span
                                className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${user.role === "admin"
                                    ? "bg-[#5B0F1A] text-white"
                                    : "bg-blue-100 text-blue-700"
                                    }`}
                            >
                                {user.role.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={16} />
                        <span>{user.email}</span>
                    </div>
                    {user.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone size={16} />
                            <span>{user.phone}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={16} />
                        <span>
                            Joined {new Date(user.created_at).toLocaleDateString("id-ID")}
                        </span>
                    </div>
                </div>

                {user.properties_count !== undefined && (
                    <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-[#5B0F1A] font-semibold">
                            <Home size={18} />
                            <span>{user.properties_count} Properties</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}