import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Filter, MapPin, SlidersHorizontal, Grid, List } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BusinessCard } from "@/components/BusinessCard";
import { ChatModal } from "@/components/ChatModal";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Mock data for hospitals category
const hospitalBusinesses = [
  {
    id: "1",
    name: "City General Hospital",
    category: "Multi-Specialty Hospital",
    rating: 4.7,
    reviewCount: 1248,
    address: "123 Medical Center Drive, Downtown",
    phone: "+1 (555) 123-4567",
    image: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=300&fit=crop",
    isOpen: true,
    distance: "0.8 km",
    tags: ["Emergency", "Insurance", "24/7"],
    verified: true
  },
  {
    id: "2",
    name: "Heart Care Specialty Center",
    category: "Cardiology Clinic",
    rating: 4.9,
    reviewCount: 567,
    address: "456 Heart Avenue, Medical District",
    phone: "+1 (555) 987-6543",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
    isOpen: true,
    distance: "1.2 km",
    tags: ["Cardiology", "Insurance", "Specialist"],
    verified: true
  },
  {
    id: "3",
    name: "Children's Medical Center",
    category: "Pediatric Hospital",
    rating: 4.8,
    reviewCount: 892,
    address: "789 Kids Health Boulevard, Family District",
    phone: "+1 (555) 456-7890",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
    isOpen: true,
    distance: "2.1 km",
    tags: ["Pediatric", "NICU", "Emergency"],
    verified: true
  },
  {
    id: "4",
    name: "Advanced Diagnostic Center",
    category: "Diagnostic Center",
    rating: 4.6,
    reviewCount: 234,
    address: "321 Scan Street, Medical Plaza",
    phone: "+1 (555) 111-2222",
    image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=300&fit=crop",
    isOpen: false,
    distance: "1.5 km",
    tags: ["MRI", "CT Scan", "Lab Tests"],
    verified: true
  },
  {
    id: "5",
    name: "Sunrise Rehabilitation Hospital",
    category: "Rehabilitation Center",
    rating: 4.5,
    reviewCount: 156,
    address: "654 Recovery Road, Wellness District",
    phone: "+1 (555) 333-4444",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&h=300&fit=crop",
    isOpen: true,
    distance: "3.2 km",
    tags: ["Physiotherapy", "Speech Therapy", "Recovery"],
    verified: false
  },
  {
    id: "6",
    name: "Emergency Care Plus",
    category: "Emergency Clinic",
    rating: 4.4,
    reviewCount: 678,
    address: "987 Urgent Care Lane, Quick Response Zone",
    phone: "+1 (555) 555-6666",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    isOpen: true,
    distance: "0.9 km",
    tags: ["Emergency", "Walk-in", "24/7"],
    verified: true
  }
];

const categoryInfo = {
  hospitals: {
    title: "Hospitals",
    description: "Find the best hospitals and medical centers in your area",
    totalCount: "300+",
    subtitle: "Quality healthcare providers"
  },
  restaurants: {
    title: "Restaurants",
    description: "Discover amazing dining experiences",
    totalCount: "2,500+",
    subtitle: "Best dining experiences"
  },
  // Add more categories as needed
};

export default function CategoryDetail() {
  const { category } = useParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("rating");
  const [filterBy, setFilterBy] = useState("all");
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatVendorId, setChatVendorId] = useState<string>("");

  const categoryData = categoryInfo[category as keyof typeof categoryInfo] || {
    title: category?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || "Category",
    description: "Find the best businesses in this category",
    totalCount: "100+",
    subtitle: "Quality service providers"
  };

  const normalizedCategory = useMemo(() => (category || "").replace(/-/g, " "), [category]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");
    api
      .get(`/api/vendors`, { params: { category: normalizedCategory } })
      .then((res) => {
        if (!isMounted) return;
        const list = Array.isArray(res.data?.data) ? res.data.data : [];
        setVendors(list);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err?.response?.data?.message || err?.message || "Failed to load vendors");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [normalizedCategory]);

  const businesses = useMemo(() => {
    if (normalizedCategory === "hospitals" && vendors.length === 0) return hospitalBusinesses;
    return vendors.map((v) => ({
      id: v._id,
      name: v.shopName || v.name || "Business",
      category: v.category || normalizedCategory,
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
  }, [vendors, normalizedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Category Header */}
      <section className="py-12 bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-b border-card-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">
              {categoryData.title} <span className="gradient-text">Near You</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-6 animate-fade-in-up stagger-1">
              {categoryData.description}
            </p>
            <div className="flex items-center justify-center space-x-6 animate-fade-in-up stagger-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{categoryData.totalCount}</div>
                <div className="text-sm text-muted-foreground">Businesses</div>
              </div>
              <div className="w-px h-12 bg-card-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">4.6★</div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
              </div>
              <div className="w-px h-12 bg-card-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="py-6 bg-card border-b border-card-border sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Filter Controls */}
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </Button>

              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="open">Open Now</SelectItem>
                  <SelectItem value="verified">Verified Only</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="distance">Nearest</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Mode and Results Count */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Showing {businesses.length} results
              </span>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex items-center space-x-2 mt-4">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            <Badge variant="secondary" className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>Within 5km</span>
            </Badge>
            <Badge variant="secondary">Open Now</Badge>
          </div>
        </div>
      </section>

      {/* Business Listings */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className={`grid ${viewMode === "grid"
            ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "grid-cols-1 gap-4"
            }`}>
            {loading && (
              <div className="text-center col-span-full text-muted-foreground">Loading businesses...</div>
            )}
            {error && !loading && (
              <div className="text-center col-span-full text-destructive">{error}</div>
            )}
            {!loading && !error && businesses.map((business, index) => (
              <div
                key={business.id}
                className={`animate-fade-in-up stagger-${Math.min(index % 6 + 1, 6)}`}
              >
                <div className="space-y-2">
                  <BusinessCard business={business} />
                  <Button variant="outline" size="sm" onClick={() => { setChatVendorId(String(business.id)); setChatOpen(true); }}>
                    Chat with Vendor
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button className="btn-hero">
              Load More Results
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <ChatModal vendorId={chatVendorId} open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};