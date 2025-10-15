import { useState, useEffect } from "react";
import { MapPin, Navigation, Filter, Star, Clock, Phone } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BusinessCard } from "@/components/BusinessCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/lib/api";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

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
  location: {
    lat: number;
    lng: number;
  };
}

const NearMe = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("distance");

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchNearbyBusinesses();
    }
  }, [userLocation, selectedCategory, sortBy]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to default location (e.g., city center)
          setUserLocation({ lat: 40.7128, lng: -74.0060 }); // New York City
        }
      );
    } else {
      // Fallback for browsers without geolocation
      setUserLocation({ lat: 40.7128, lng: -74.0060 });
    }
  };

  const fetchNearbyBusinesses = async () => {
    if (!userLocation) return;

    try {
      setLoading(true);
      const params = new URLSearchParams({
        lat: userLocation.lat.toString(),
        lng: userLocation.lng.toString(),
        radius: '10', // 10km radius
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        sort: sortBy
      });

      const response = await api.get(`/api/vendors/nearby?${params}`);
      setBusinesses(response.data.data || []);
    } catch (error) {
      console.error("Error fetching nearby businesses:", error);
      // Mock data for demonstration
      setBusinesses([
        {
          id: "1",
          name: "Downtown Coffee Shop",
          category: "Cafes",
          rating: 4.5,
          reviewCount: 128,
          address: "123 Main St, Downtown",
          phone: "+1 (555) 123-4567",
          image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop",
          isOpen: true,
          distance: "0.3 km",
          tags: ["Coffee", "WiFi", "Breakfast"],
          verified: true,
          location: { lat: userLocation.lat + 0.003, lng: userLocation.lng + 0.003 }
        },
        {
          id: "2",
          name: "City Fitness Center",
          category: "Fitness",
          rating: 4.7,
          reviewCount: 89,
          address: "456 Fitness Ave, Midtown",
          phone: "+1 (555) 987-6543",
          image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          isOpen: true,
          distance: "0.8 km",
          tags: ["Gym", "Personal Training", "24/7"],
          verified: true,
          location: { lat: userLocation.lat - 0.005, lng: userLocation.lng + 0.002 }
        },
        {
          id: "3",
          name: "Green Garden Restaurant",
          category: "Restaurants",
          rating: 4.3,
          reviewCount: 256,
          address: "789 Garden St, Uptown",
          phone: "+1 (555) 456-7890",
          image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
          isOpen: false,
          distance: "1.2 km",
          tags: ["Italian", "Vegetarian", "Outdoor"],
          verified: true,
          location: { lat: userLocation.lat + 0.008, lng: userLocation.lng - 0.004 }
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
    { value: "shopping", label: "Shopping" },
    { value: "services", label: "Services" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">
            Businesses <span className="gradient-text">Near You</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up stagger-1">
            Discover local businesses in your area. Find restaurants, shops, and services nearby.
          </p>
          {userLocation && (
            <div className="flex items-center justify-center mt-6 animate-fade-in-up stagger-2">
              <MapPin className="w-5 h-5 text-primary mr-2" />
              <span className="text-muted-foreground">
                Showing results near your location
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Map and Filters */}
      <section className="py-8 bg-card border-b border-card-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Nearby Businesses Map
                  </CardTitle>
                  <CardDescription>
                    Interactive map showing businesses in your area
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userLocation ? (
                    <div className="h-96 rounded-lg overflow-hidden">
                      <MapContainer
                        center={[userLocation.lat, userLocation.lng]}
                        zoom={14}
                        style={{ height: '100%', width: '100%' }}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {/* User location marker */}
                        <Marker position={[userLocation.lat, userLocation.lng]}>
                          <Popup>
                            <div className="text-center">
                              <h3 className="font-semibold">Your Location</h3>
                              <p className="text-sm">You are here</p>
                            </div>
                          </Popup>
                        </Marker>
                        {/* Business markers */}
                        {businesses.map((business) => (
                          <Marker key={business.id} position={[business.location.lat, business.location.lng]}>
                            <Popup>
                              <div className="text-center">
                                <h3 className="font-semibold">{business.name}</h3>
                                <p className="text-sm">{business.category}</p>
                                <p className="text-sm text-muted-foreground">{business.distance}</p>
                                <div className="flex items-center justify-center mt-2">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                                  <span className="text-sm">{business.rating}</span>
                                </div>
                              </div>
                            </Popup>
                          </Marker>
                        ))}
                      </MapContainer>
                    </div>
                  ) : (
                    <div className="h-96 flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <Navigation className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Getting your location...</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Filter className="w-5 h-5 mr-2" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Sort by</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort options" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="distance">Distance</SelectItem>
                        <SelectItem value="rating">Rating</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quick Filters</label>
                    <div className="space-y-2">
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                        Open Now
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                        Highly Rated
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                        Verified
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Navigation className="w-5 h-5 mr-2" />
                    Your Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userLocation ? (
                    <div className="text-sm space-y-2">
                      <p className="text-muted-foreground">
                        Latitude: {userLocation.lat.toFixed(4)}
                      </p>
                      <p className="text-muted-foreground">
                        Longitude: {userLocation.lng.toFixed(4)}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={getUserLocation}
                        className="w-full mt-3"
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Refresh Location
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Navigation className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Location access needed</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={getUserLocation}
                        className="mt-2"
                      >
                        Enable Location
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Business Listings */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              Nearby Businesses ({businesses.length})
            </h2>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>Within 10km radius</span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Finding businesses near you...</p>
            </div>
          ) : businesses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business, index) => (
                <div
                  key={business.id}
                  className={`animate-fade-in-up stagger-${Math.min(index % 6 + 1, 6)}`}
                >
                  <BusinessCard business={business} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No businesses found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or expanding your search radius.
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

export default NearMe;
