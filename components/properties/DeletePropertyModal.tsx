"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Property } from "@/lib/types/property";
import { ScrollArea } from "@/components/ui/scroll-area";
import { deleteProperty } from "@/lib/services/property.service";
import { toast } from "sonner";

interface DeletePropertyModalProps {
    open: boolean;
    onClose: () => void;
    onDelete: (ids: number[]) => void;
    properties: Property[];
}

export default function DeletePropertyModal({
    open,
    onClose,
    onDelete,
    properties,
}: DeletePropertyModalProps) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    const handleToggle = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedIds.length === properties.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(properties.map((p) => p.id!));
        }
    };

    const handleDelete = async () => {
        if (selectedIds.length === 0) return;

        try {
            setLoading(true);

            await Promise.all(
                selectedIds.map((id) => deleteProperty(id))
            );

            toast.success(`${selectedIds.length} property deleted successfully`);

            onDelete(selectedIds);
            setSelectedIds([]);
            onClose();
        } catch (error: any) {
            toast.error(error?.message || "Failed to delete properties");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-[#5B0F1A]">
                        Delete Properties
                    </DialogTitle>
                    <DialogDescription>
                        Select properties you want to delete. This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="select-all"
                            checked={selectedIds.length === properties.length}
                            onCheckedChange={handleSelectAll}
                        />
                        <label
                            htmlFor="select-all"
                            className="text-sm font-medium cursor-pointer"
                        >
                            Select All ({selectedIds.length} of {properties.length} selected)
                        </label>
                    </div>

                    <ScrollArea className="h-[400px] border rounded-lg p-4">
                        <div className="space-y-3">
                            {properties.map((property) => (
                                <div
                                    key={property.id}
                                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition"
                                >
                                    <Checkbox
                                        id={`property-${property.id}`}
                                        checked={selectedIds.includes(property.id!)}
                                        onCheckedChange={() => handleToggle(property.id!)}
                                    />
                                    <label
                                        htmlFor={`property-${property.id}`}
                                        className="flex-1 cursor-pointer"
                                    >
                                        <h4 className="font-semibold text-[#1F2937]">
                                            {property.title}
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            {property.district}, {property.regency} - Rp{" "}
                                            {property.price.toLocaleString("id-ID")}
                                        </p>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>

                    <div className="flex gap-4">
                        <Button
                            onClick={handleDelete}
                            disabled={selectedIds.length === 0}
                            className="bg-red-600 hover:bg-red-700 text-white flex-1"
                        >
                            Delete {selectedIds.length} Properties
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}