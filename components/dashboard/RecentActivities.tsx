import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Property } from "@/lib/types/property";

interface RecentActivitiesProps {
    properties: Property[];
}

export default function RecentActivities({ properties }: RecentActivitiesProps) {
    return (
        <Card className="rounded-2xl shadow-md border border-gray-200">
            <CardHeader>
                <CardTitle className="text-[#1F2937]">Recent Properties</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {properties.map((property) => (
                        <div
                            key={property.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                            <div className="flex-1">
                                <h4 className="font-semibold text-[#1F2937]">{property.title}</h4>
                                <p className="text-sm text-gray-500">
                                    {property.district}, {property.regency}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-[#5B0F1A]">
                                    Rp {property.price.toLocaleString("id-ID")}
                                </p>
                                <p className="text-xs text-gray-500 capitalize">{property.sale_type}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}