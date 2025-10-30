import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Star, Users, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const stats = [
    { icon: Building, count: "50K+", label: "Businesses" },
    { icon: Users, count: "2M+", label: "Happy Users" },
    { icon: Star, count: "4.8", label: "Average Rating" },
    { icon: MapPin, count: "100+", label: "Cities" }
  ];

  const popularSearches = [
    "Restaurants", "Hotels", "Hospitals", "Shopping", "Beauty Salons", "Gyms"
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-accent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            Find <span className="gradient-text">Local Businesses</span>
            <br />
            Near You
          </h1>

          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in-up stagger-1">
            Discover the best restaurants, services, and businesses in your area.
            Connect with verified local providers and read authentic reviews.
          </p>

          {/* Search Form */}
          <div className="bg-white rounded-2xl shadow-elegant p-6 md:p-8 mb-12 animate-scale-in stagger-2">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input pl-12 h-14"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Enter location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="search-input pl-12 h-14"
                />
              </div>
            </div>
            <Button
              className="btn-hero w-full md:w-auto mt-6 h-14 px-12"
              onClick={() => {
                const params = new URLSearchParams();
                if (searchQuery) params.set("q", searchQuery);
                if (location) params.set("locationText", location);
                navigate(`/search?${params.toString()}`);
              }}
            >
              <Search className="w-5 h-5 mr-2" />
              Search Now
            </Button>
          </div>

          {/* Popular Searches */}
          <div className="mb-12 animate-fade-in-up stagger-3">
            <p className="text-muted-foreground mb-4">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {popularSearches.map((search, index) => (
                <Button
                  key={search}
                  variant="outline"
                  size="sm"
                  className="rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                  onClick={() => {
                    const params = new URLSearchParams();
                    params.set("q", search);
                    navigate(`/search?${params.toString()}`);
                  }}
                >
                  {search}
                </Button>
              ))}
            </div>
          </div>

          {/* Vendor Dashboard Demo */}
          <div className="mb-12 animate-fade-in-up stagger-3">
            <p className="text-muted-foreground mb-4">Try our vendor dashboard:</p>
            <Button
              variant="outline"
              className="rounded-full hover:bg-secondary hover:text-secondary-foreground transition-all duration-200"
              onClick={() => navigate('/vendor-dashboard')}
            >
              <Building className="w-4 h-4 mr-2" />
              Vendor Dashboard Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in-up stagger-4">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="bg-gradient-to-r from-primary to-secondary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{stat.count}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};