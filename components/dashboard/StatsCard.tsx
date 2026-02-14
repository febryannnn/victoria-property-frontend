import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    color: string;
}

export default function StatsCard({ title, value, icon: Icon, color }: StatsCardProps) {
    return (
        <Card className="rounded-2xl shadow-md border border-gray-200">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">{title}</p>
                        <p className="text-3xl font-bold text-[#1F2937]">{value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${color}`}>
                        <Icon className="text-white" size={24} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}