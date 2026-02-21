import { Suspense } from "react";
import Properties from "./Properties";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function PropertiesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <Properties />
        </Suspense>
    );
}