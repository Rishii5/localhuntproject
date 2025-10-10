import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  Star,
  MapPin,
  Phone,
  Clock,
  Globe,
  Heart,
  Share2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Camera,
  MessageCircle,
  ThumbsUp,
  User
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { ChatModal } from "@/components/ChatModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock business data
const businessData = {
  id: "1",
  name: "City General Hospital",
  category: "Multi-Specialty Hospital",
  rating: 4.7,
  reviewCount: 1248,
  address: "123 Medical Center Drive, Downtown Medical District, New York 10001",
  phone: "+1 (555) 123-4567",
  website: "www.citygeneralhospital.com",
  email: "info@citygeneralhospital.com",
  isOpen: true,
  openingHours: {
    monday: "24 Hours",
    tuesday: "24 Hours",
    wednesday: "24 Hours",
    thursday: "24 Hours",
    friday: "24 Hours",
    saturday: "24 Hours",
    sunday: "24 Hours"
  },
  distance: "0.8 km",
  tags: ["Emergency", "Insurance", "24/7", "ICU", "Surgery"],
  verified: true,
  description: "City General Hospital is a leading multi-specialty healthcare facility providing comprehensive medical services with state-of-the-art equipment and experienced medical professionals.",
  services: [
    "Emergency Care",
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Maternity",
    "Surgery",
    "ICU",
    "Radiology",
    "Laboratory"
  ],
  images: [
    "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=400&fit=crop"
  ]
};

const reviews = [
  {
    id: "1",
    user: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b1e2b8ae?w=40&h=40&fit=crop&crop=face",
    rating: 5,
    date: "2 days ago",
    comment: "Excellent service and very professional staff. The emergency department was quick and efficient.",
    helpful: 12
  },
  {
    id: "2",
    user: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    rating: 4,
    date: "1 week ago",
    comment: "Good facilities and clean environment. The doctors are knowledgeable and caring.",
    helpful: 8
  },
  {
    id: "3",
    user: "Emily Rodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    rating: 5,
    date: "2 weeks ago",
    comment: "Had surgery here and the entire team was amazing. Highly recommend this hospital.",
    helpful: 15
  }
];

export default function BusinessDetail() {
  const { id } = useParams();
  const [vendor, setVendor] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    setLoading(true);
    setError("");
    api.get(`/api/vendors/${id}`)
      .then((res) => {
        if (!isMounted) return;
        setVendor(res.data?.data || null);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err?.response?.data?.message || err?.message || "Failed to load business");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [id]);

  const businessData = useMemo(() => {
    if (!vendor) return null;
    return {
      id: vendor._id,
      name: vendor.shopName || "Business",
      category: vendor.category || "",
      rating: 4.6,
      reviewCount: 0,
      address: vendor.address || "",
      phone: vendor.phone || "",
      website: "",
      email: "",
      isOpen: true,
      openingHours: {},
      distance: "",
      tags: [],
      verified: true,
      description: vendor.description || "",
      services: [],
      images: [],
    };
  }, [vendor]);
  const vendorId = id;
  const [chatOpen, setChatOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === businessData.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? businessData.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Image Gallery */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={businessData.images[currentImageIndex]}
          alt={businessData.name}
          className="w-full h-full object-cover"
        />

        {/* Image Navigation */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all duration-200"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all duration-200"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Image Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {businessData.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentImageIndex ? "bg-white" : "bg-white/50"
                }`}
            />
          ))}
        </div>

        {/* Photo Count */}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full flex items-center space-x-1">
          <Camera className="w-4 h-4" />
          <span className="text-sm">{businessData.images.length} Photos</span>
        </div>
      </section>

      {/* Business Info */}
      <section className="py-8 border-b border-card-border">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-foreground">{businessData.name}</h1>
                    {businessData.verified && (
                      <Badge className="bg-success text-success-foreground">Verified</Badge>
                    )}
                  </div>
                  <p className="text-lg text-muted-foreground mb-4">
                    <Link
                      to={`/category/${(businessData.category || "").toLowerCase().replace(/\s+/g, '-')}`}
                      className="hover:text-primary underline-offset-4 hover:underline"
                    >
                      {businessData.category}
                    </Link>
                  </p>

                  {/* Rating */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${i < Math.floor(businessData.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-lg font-semibold">{businessData.rating}</span>
                      <span className="text-muted-foreground">({businessData.reviewCount} reviews)</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${businessData.isOpen
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive"
                      }`}>
                      {businessData.isOpen ? "Open Now" : "Closed"}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {businessData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={isFavorited ? "text-red-500 border-red-500" : ""}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isFavorited ? "fill-current" : ""}`} />
                    Save
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-6">{businessData.description}</p>

              {/* Services */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Services Offered</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {businessData.services.map((service) => (
                    <div key={service} className="flex items-center space-x-2 p-3 bg-background-alt rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Sidebar */}
            <div className="bg-card border border-card-border rounded-2xl p-6 h-fit">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-foreground">{businessData.address}</p>
                    <p className="text-xs text-muted-foreground">{businessData.distance} away</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-foreground">{businessData.phone}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-primary cursor-pointer hover:underline">
                    {businessData.website}
                  </span>
                </div>

                <div className="pt-4">
                  <Button className="w-full btn-hero mb-3">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MapPin className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                  <Button variant="outline" className="w-full mt-3" onClick={() => setChatOpen(true)}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat with Vendor
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="hours">Hours</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
            </TabsList>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-card border border-card-border rounded-xl p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage src={review.avatar} alt={review.user} />
                        <AvatarFallback>
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-foreground">{review.user}</h4>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < review.rating
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                      }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">{review.date}</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-3">{review.comment}</p>

                        <div className="flex items-center space-x-4">
                          <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                            <ThumbsUp className="w-4 h-4" />
                            <span>Helpful ({review.helpful})</span>
                          </button>
                          <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                            <MessageCircle className="w-4 h-4" />
                            <span>Reply</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="text-center">
                  <Button variant="outline">Load More Reviews</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="hours" className="mt-6">
              <div className="bg-card border border-card-border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Opening Hours</h3>
                <div className="space-y-3">
                  {Object.entries(businessData.openingHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between items-center">
                      <span className="capitalize font-medium">{day}</span>
                      <span className="text-muted-foreground">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="photos" className="mt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {businessData.images.map((image, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-xl">
                    <img
                      src={image}
                      alt={`${businessData.name} photo ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
      <ChatModal vendorId={vendorId || ""} open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
};