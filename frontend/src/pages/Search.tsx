import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BusinessCard } from "@/components/BusinessCard";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export default function SearchPage() {
    const [params] = useSearchParams();
    const q = params.get("q") || "";
    const lat = params.get("lat");
    const lng = params.get("lng");
    const locationText = params.get("locationText") || "";
    const radius = params.get("radius") || "5000";

    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const hasLocation = useMemo(() => lat && lng, [lat, lng]);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError("");
        api
            .get("/api/vendors/search", { params: { q, lat, lng, radius, locationText } })
            .then((res) => {
                if (!isMounted) return;
                setResults(Array.isArray(res.data?.data) ? res.data.data : []);
            })
            .catch((err) => {
                if (!isMounted) return;
                setError(err?.response?.data?.message || err?.message || "Search failed");
            })
            .finally(() => {
                if (!isMounted) return;
                setLoading(false);
            });
        return () => {
            isMounted = false;
        };
    }, [q, lat, lng, radius]);

    const businesses = useMemo(() => {
        return results.map((v) => ({
            id: v._id,
            name: v.shopName || v.name || "Business",
            category: v.category || "",
            rating: 4.6,
            reviewCount: 0,
            address: v.address || "",
            phone: v.phone || "",
            image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800",
            isOpen: true,
            distance: "",
            tags: [],
            verified: true,
        }));
    }, [results]);

    const notFoundText = hasLocation || locationText
        ? `Not found at selected location`
        : `No results for "${q}"`;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <section className="py-8 border-b border-card-border">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold">Search results</h1>
                        <Link to="/">
                            <Button variant="outline">New Search</Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-8">
                <div className="container mx-auto px-4">
                    {loading && (
                        <div className="text-center text-muted-foreground">Searching...</div>
                    )}
                    {error && !loading && (
                        <div className="text-center text-destructive">{error}</div>
                    )}
                    {!loading && !error && businesses.length === 0 && (
                        <div className="text-center text-muted-foreground">{notFoundText}</div>
                    )}
                    {!loading && !error && businesses.length > 0 && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {businesses.map((b) => (
                                <BusinessCard key={b.id} business={b} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
