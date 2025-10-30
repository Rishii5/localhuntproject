import { useState, useEffect } from "react";
import { Star, Trophy, Filter, TrendingUp, Award, Crown } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BusinessCard } from "@/components/BusinessCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/lib/api";

interface Business {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  address: string;
  phone: string;
  image: string;
  isOpen: boolean;
  distance: string;
  tags: string[];
  verified: boolean;
}

const TopRated = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [timeFrame, setTimeFrame] = useState("all");

  useEffect(() => {
    fetchTopRatedBusinesses();
  }, [selectedCategory, timeFrame]);

  const fetchTopRatedBusinesses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        sort: 'rating',
        limit: '20',
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(timeFrame !== 'all' && { timeframe: timeFrame })
      });

      const response = await api.get(`/api/vendors/top-rated?${params}`);
      setBusinesses(response.data.data || []);
    } catch (error) {
      console.error("Error fetching top rated businesses:", error);
      // Mock data for demonstration - updated to match BusinessCard component expectations
      setBusinesses([
        {
          id: "7",
          name: "Bella Italia",
          category: "Restaurants",
          rating: 4.8,
          reviewCount: 892,
          address: "456 Pasta Street, Downtown",
          phone: "+1 (555) 234-5678",
          image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
          isOpen: true,
          distance: "0.5 km",
          tags: ["Italian", "Romantic", "Wine"],
          verified: true
        },
        {
          id: "16",
          name: "Power Fitness Gym",
          category: "Fitness",
          rating: 4.6,
          reviewCount: 423,
          address: "987 Strength Street, Fitness District",
          phone: "+1 (555) 123-4567",
          image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
          isOpen: true,
          distance: "1.7 km",
          tags: ["Gym", "Weights", "Cardio"],
          verified: true
        },
        {
          id: "15",
          name: "Tranquil Spa",
          category: "Beauty & Spa",
          rating: 4.9,
          reviewCount: 267,
          address: "654 Relaxation Road, Wellness Center",
          phone: "+1 (555) 012-3456",
          image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
          isOpen: true,
          distance: "2.1 km",
          tags: ["Massage", "Facials", "Relaxation"],
          verified: true
        },
        {
          id: "29",
          name: "Morning Brew Cafe",
          category: "Cafes",
          rating: 4.7,
          reviewCount: 345,
          address: "147 Coffee Corner, Downtown",
          phone: "+1 (555) 456-7890",
          image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop",
          isOpen: true,
          distance: "0.8 km",
          tags: ["Coffee", "Pastries", "WiFi"],
          verified: true
        },
        {
          id: "23",
          name: "Prime Properties",
          category: "Business Services",
          rating: 4.6,
          reviewCount: 567,
          address: "147 Property Plaza, Business District",
          phone: "+1 (555) 890-1234",
          image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
          isOpen: true,
          distance: "2.7 km",
          tags: ["Sales", "Rentals", "Commercial"],
          verified: true
        },
        {
          id: "31",
          name: "Fashion Central Mall",
          category: "Shopping",
          rating: 4.5,
          reviewCount: 1234,
          address: "369 Mall Drive, Shopping Center",
          phone: "+1 (555) 678-9012",
          image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
          isOpen: true,
          distance: "2.2 km",
          tags: ["Fashion", "Electronics", "Food Court"],
          verified: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "restaurants", label: "Restaurants" },
    { value: "cafes", label: "Cafes" },
    { value: "fitness", label: "Fitness" },
    { value: "beauty-spa", label: "Beauty & Spa" },
    { value: "shopping", label: "Shopping" },
    { value: "business-services", label: "Business Services" }
  ];

  const timeFrames = [
    { value: "all", label: "All Time" },
    { value: "month", label: "This Month" },
    { value: "week", label: "This Week" },
    { value: "year", label: "This Year" }
  ];

  const getRatingBadge = (rating: number) => {
    if (rating >= 4.8) return { icon: Crown, color: "text-yellow-500", bg: "bg-yellow-50", label: "Exceptional" };
    if (rating >= 4.5) return { icon: Trophy, color: "text-purple-500", bg: "bg-purple-50", label: "Outstanding" };
    if (rating >= 4.0) return { icon: Award, color: "text-blue-500", bg: "bg-blue-50", label: "Excellent" };
    return { icon: Star, color: "text-green-500", bg: "bg-green-50", label: "Great" };
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <Trophy className="w-12 h-12 text-yellow-500 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold animate-fade-in-up">
              Top <span className="gradient-text">Rated</span> Businesses
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up stagger-1">
            Discover the highest-rated businesses in your area, chosen by our community for exceptional quality and service.
          </p>
          <div className="flex items-center justify-center mt-6 animate-fade-in-up stagger-2">
            <Star className="w-5 h-5 text-yellow-500 mr-2" />
            <span className="text-muted-foreground">
              Based on customer reviews and ratings
            </span>
          </div>
        </div>
      </section>

      {/* Filters and Stats */}
      <section className="py-8 bg-card border-b border-card-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">Filters:</span>
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={timeFrame} onValueChange={setTimeFrame}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Time Frame" />
                </SelectTrigger>
                <SelectContent>
                  {timeFrames.map((tf) => (
                    <SelectItem key={tf.value} value={tf.value}>
                      {tf.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{businesses.length}</div>
                <div className="text-muted-foreground">Top Businesses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">4.7★</div>
                <div className="text-muted-foreground">Avg Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">15K+</div>
                <div className="text-muted-foreground">Total Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top 3 Showcase */}
      {businesses.length >= 3 && (
        <section className="py-12 bg-gradient-to-r from-yellow-50 to-orange-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">🏆 Hall of Fame</h2>
              <p className="text-muted-foreground">Our highest-rated businesses</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {businesses.slice(0, 3).map((business, index) => {
                const badge = getRatingBadge(business.rating);
                const BadgeIcon = badge.icon;

                return (
                  <Card key={business.id} className="relative overflow-hidden border-2 border-yellow-200 shadow-lg">
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className={`${badge.bg} ${badge.color} border-0 font-semibold`}>
                        <BadgeIcon className="w-4 h-4 mr-1" />
                        #{index + 1}
                      </Badge>
                    </div>
                    <div className="relative h-48">
                      <img
                        src={business.image}
                        alt={business.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-lg font-bold mb-1">{business.name}</h3>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className="font-semibold">{business.rating}</span>
                          </div>
                          <span className="text-sm">({business.reviewCount} reviews)</span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{business.category}</Badge>
                        <span className="text-sm text-muted-foreground">{business.distance}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Business Listings */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              All Top Rated Businesses
            </h2>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span>Sorted by rating</span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading top rated businesses...</p>
            </div>
          ) : businesses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business, index) => {
                const badge = getRatingBadge(business.rating);
                const BadgeIcon = badge.icon;

                return (
                  <div
                    key={business.id}
                    className={`animate-fade-in-up stagger-${Math.min(index % 6 + 1, 6)}`}
                  >
                    <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="absolute top-3 right-3 z-10">
                        <Badge className={`${badge.bg} ${badge.color} border-0 text-xs`}>
                          <BadgeIcon className="w-3 h-3 mr-1" />
                          {badge.label}
                        </Badge>
                      </div>
                      <BusinessCard business={business} />
                    </Card>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No businesses found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or check back later for new ratings.
              </p>
              <Button onClick={() => setSelectedCategory("all")}>
                Show All Categories
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TopRated;
